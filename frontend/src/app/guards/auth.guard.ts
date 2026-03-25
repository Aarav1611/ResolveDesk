import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * AuthGuard — Prevents unauthenticated users from accessing protected routes.
 * Redirects to /login if no valid token exists.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

/**
 * RoleGuard Factory — Creates a guard that checks if the user has a specific role.
 * Usage in routes: canActivate: [roleGuard('admin')]
 */
export const roleGuard = (requiredRole: string): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn() && authService.getRole() === requiredRole) {
      return true;
    }

    router.navigate(['/login']);
    return false;
  };
};
