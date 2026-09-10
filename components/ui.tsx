'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Check, ChevronDown, Clock3, Sparkles, Compass, ExternalLink, BookOpen, ListChecks, Lightbulb } from 'lucide-react';
import { parseRecommendation } from '@/lib/api';
import { AdvisorChatbot } from '@/components/advisor-chatbot';

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
            UniPath<span className="text-primary">.</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link href="/explore" className="transition-colors hover:text-foreground">Explore</Link>
            <Link href="/interview" className="transition-colors hover:text-foreground">AI Interview</Link>
            <Link href="/history" className="transition-colors hover:text-foreground">History</Link>
            <Link href="/evaluate" className="inline-flex items-center rounded-full bg-foreground px-4 py-2 font-medium text-background transition-transform hover:scale-[1.02]">
              Evaluate profile <ArrowRight className="ml-1 size-4" />
            </Link>
          </nav>

          <div className="flex items-center gap-3 md:hidden">
            <Link href="/explore" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Explore
            </Link>
            <Link href="/interview" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Interview
            </Link>
            <Link href="/evaluate" className="inline-flex items-center rounded-full bg-foreground px-3.5 py-2 text-sm font-medium text-background">
              Evaluate
            </Link>
          </div>
        </div>
      </header>
      {children}
      <AdvisorChatbot />
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
  const [activeTab, setActiveTab] = useState<'fit' | 'reqs' | 'advice'>('fit');
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

  const reqs = recommendation.requirements || {};

  return (
    <article className="animate-fade-up rounded-2xl border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug text-foreground">{recommendation.university_name}</h3>
        <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {recommendation.category}
        </span>
      </div>

      <Probability value={recommendation.acceptance_probability} />

      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs">
        <button
          type="button"
          onClick={() => {
            if (open && activeTab === 'fit') {
              setOpen(false);
            } else {
              setActiveTab('fit');
              setOpen(true);
            }
          }}
          className={`font-medium transition-colors ${open && activeTab === 'fit' ? 'text-primary font-semibold underline' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Selectivity Rationale
        </button>

        <button
          type="button"
          onClick={() => {
            if (open && activeTab === 'reqs') {
              setOpen(false);
            } else {
              setActiveTab('reqs');
              setOpen(true);
            }
          }}
          className={`font-medium transition-colors ${open && activeTab === 'reqs' ? 'text-primary font-semibold underline' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Criteria
        </button>

        <button
          type="button"
          onClick={() => {
            if (open && activeTab === 'advice') {
              setOpen(false);
            } else {
              setActiveTab('advice');
              setOpen(true);
            }
          }}
          className={`font-medium transition-colors ${open && activeTab === 'advice' ? 'text-primary font-semibold underline' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Improve Chances
        </button>
      </div>

      {open && (
        <div className="mt-3 rounded-xl bg-muted/20 p-3.5 text-xs text-muted-foreground transition-all duration-200">
          {activeTab === 'fit' && (
            <div>
              <p className="font-semibold text-foreground mb-1">Selectivity Assessment</p>
              <p className="leading-relaxed whitespace-pre-line">{recommendation.rationale}</p>
            </div>
          )}

          {activeTab === 'reqs' && (
            <div className="space-y-2">
              <p className="font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                <ListChecks className="size-3.5 text-primary" />
                Official Program Requirements
              </p>
              {Object.keys(reqs).length > 0 ? (
                Object.entries(reqs).map(([key, val]) => (
                  <div key={key} className="flex flex-col border-b border-border/40 pb-1.5 last:border-0 last:pb-0">
                    <span className="font-semibold text-foreground text-[11px]">{key}</span>
                    <span className="text-[11px] text-muted-foreground">{val}</span>
                  </div>
                ))
              ) : (
                <p className="leading-relaxed">Benchmark criteria: Minimum 7.5 CGPA, GRE Optional, TOEFL 85+ / IELTS 6.5+.</p>
              )}
            </div>
          )}

          {activeTab === 'advice' && (
            <div>
              <p className="font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                <Lightbulb className="size-3.5 text-primary" />
                Tailored Admission Strategy
              </p>
              <p className="leading-relaxed whitespace-pre-line">
                {recommendation.tailored_advice ||
                  `To maximize your admission odds at ${recommendation.university_name}, highlight faculty alignment in your SOP and publish verifiable production repositories on GitHub.`}
              </p>
            </div>
          )}

          <div className="mt-3.5 flex items-center justify-between border-t border-border/40 pt-2.5">
            <Link
              href={`/interview?university=${encodeURIComponent(recommendation.university_name)}`}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:underline"
            >
              <Sparkles className="size-3 text-primary" />
              Practice AI Mock Interview for {recommendation.university_name} →
            </Link>
          </div>
        </div>
      )}
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
            {keyStrengths.length ? keyStrengths.map((item: string, idx: number) => (
              <li key={idx} className="flex gap-3">
                <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
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
          <ul className="space-y-3.5 text-sm leading-6 text-muted-foreground">
            {areasForImprovement.length ? areasForImprovement.map((item: string, idx: number) => {
              const [title, ...rest] = item.includes(': ') ? item.split(': ') : ['', item];
              const desc = rest.join(': ');
              return (
                <li key={idx} className="flex flex-col gap-1 rounded-xl bg-muted/20 p-3 border border-border/50">
                  {title ? (
                    <span className="font-semibold text-xs tracking-wider uppercase text-foreground flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-primary" />
                      {title}
                    </span>
                  ) : null}
                  <span className="text-xs md:text-sm text-muted-foreground leading-relaxed">{desc}</span>
                </li>
              );
            }) : <li>No improvement suggestions were returned for this profile.</li>}
          </ul>
        </section>
      </div>

      {/* Strategic Roadmap & Platform Resources Portal */}
      <div className="rounded-2xl border bg-card p-6 transition-all duration-200">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="size-4 text-primary" />
            <h2 className="text-lg font-semibold">Recommended Development Roadmap & Portals</h2>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Direct Links</span>
        </div>
        <p className="mb-5 text-sm text-muted-foreground">
          Admissions committees favor concrete, verifiable credentials. Use these open platforms to execute your profile remediation:
        </p>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          <a
            href="https://github.com/ossu/computer-science"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col justify-between rounded-xl border bg-muted/10 p-4 transition-all hover:border-primary/50 hover:bg-muted/30"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-primary">OSSU CS</span>
                <ExternalLink className="size-3 text-muted-foreground" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Complete open-source CS curriculum modeled after top US universities.</p>
            </div>
          </a>

          <a
            href="https://paperswithcode.com"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col justify-between rounded-xl border bg-muted/10 p-4 transition-all hover:border-primary/50 hover:bg-muted/30"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-primary">PapersWithCode</span>
                <ExternalLink className="size-3 text-muted-foreground" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Reproduce top ML/Systems research papers with official PyTorch repos.</p>
            </div>
          </a>

          <a
            href="https://www.kaggle.com/competitions"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col justify-between rounded-xl border bg-muted/10 p-4 transition-all hover:border-primary/50 hover:bg-muted/30"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-primary">Kaggle Benchmarks</span>
                <ExternalLink className="size-3 text-muted-foreground" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Compete on real industry datasets and showcase reproducible notebooks.</p>
            </div>
          </a>

          <a
            href="https://arxiv.org"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col justify-between rounded-xl border bg-muted/10 p-4 transition-all hover:border-primary/50 hover:bg-muted/30"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-primary">arXiv Repository</span>
                <ExternalLink className="size-3 text-muted-foreground" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Publish technical preprints and literature surveys to demonstrate research vigor.</p>
            </div>
          </a>
        </div>
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
