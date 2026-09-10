'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { SystemRole } from '../../api/types/auth.types';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

const emptySubscribe = () => () => {};

/**
 * UX Route Guard:
 * Ensures the user has an active session with SUPER_ADMIN role before rendering admin screens.
 * Uses useSyncExternalStore to eliminate SSR hydration mismatch between server and client storage.
 * Note: The actual security boundary is enforced strictly on the NestJS backend via RolesGuard.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isMounted && !isLoading) {
      if (!isAuthenticated || !user) {
        router.push('/admin/login');
      } else if (user.systemRole !== SystemRole.SUPER_ADMIN) {
        router.push('/admin/login?error=forbidden');
      }
    }
  }, [isMounted, isLoading, isAuthenticated, user, router]);

  if (!isMounted || isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#F4F5F7]">
        <Loader2 className="h-8 w-8 animate-spin text-[#4B49AC] mb-3" />
        <p className="text-sm font-medium text-[#6C7383]">
          Verifying administrative session...
        </p>
      </div>
    );

  }

  if (!isAuthenticated || !user || user.systemRole !== SystemRole.SUPER_ADMIN) {
    return null;
  }

  return <>{children}</>;
}
