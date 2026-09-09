'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Minus, Plus, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { api, EvaluationRequest } from '@/lib/api';

const countryOptions = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'Australia',
  'Netherlands',
  'Ireland',
  'New Zealand',
  'Sweden',
  'France',
  'Finland',
  'Norway',
  'Belgium',
  'Singapore',
];

const programOptions = [
  'Computer Science',
  'Data Science',
  'Artificial Intelligence',
  'Machine Learning',
  'Software Engineering',
  'Electrical Engineering',
  'Statistics',
  'Robotics',
  'Cybersecurity',
  'Business Analytics',
];

const initialDraft: EvaluationRequest = {
  target_country: '',
  target_program: '',
  cgpa: 0,
  gre_score: undefined,
  toefl_score: undefined,
  research_papers: 0,
  work_experience_months: 0,
};

const analysisSteps = ['Analyzing your profile…', 'Matching historical admits…', 'Generating recommendations…'];

function getFieldErrorName(raw: string) {
  const value = raw.replace(/\[(\d+)\]/g, '.$1');
  const parts = value.split('.');
  return parts[parts.length - 1] || 'form';
}

export function EvaluationForm({ onResult, initialValue = initialDraft }: { onResult: (value: any) => void; initialValue?: EvaluationRequest }) {
  const [form, setForm] = useState<EvaluationRequest>(initialValue);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeSuccess, setResumeSuccess] = useState<string | null>(null);

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setResumeSuccess(null);
    setErrors({});

    try {
      const parsed: any = await api.parseResume(file);
      setForm((prev) => ({
        ...prev,
        target_country: parsed.target_country || prev.target_country,
        target_program: parsed.target_program || prev.target_program,
        cgpa: parsed.cgpa !== undefined ? parsed.cgpa : prev.cgpa,
        gre_score: parsed.gre_score !== undefined ? parsed.gre_score : prev.gre_score,
        toefl_score: parsed.toefl_score !== undefined ? parsed.toefl_score : prev.toefl_score,
        research_papers: parsed.research_papers !== undefined ? parsed.research_papers : prev.research_papers,
        work_experience_months: parsed.work_experience_months !== undefined ? parsed.work_experience_months : prev.work_experience_months,
        detected_strengths: parsed.detected_strengths || prev.detected_strengths,
        detected_challenges: parsed.detected_challenges || prev.detected_challenges,
      }));
      const strengthCount = parsed.detected_strengths?.length || 0;
      setResumeSuccess(`Parsed ${file.name} successfully (${strengthCount} profile traits detected)`);
    } catch (err: any) {
      setErrors({ form: err?.message || 'Failed to extract resume details.' });
    } finally {
      setUploadingResume(false);
      event.target.value = '';
    }
  };

  useEffect(() => {
    if (!loading) return;
    const timer = window.setInterval(() => {
      setStatusIndex((current) => (current + 1) % analysisSteps.length);
    }, 1100);
    return () => window.clearInterval(timer);
  }, [loading]);

  const setField = <K extends keyof EvaluationRequest>(key: K, value: EvaluationRequest[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!form.target_country?.trim()) nextErrors.target_country = 'Choose a target country.';
    if (!form.target_program?.trim()) nextErrors.target_program = 'Enter the program you want to pursue.';
    if (Number(form.cgpa) < 0 || Number(form.cgpa) > 10 || Number.isNaN(Number(form.cgpa))) {
      nextErrors.cgpa = 'CGPA must be between 0 and 10.';
    }
    if (form.gre_score !== undefined && (form.gre_score < 260 || form.gre_score > 340)) {
      nextErrors.gre_score = 'GRE should be between 260 and 340.';
    }
    if (form.toefl_score !== undefined && (form.toefl_score < 0 || form.toefl_score > 120)) {
      nextErrors.toefl_score = 'TOEFL should be between 0 and 120.';
    }
    if ((form.research_papers ?? 0) < 0) nextErrors.research_papers = 'Research papers cannot be negative.';
    if ((form.work_experience_months ?? 0) < 0) nextErrors.work_experience_months = 'Work experience cannot be negative.';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    setStatusIndex(0);

    try {
      const payload: EvaluationRequest = {
        target_country: form.target_country.trim(),
        target_program: form.target_program.trim(),
        cgpa: Number(form.cgpa),
        gre_score: form.gre_score !== undefined ? Number(form.gre_score) : undefined,
        toefl_score: form.toefl_score !== undefined ? Number(form.toefl_score) : undefined,
        research_papers: Number(form.research_papers ?? 0),
        work_experience_months: Number(form.work_experience_months ?? 0),
        detected_strengths: form.detected_strengths || [],
        detected_challenges: form.detected_challenges || [],
      };
      const result = await api.evaluate(payload);
      onResult(result);
    } catch (error: any) {
      const fieldErrors = error?.fields && typeof error.fields === 'object' ? error.fields : {};
      if (Object.keys(fieldErrors).length > 0) {
        const mapped: Record<string, string> = {};
        Object.entries(fieldErrors).forEach(([key, value]) => {
          mapped[getFieldErrorName(key)] = String(value);
        });
        setErrors(mapped);
      } else {
        setErrors({ form: error?.message || 'Unable to evaluate your profile right now.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const grePercent = useMemo(() => {
    if (form.gre_score === undefined || form.gre_score === null) return 35;
    return ((form.gre_score - 260) / (340 - 260)) * 100;
  }, [form.gre_score]);

  const toeflPercent = useMemo(() => {
    if (form.toefl_score === undefined || form.toefl_score === null) return 30;
    return (form.toefl_score / 120) * 100;
  }, [form.toefl_score]);

  if (loading) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
        <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <div className="size-6 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        </div>
        <h2 className="text-xl font-semibold">{analysisSteps[statusIndex]}</h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          UniPath is comparing your profile against historical admits and generating a realistic shortlist.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-7">
      {errors.form && <p className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-primary">{errors.form}</p>}

      {/* Resume Autofill Banner */}
      <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/[0.03] p-4 sm:p-5 transition-all duration-200 hover:border-primary/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UploadCloud className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-foreground">Autofill with your resume</p>
              <p className="text-xs text-muted-foreground mt-0.5">Upload a PDF to parse your CGPA, test scores, and experience automatically.</p>
            </div>
          </div>

          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition-all duration-200 hover:border-primary/40 hover:text-primary hover:shadow-sm">
            {uploadingResume ? (
              <span className="inline-flex items-center gap-2">
                <span className="size-3 animate-spin rounded-full border border-primary border-t-transparent" />
                Parsing PDF…
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <FileText className="size-3.5" />
                Choose PDF
              </span>
            )}
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleResumeUpload}
              disabled={uploadingResume}
            />
          </label>
        </div>

        {resumeSuccess && (
          <div className="mt-3 flex items-center gap-1.5 border-t border-primary/10 pt-3 text-xs font-medium text-emerald-600">
            <CheckCircle2 className="size-3.5 shrink-0" />
            <span>{resumeSuccess}</span>
          </div>
        )}
      </div>

      <div className="mb-2 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
        {['Target country', 'Program fit', 'Academic profile', 'Research & work'].map((label) => (
          <span key={label} className="rounded-full border bg-muted/30 px-2.5 py-1.5">{label}</span>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-medium text-foreground md:col-span-1">
          <span className="mb-2 block">Target country</span>
          <input
            list="country-options"
            value={form.target_country}
            onChange={(event) => setField('target_country', event.target.value)}
            placeholder="United States"
            className="w-full"
          />
          <datalist id="country-options">
            {countryOptions.map((country) => <option key={country} value={country} />)}
          </datalist>
          {errors.target_country && <span className="mt-2 block text-xs text-primary">{errors.target_country}</span>}
        </label>

        <label className="block text-sm font-medium text-foreground md:col-span-1">
          <span className="mb-2 block">Target program</span>
          <input
            list="program-options"
            value={form.target_program}
            onChange={(event) => setField('target_program', event.target.value)}
            placeholder="Computer Science"
            className="w-full"
          />
          <datalist id="program-options">
            {programOptions.map((program) => <option key={program} value={program} />)}
          </datalist>
          {errors.target_program && <span className="mt-2 block text-xs text-primary">{errors.target_program}</span>}
        </label>

        <label className="block text-sm font-medium text-foreground">
          <span className="mb-2 block">CGPA · 0–10</span>
          <input
            type="number"
            step="0.01"
            min="0"
            max="10"
            value={form.cgpa === 0 ? '' : form.cgpa}
            onChange={(event) => setField('cgpa', Number(event.target.value || 0))}
            placeholder="8.7"
            className="w-full"
          />
          {errors.cgpa && <span className="mt-2 block text-xs text-primary">{errors.cgpa}</span>}
        </label>

        <div className="space-y-2 rounded-2xl border bg-muted/20 p-4 text-sm font-medium text-foreground">
          <div className="flex items-center justify-between gap-2">
            <span>GRE · optional</span>
            <span className="text-muted-foreground">{form.gre_score ?? 0}</span>
          </div>
          <input
            type="range"
            min={260}
            max={340}
            step={1}
            value={form.gre_score ?? 260}
            onChange={(event) => setField('gre_score', Number(event.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>260</span>
            <span>340</span>
          </div>
          {errors.gre_score && <span className="block text-xs text-primary">{errors.gre_score}</span>}
        </div>

        <div className="space-y-2 rounded-2xl border bg-muted/20 p-4 text-sm font-medium text-foreground">
          <div className="flex items-center justify-between gap-2">
            <span>TOEFL · optional</span>
            <span className="text-muted-foreground">{form.toefl_score ?? 0}</span>
          </div>
          <input
            type="range"
            min={0}
            max={120}
            step={1}
            value={form.toefl_score ?? 0}
            onChange={(event) => setField('toefl_score', Number(event.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>0</span>
            <span>120</span>
          </div>
          {errors.toefl_score && <span className="block text-xs text-primary">{errors.toefl_score}</span>}
        </div>

        <div className="rounded-2xl border bg-muted/20 p-4">
          <div className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>Research papers</span>
            <span className="text-primary">{form.research_papers ?? 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setField('research_papers', Math.max(0, (form.research_papers ?? 0) - 1))} className="rounded-lg border p-2 transition-colors hover:border-primary/40 hover:text-primary">
              <Minus className="size-4" />
            </button>
            <input
              type="number"
              min="0"
              value={form.research_papers ?? 0}
              onChange={(event) => setField('research_papers', Number(event.target.value || 0))}
              className="w-full text-center"
            />
            <button type="button" onClick={() => setField('research_papers', (form.research_papers ?? 0) + 1)} className="rounded-lg border p-2 transition-colors hover:border-primary/40 hover:text-primary">
              <Plus className="size-4" />
            </button>
          </div>
          {errors.research_papers && <span className="mt-2 block text-xs text-primary">{errors.research_papers}</span>}
        </div>

        <div className="rounded-2xl border bg-muted/20 p-4">
          <div className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>Work experience</span>
            <span className="text-primary">{form.work_experience_months ?? 0} mo</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setField('work_experience_months', Math.max(0, (form.work_experience_months ?? 0) - 1))} className="rounded-lg border p-2 transition-colors hover:border-primary/40 hover:text-primary">
              <Minus className="size-4" />
            </button>
            <input
              type="number"
              min="0"
              value={form.work_experience_months ?? 0}
              onChange={(event) => setField('work_experience_months', Number(event.target.value || 0))}
              className="w-full text-center"
            />
            <button type="button" onClick={() => setField('work_experience_months', (form.work_experience_months ?? 0) + 1)} className="rounded-lg border p-2 transition-colors hover:border-primary/40 hover:text-primary">
              <Plus className="size-4" />
            </button>
          </div>
          {errors.work_experience_months && <span className="mt-2 block text-xs text-primary">{errors.work_experience_months}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Profile fit</span>
          <span className="ml-2">{Math.min(100, Math.max(0, Math.round((grePercent + toeflPercent) / 2)))}%</span>
        </div>
        <button type="submit" className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3.5 font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(188,93,60,0.18)]">
          See my chances
          <ArrowRight className="ml-2 size-4" />
        </button>
      </div>
    </form>
  );
}
