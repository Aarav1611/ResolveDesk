import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'student',
    canActivate: [authGuard, roleGuard('student')],
    loadComponent: () =>
      import('./pages/student-dashboard/student-dashboard.component').then(
        (m) => m.StudentDashboardComponent
      ),
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard('admin')],
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
  },
];
