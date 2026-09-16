'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AuthGuard } from '../../components/layout/AuthGuard';
import { AdminLayout } from '../../components/layout/AdminLayout';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Login page bypasses the admin dashboard shell and auth guard
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Determine topbar title dynamically based on route
  let pageTitle = 'Dashboard Overview';
  if (pathname.includes('/admin/businesses') && pathname.includes('/customers')) {
    pageTitle = 'Customer Inspection';
  } else if (pathname.includes('/admin/businesses') && pathname.includes('/analyst')) {
    pageTitle = 'AI Business Analyst';
  } else if (pathname.includes('/admin/businesses')) {
    pageTitle = 'Business Directory';
  } else if (pathname.includes('/admin/imports')) {
    pageTitle = 'Import Monitoring';
  }

  return (
    <AuthGuard>
      <AdminLayout title={pageTitle}>{children}</AdminLayout>
    </AuthGuard>
  );
}
