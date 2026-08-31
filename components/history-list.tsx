'use client';

import { ArrowUpRight, CalendarDays, MapPin, Sparkles } from 'lucide-react';

export type HistoryItem = {
  id: number;
  target_program: string;
  target_country: string;
  created_at: string;
  profile_summary?: string;
  recommendations?: Array<Record<string, unknown>>;
};

export function HistoryList({
  items,
  onSelect,
  error,
}: {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  error?: string;
}) {
  if (error) {
    return <div className="rounded-2xl border border-primary/25 bg-primary/5 p-5 text-sm text-primary">{error}</div>;
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed bg-card p-8 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="size-5" />
        </div>
        <h2 className="mt-4 text-lg font-semibold">No evaluations yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">Your completed readouts will appear here after the first run.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const date = new Date(item.created_at).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        const matched = Array.isArray(item.recommendations)
          ? item.recommendations.filter((r) => typeof (r as any)?.category === 'string').length
          : 0;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            className="w-full rounded-2xl border bg-card p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted/20"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-semibold">{item.target_program}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" /> {item.target_country}</span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" /> {date}</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                View readout <ArrowUpRight className="size-4" />
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t pt-4 text-sm">
              <span className="text-muted-foreground">{matched} school matches</span>
              <span className="rounded-full bg-primary/8 px-2.5 py-1 text-xs font-medium text-primary">Stored</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
