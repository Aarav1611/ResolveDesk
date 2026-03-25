import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="auth-container">
      <div class="auth-left">
        <div class="brand">
          <mat-icon class="brand-icon">support_agent</mat-icon>
          <h1>ResolveDesk</h1>
          <p>Smart Complaint Management System</p>
        </div>
        <div class="features">
          <div class="feature-item">
            <mat-icon>bolt</mat-icon>
            <span>Auto Priority Detection</span>
          </div>
          <div class="feature-item">
            <mat-icon>schedule</mat-icon>
            <span>48h Auto-Escalation</span>
          </div>
          <div class="feature-item">
            <mat-icon>dashboard</mat-icon>
            <span>Real-time Analytics</span>
          </div>
        </div>
      </div>

      <div class="auth-right">
        <mat-card class="auth-card">
          <mat-card-header>
            <mat-card-title>Welcome Back</mat-card-title>
            <mat-card-subtitle>Sign in to your account</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form (ngSubmit)="onLogin()" class="auth-form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input matInput type="email" [(ngModel)]="email" name="email" required />
                <mat-icon matPrefix>email</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Password</mat-label>
                <input
                  matInput
                  [type]="hidePassword ? 'password' : 'text'"
                  [(ngModel)]="password"
                  name="password"
                  required
                />
                <mat-icon matPrefix>lock</mat-icon>
                <button
                  mat-icon-button
                  matSuffix
                  type="button"
                  (click)="hidePassword = !hidePassword"
                >
                  <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </mat-form-field>

              <button
                mat-raised-button
                color="primary"
                type="submit"
                class="full-width submit-btn"
                [disabled]="loading"
              >
                <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
                <span *ngIf="!loading">Sign In</span>
              </button>
            </form>
          </mat-card-content>

          <mat-card-actions align="end">
            <p class="register-link">
              Don't have an account?
              <a routerLink="/register">Register here</a>
            </p>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      min-height: 100vh;
    }

    .auth-left {
      flex: 1;
      background: linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 3rem;
      color: white;
    }

    .brand {
      text-align: center;
      margin-bottom: 3rem;
    }

    .brand-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 1rem;
      opacity: 0.9;
    }

    .brand h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
      letter-spacing: -0.5px;
    }

    .brand p {
      font-size: 1.1rem;
      opacity: 0.8;
    }

    .features {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1rem;
      opacity: 0.9;
      background: rgba(255, 255, 255, 0.1);
      padding: 0.75rem 1.25rem;
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }

    .auth-right {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f5f5f5;
      padding: 2rem;
    }

    .auth-card {
      width: 100%;
      max-width: 420px;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    mat-card-title {
      font-size: 1.75rem !important;
      font-weight: 700 !important;
      color: #1a237e;
    }

    mat-card-subtitle {
      margin-top: 0.25rem !important;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-top: 1.5rem;
    }

    .full-width {
      width: 100%;
    }

    .submit-btn {
      height: 48px;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 8px;
      margin-top: 0.5rem;
    }

    .register-link {
      margin: 1rem 0 0;
      font-size: 0.9rem;
      color: #666;
    }

    .register-link a {
      color: #1a237e;
      font-weight: 600;
      text-decoration: none;
    }

    .register-link a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .auth-container {
        flex-direction: column;
      }
      .auth-left {
        padding: 2rem;
        min-height: auto;
      }
      .features {
        display: none;
      }
    }
  `],
})
export class LoginComponent {
  email = '';
  password = '';
  hidePassword = true;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onLogin(): void {
    if (!this.email || !this.password) {
      this.snackBar.open('Please fill in all fields', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.snackBar.open('Login successful!', 'Close', { duration: 2000 });
          // Route based on role
          if (res.data.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/student']);
          }
        }
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || 'Login failed. Please try again.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      },
    });
  }
}
