'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EvaluationForm } from '@/components/evaluation-form';
import { useAuth } from '@/components/auth-context';
import { ResultsPanel, Shell } from '@/components/ui';

export default function EvaluatePage() {
  const [result, setResult] = useState<any>(null);
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth.ready && !auth.authed) {
      router.replace('/auth');
    }
  }, [auth.ready, auth.authed, router]);

  if (!auth.ready) return null;

  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-12 md:pt-16">
        {!auth.authed ? null : result ? (
          <ResultsPanel evaluation={result} onEdit={() => setResult(null)} />
        ) : (
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Your profile</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight">Let’s find your best-fit schools.</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                A few details are all we need to build a grounded starting point for your application strategy.
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-5 md:p-8">
              <EvaluationForm onResult={setResult} />
            </div>
          </div>
        )}
      </main>
    </Shell>
  );
}
