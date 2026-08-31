'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthForm } from '@/components/auth-form';
import { useAuth } from '@/components/auth-context';
import { Shell } from '@/components/ui';

export default function AuthPage() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth.ready && auth.authed) {
      router.replace('/evaluate');
    }
  }, [auth.ready, auth.authed, router]);

  if (!auth.ready) return null;

  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-12 md:pt-16">
        <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">← Back to UniPath</Link>
        </div>
        <div className="mx-auto max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Access</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Continue your plan.</h1>
          <p className="mt-3 max-w-md text-base leading-7 text-muted-foreground">
            Log in to save your evaluations, revisit your shortlist, and refine your profile with new information.
          </p>
          <div className="mt-8">
            <AuthForm onSuccess={() => router.push('/evaluate')} />
          </div>
        </div>
      </main>
    </Shell>
  );
}
