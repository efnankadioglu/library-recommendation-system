import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

type Props = {
  children: React.ReactNode;
};

export function AdminRoute({ children }: Props) {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const location = useLocation();
  const warnedRef = useRef(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !isAdmin && location.pathname === '/admin') {
      if (!warnedRef.current) {
        warnedRef.current = true;
        window.alert('Only admins can access the Admin page.');
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, location.pathname]);

  if (isLoading) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
}
