'use client';

import { useState } from 'react';
import { ArrowRight, Mail, Lock, UserRound } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/components/auth-context';

export function AuthForm({ onSuccess }: { onSuccess?: () => void }) {
  const auth = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setSubmitError('');
    setFieldErrors({});

    try {
      if (mode === 'register') {
        const payload = { email, full_name: fullName.trim() || undefined, password };
        await api.register(payload);
      }
      await auth.login(email, password);
      onSuccess?.();
    } catch (error: any) {
      const nextErrors = error?.fields && typeof error.fields === 'object' ? error.fields : {};
      if (Object.keys(nextErrors).length) {
        setFieldErrors(nextErrors);
      } else {
        setSubmitError(error?.message || 'Unable to continue.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border bg-card p-6 shadow-[0_1px_0_rgba(15,23,42,0.02)] md:p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Access</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        </div>
        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {mode === 'login' ? 'Register' : 'Login'}
        </button>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {mode === 'register' && (
          <label className="block text-sm font-medium text-foreground">
            <span className="mb-2 flex items-center gap-2"><UserRound className="size-4 text-primary" /> Full name</span>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Avery Chen"
              className="w-full"
            />
          </label>
        )}

        <label className="block text-sm font-medium text-foreground">
          <span className="mb-2 flex items-center gap-2"><Mail className="size-4 text-primary" /> Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full"
            autoComplete="email"
          />
          {fieldErrors.email && <span className="mt-2 block text-xs text-primary">{fieldErrors.email}</span>}
        </label>

        <label className="block text-sm font-medium text-foreground">
          <span className="mb-2 flex items-center gap-2"><Lock className="size-4 text-primary" /> Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="w-full"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          {fieldErrors.password && <span className="mt-2 block text-xs text-primary">{fieldErrors.password}</span>}
        </label>

        {submitError && <p className="rounded-xl border border-primary/25 bg-primary/5 px-3 py-2 text-sm text-primary">{submitError}</p>}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3.5 font-semibold text-primary-foreground transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          <ArrowRight className="ml-2 size-4" />
        </button>
      </form>
    </div>
  );
}
