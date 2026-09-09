export type EvaluationRequest = {
  target_country: string;
  target_program: string;
  cgpa: number;
  gre_score?: number;
  toefl_score?: number;
  research_papers?: number;
  work_experience_months?: number;
  detected_strengths?: string[];
  detected_challenges?: string[];
};

export type Recommendation = {
  university_name: string;
  category: 'Ambitious' | 'Target' | 'Safe';
  acceptance_probability: number;
  rationale: string;
  requirements?: Record<string, string>;
  tailored_advice?: string;
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
  if (typeof body?.detail === 'string' && body.detail.trim()) return body.detail;
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
  parseResume: async (file: File): Promise<Partial<EvaluationRequest>> => {
    const formData = new FormData();
    formData.append('file', file);
    return request<Partial<EvaluationRequest>>('/profile/parse-resume', {
      method: 'POST',
      body: formData,
    });
  },
  getUniversities: (params?: { search?: string; country?: string; max_rank?: number; skip?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.country) searchParams.set('country', params.country);
    if (params?.max_rank) searchParams.set('max_rank', String(params.max_rank));
    if (params?.skip !== undefined) searchParams.set('skip', String(params.skip));
    if (params?.limit !== undefined) searchParams.set('limit', String(params.limit));
    const query = searchParams.toString();
    return request<Array<{
      id: string;
      name: string;
      country: string;
      ranking: number | null;
      tuition: number | null;
    }>>(`/universities/${query ? `?${query}` : ''}`);
  },
  getUniversityStats: (universityId: string) => {
    return request<{
      university_id: string;
      university_name: string;
      programs: Array<{
        program_name: string;
        total_applicants: number;
        admitted_count: number;
        acceptance_rate: number;
        international_students_count: number;
        avg_cgpa: number;
        avg_gre: number | null;
      }>;
    }>(`/universities/${universityId}/stats`);
  },
  predictAcceptance: (
    universityId: string,
    data: {
      program_name: string;
      cgpa: number;
      gre_score?: number;
      toefl_score?: number;
      research_papers?: number;
      work_experience_months?: number;
    }
  ) => {
    return request<{
      university_id: string;
      university_name: string;
      program_name: string;
      category: string;
      acceptance_probability: number;
      rationale: string;
      historical_matches_analyzed: number;
    }>(`/universities/${universityId}/predict-acceptance`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  askAdvisor: (data: {
    query_text: string;
    user_cgpa: number;
    user_gre?: number;
    target_program: string;
    university_name?: string;
  }) => {
    return request<{ answer: string; retrieved_context: string[] }>('/advisor/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
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
    requirements: typeof raw.requirements === 'object' && raw.requirements !== null ? (raw.requirements as Record<string, string>) : undefined,
    tailored_advice: typeof raw.tailored_advice === 'string' ? raw.tailored_advice : undefined,
  };
}
