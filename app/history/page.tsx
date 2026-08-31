'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/components/auth-context';
import { HistoryList } from '@/components/history-list';
import { ResultsPanel, Shell } from '@/components/ui';

export default function HistoryPage() {
  const router = useRouter();
  const auth = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth.ready) return;
    if (!auth.authed) {
      router.replace('/auth');
      return;
    }

    api.history()
      .then((result) => setItems(Array.isArray(result) ? result : []))
      .catch((err) => setError(err?.message || 'Unable to load your evaluation history.'));
  }, [auth.ready, auth.authed, router]);

  if (!auth.ready) return null;
  if (!auth.authed) return null;

  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-12 md:pt-16">
        {selected ? (
          <ResultsPanel evaluation={selected} onEdit={() => setSelected(null)} />
        ) : (
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Your history</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">Past evaluations.</h1>
            <p className="mt-3 text-base leading-7 text-muted-foreground">Review earlier readouts and compare how your profile has evolved.</p>
            <div className="mt-8">
              <HistoryList items={items} onSelect={setSelected} error={error} />
            </div>
          </div>
        )}
      </main>
    </Shell>
  );
}
