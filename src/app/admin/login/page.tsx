'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Lock, Phone, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

function LoginForm() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/admin/dashboard');
    }
  }, [isAuthenticated, router]);

  const errorParam = searchParams.get('error');
  const paramError =
    errorParam === 'forbidden'
      ? 'Access denied: You do not have SUPER_ADMIN permissions.'
      : errorParam === 'session_expired'
      ? 'Your session has expired. Please log in again.'
      : null;

  const errorMsg = authError || paramError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!phone.trim() || !password) {
      setAuthError('Please enter both mobile number and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(phone.trim(), password);
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        setAuthError((err as { message: string }).message);
      } else {
        setAuthError('Authentication failed. Please check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center p-4 sm:p-6 lg:p-8 font-sans bg-[#F4F5F7] selection:bg-[#4B49AC]/20 selection:text-[#4B49AC]"
    >
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4B49AC] text-white shadow-lg shadow-[#4B49AC]/25 mb-2">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#212529]">
            AI Sales Assistant
          </h1>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#4B49AC]">
            Super Admin Portal
          </p>
        </div>

        {/* Login Card */}
        <Card className="border border-[#E4E8F0] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg font-bold text-[#212529]">Administrator Sign In</CardTitle>
            <CardDescription className="text-[#6C7383] text-xs">
              Authenticate with your seeded Super Admin phone & password.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            {errorMsg && (
              <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-[#F3797E]/30 bg-[#FEF0F0] p-3 text-xs text-[#D9383A]">
                <AlertTriangle className="h-4 w-4 shrink-0 text-[#F3797E] mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Mobile Number"
                type="tel"
                placeholder="+919876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone className="h-4 w-4 text-[#6C7383]" />}
                required
                autoComplete="tel"
                disabled={isSubmitting}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4 text-[#6C7383]" />}
                required
                autoComplete="current-password"
                disabled={isSubmitting}
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                className="w-full mt-2"
              >
                Sign In to Platform
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Warning */}
        <p className="text-center text-xs text-[#6C7383]">
          Privileged administrative access only. All actions are logged and audited server-side.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F5F7]" />}>
      <LoginForm />
    </Suspense>
  );
}

