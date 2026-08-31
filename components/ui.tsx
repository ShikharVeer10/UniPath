'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Check, ChevronDown, Clock3, Sparkles } from 'lucide-react';
import { parseRecommendation } from '@/lib/api';

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
            UniPath<span className="text-primary">.</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link href="/history" className="transition-colors hover:text-foreground">History</Link>
            <Link href="/evaluate" className="inline-flex items-center rounded-full bg-foreground px-4 py-2 font-medium text-background transition-transform hover:scale-[1.02]">
              Evaluate profile <ArrowRight className="ml-1 size-4" />
            </Link>
          </nav>

          <div className="md:hidden">
            <Link href="/evaluate" className="inline-flex items-center rounded-full bg-foreground px-3.5 py-2 text-sm font-medium text-background">
              Evaluate
            </Link>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

export function Probability({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, Math.round(value * 100)));
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 text-right text-sm font-semibold text-foreground">{pct}%</span>
    </div>
  );
}

export function UniversityCard({ item }: { item: Record<string, unknown> }) {
  const [open, setOpen] = useState(false);
  const recommendation = parseRecommendation(item);

  if (!recommendation) {
    return (
      <div className="rounded-2xl border border-dashed bg-muted/20 p-5 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Unexpected recommendation format</p>
        <pre className="mt-3 max-h-40 overflow-auto rounded-lg bg-background p-3 text-[11px] leading-5 text-muted-foreground">
          {JSON.stringify(item, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <article className="animate-fade-up rounded-2xl border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug text-foreground">{recommendation.university_name}</h3>
        <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {recommendation.category}
        </span>
      </div>

      <Probability value={recommendation.acceptance_probability} />

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="mt-5 flex w-full items-center justify-between text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Why this fit
        <ChevronDown className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && <p className="mt-3 border-t pt-3 text-sm leading-6 text-muted-foreground">{recommendation.rationale}</p>}
    </article>
  );
}

export function ResultsPanel({ evaluation, onEdit }: { evaluation: any; onEdit: () => void }) {
  const keyStrengths = Array.isArray(evaluation?.key_strengths) ? evaluation.key_strengths : [];
  const areasForImprovement = Array.isArray(evaluation?.areas_for_improvement) ? evaluation.areas_for_improvement : [];
  const recommendations = Array.isArray(evaluation?.recommendations) ? evaluation.recommendations : [];
  const groups = ['Ambitious', 'Target', 'Safe'];

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="rounded-2xl border bg-card p-6 md:p-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Your readout</p>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">A clearer path forward.</h1>
          <button type="button" onClick={onEdit} className="text-sm font-medium text-primary transition-colors hover:text-primary/80">
            Edit profile
          </button>
        </div>
        <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground">{evaluation?.profile_summary || 'No profile summary was returned for this evaluation.'}</p>

        <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
          {[evaluation?.target_country, evaluation?.target_program, `${evaluation?.cgpa ?? '—'} CGPA`].filter(Boolean).map((item) => (
            <span key={item} className="rounded-full border bg-muted/30 px-2.5 py-1.5">{item}</span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border bg-card p-6 transition-all duration-200 hover:border-primary/30">
          <div className="mb-4 flex items-center gap-2">
            <Check className="size-4 text-primary" />
            <h2 className="text-lg font-semibold">What’s working</h2>
          </div>
          <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
            {keyStrengths.length ? keyStrengths.map((item: string) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 size-2 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            )) : <li>No strengths were returned for this profile.</li>}
          </ul>
        </section>

        <section className="rounded-2xl border bg-card p-6 transition-all duration-200 hover:border-primary/30">
          <div className="mb-4 flex items-center gap-2">
            <Clock3 className="size-4 text-primary" />
            <h2 className="text-lg font-semibold">Worth strengthening</h2>
          </div>
          <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
            {areasForImprovement.length ? areasForImprovement.map((item: string) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 size-2 rounded-full bg-primary/60" />
                <span>{item}</span>
              </li>
            )) : <li>No improvement suggestions were returned for this profile.</li>}
          </ul>
        </section>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Your shortlist</p>
            <h2 className="mt-2 text-2xl font-semibold">Where to apply</h2>
          </div>
          <span className="text-sm text-muted-foreground">{evaluation?.target_program || 'Program'} · {evaluation?.target_country || 'Country'}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {groups.map((group) => {
            const list = recommendations.filter((item: any) => item?.category === group);
            return (
              <div key={group} className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">{group}</h3>
                {list.length ? list.map((item: any, index: number) => <UniversityCard key={`${group}-${index}`} item={item} />) : (
                  <div className="rounded-2xl border border-dashed bg-muted/20 p-5 text-sm text-muted-foreground">
                    No recommendations in this band yet.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function LoadingAnalysis() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
      <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="size-6 animate-pulse" />
      </div>
      <h2 className="text-xl font-semibold">Analyzing your profile</h2>
      <p className="mt-2 text-sm text-muted-foreground">Matching historical admits and generating your shortlist…</p>
    </div>
  );
}
