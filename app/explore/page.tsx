'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Award, DollarSign, ArrowRight, Building2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Shell } from '@/components/ui';

type UniversityItem = {
  id: string;
  name: string;
  country: string;
  ranking: number | null;
  tuition: number | null;
};

export default function ExplorePage() {
  const [universities, setUniversities] = useState<UniversityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [page, setPage] = useState(0);
  const limit = 24;

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getUniversities({
        search: search.trim() || undefined,
        country: country.trim() || undefined,
        skip: page * limit,
        limit,
      });
      setUniversities(Array.isArray(res) ? res : []);
    } catch {
      setUniversities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      loadData();
    }, 250);
    return () => clearTimeout(debounce);
  }, [search, country, page]);

  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-12 md:pt-16">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Explorer</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">University Database.</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Search over a thousand institutions across the world, review their global rank, and find where you want to study.
          </p>
        </div>

        {/* Filter controls */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Search by university name…"
              className="w-full pl-10"
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setPage(0);
              }}
              placeholder="Filter by country (e.g. United States, Germany)…"
              className="w-full pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCountry('');
                setPage(0);
              }}
              className="rounded-xl border bg-card px-4 py-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* University grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl border bg-muted/20" />
            ))}
          </div>
        ) : universities.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card p-12 text-center">
            <Building2 className="mx-auto size-8 text-muted-foreground" />
            <h3 className="mt-4 text-base font-semibold">No universities found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search terms or filters.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {universities.map((uni) => (
              <article
                key={uni.id}
                className="group flex flex-col justify-between rounded-2xl border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
              >
                <div>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                      <Award className="size-3" />
                      #{uni.ranking ?? '—'} World
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">{uni.country}</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                    {uni.name}
                  </h3>
                </div>

                <div className="mt-6 flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <DollarSign className="size-3.5" />
                    {uni.tuition ? `$${uni.tuition.toLocaleString()}/yr` : 'Tuition info n/a'}
                  </span>
                  <Link
                    href="/evaluate"
                    className="inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:underline"
                  >
                    Check fit <ArrowRight className="size-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination controls */}
        <div className="mt-10 flex items-center justify-between border-t pt-6 text-sm">
          <button
            type="button"
            disabled={page === 0 || loading}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-xl border bg-card px-4 py-2 font-medium transition-colors hover:border-primary/40 disabled:opacity-40"
          >
            ← Previous
          </button>
          <span className="text-muted-foreground text-xs">Page {page + 1}</span>
          <button
            type="button"
            disabled={universities.length < limit || loading}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl border bg-card px-4 py-2 font-medium transition-colors hover:border-primary/40 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </main>
    </Shell>
  );
}
