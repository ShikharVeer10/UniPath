export type EvaluationRequest = {
  target_country: string;
  target_program: string;
  cgpa: number;
  gre_score?: number;
  toefl_score?: number;
  research_papers?: number;
  work_experience_months?: number;
};

export type Recommendation = {
  university_name: string;
  category: 'Ambitious' | 'Target' | 'Safe';
  acceptance_probability: number;
  rationale: string;
};

export type EvaluationResponse = EvaluationRequest & {
  id: number;
  research_papers: number;
  work_experience_months: number;
  profile_summary: string;
  key_strengths: string[];
  areas_for_improvement: string[];
  recommendations: Record<string, unknown>[];
  created_at: string;
};

type ApiFieldError = {
  loc: Array<string | number>;
  msg: string;
  type: string;
};

export type ApiError = Error & {
  status?: number;
  fields?: Record<string, string>;
};

const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '') + '/api/v1';

export function token() {
  return typeof window === 'undefined' ? null : sessionStorage.getItem('unipath_token');
}

function parseValidationFields(detail: unknown): Record<string, string> {
  if (!Array.isArray(detail)) return {};
  return detail.reduce<Record<string, string>>((acc, item) => {
    const entry = item as Partial<ApiFieldError>;
    const key = Array.isArray(entry.loc) && entry.loc.length > 0 ? String(entry.loc[entry.loc.length - 1]) : 'form';
    if (entry.msg) acc[key] = entry.msg;
    return acc;
  }, {});
}

function parseErrorMessage(body: any, status: number) {
  if (Array.isArray(body?.detail)) {
    const messages = body.detail.map((item: any) => item?.msg).filter(Boolean);
    if (messages.length) return messages.join(', ');
  }
  if (typeof body?.detail === 'string') return body.detail;
  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status >= 500) return 'The UniPath server is unavailable. Check the backend connection.';
  return 'Something went wrong while talking to UniPath.';
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers || {});
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const t = token();
  if (t) headers.set('Authorization', `Bearer ${t}`);

  let res: Response;
  try {
    res = await fetch(`${base}${path}`, { ...init, headers });
  } catch {
    throw new Error(`Cannot reach UniPath API at ${base}. Start the backend and check its database connection.`) as ApiError;
  }

  if (!res.ok) {
    let body: any = {};
    try {
      body = await res.json();
    } catch {
      body = {};
    }

    const error = new Error(parseErrorMessage(body, res.status)) as ApiError;
    error.status = res.status;
    error.fields = parseValidationFields(body?.detail);
    throw error;
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  register: (body: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: async (email: string, password: string) => {
    const form = new URLSearchParams({ username: email, password });
    let res: Response;
    try {
      res = await fetch(`${base}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form,
      });
    } catch {
      throw new Error(`Cannot reach UniPath API at ${base}. Start the backend and check its database connection.`) as ApiError;
    }

    if (!res.ok) {
      let body: any = {};
      try {
        body = await res.json();
      } catch {
        body = {};
      }
      throw new Error(parseErrorMessage(body, res.status));
    }

    return (await res.json()) as { access_token: string; token_type: 'bearer' };
  },
  evaluate: (body: EvaluationRequest) => request<EvaluationResponse>('/evaluations/', { method: 'POST', body: JSON.stringify(body) }),
  history: () => request<EvaluationResponse[]>('/evaluations/history'),
};

export function parseRecommendation(raw: Record<string, unknown>): Recommendation | null {
  const category = raw.category;
  if (
    typeof raw.university_name !== 'string' ||
    typeof raw.rationale !== 'string' ||
    typeof raw.acceptance_probability !== 'number' ||
    Number.isNaN(raw.acceptance_probability) ||
    !['Ambitious', 'Target', 'Safe'].includes(String(category))
  ) {
    return null;
  }

  return {
    university_name: raw.university_name,
    category: category as Recommendation['category'],
    acceptance_probability: raw.acceptance_probability,
    rationale: raw.rationale,
  };
}
