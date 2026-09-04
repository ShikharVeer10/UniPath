import Link from 'next/link';
import { ArrowRight, BarChart3, Compass, Sparkles } from 'lucide-react';
import { Shell } from '@/components/ui';

export default function Home() {
  return (
    <Shell>
      <main className="mx-auto flex max-w-6xl flex-col gap-20 px-6 pb-24 pt-16 md:pt-24">
        <section className="max-w-4xl">
          <p className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <span className="size-2 rounded-full bg-primary" />
            Admission intelligence, made personal
          </p>

          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.06em] md:text-7xl">
            Know your odds
            <br />
            before you <span className="text-primary">apply.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">
            UniPath turns your academic profile into a grounded shortlist of universities where your application story has the strongest chance to land.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3.5 font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(188,93,60,0.18)]"
            >
              Evaluate my profile
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link href="/history" className="inline-flex items-center justify-center rounded-xl border bg-card px-5 py-3.5 font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary">
              View saved readouts
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {['CGPA + GRE + TOEFL', 'Historical admit matching', 'Program-specific shortlists'].map((tag) => (
              <span key={tag} className="rounded-full border bg-white/60 px-3 py-1.5">{tag}</span>
            ))}
          </div>
        </section>

        <section className="grid gap-4 border-t pt-8 md:grid-cols-3">
          <div className="animate-fade-up stagger-1 group flex gap-4 rounded-2xl border bg-card/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card">
            <Compass className="mt-1 size-5 text-primary" />
            <div>
              <h2 className="font-semibold">Find your range</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">See ambitious, target, and safe options in one view.</p>
            </div>
          </div>

          <div className="animate-fade-up stagger-2 group flex gap-4 rounded-2xl border bg-card/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card">
            <BarChart3 className="mt-1 size-5 text-primary" />
            <div>
              <h2 className="font-semibold">Grounded in signals</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">A blend of historical admits and your profile strength.</p>
            </div>
          </div>

          <div className="animate-fade-up stagger-3 group flex gap-4 rounded-2xl border bg-card/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card">
            <Sparkles className="mt-1 size-5 text-primary" />
            <div>
              <h2 className="font-semibold">Advice that moves you</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Know which parts of your application to strengthen next.</p>
            </div>
          </div>
        </section>
      </main>
    </Shell>
  );
}
