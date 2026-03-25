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
  selector: 'app-register',
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
            <mat-icon>school</mat-icon>
            <span>Student Portal Access</span>
          </div>
          <div class="feature-item">
            <mat-icon>track_changes</mat-icon>
            <span>Track Your Complaints</span>
          </div>
          <div class="feature-item">
            <mat-icon>feedback</mat-icon>
            <span>Provide Feedback</span>
          </div>
        </div>
      </div>

      <div class="auth-right">
        <mat-card class="auth-card">
          <mat-card-header>
            <mat-card-title>Create Account</mat-card-title>
            <mat-card-subtitle>Register as a student</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form (ngSubmit)="onRegister()" class="auth-form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Full Name</mat-label>
                <input matInput type="text" [(ngModel)]="name" name="name" required />
                <mat-icon matPrefix>person</mat-icon>
              </mat-form-field>

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

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Confirm Password</mat-label>
                <input
                  matInput
                  [type]="hideConfirm ? 'password' : 'text'"
                  [(ngModel)]="confirmPassword"
                  name="confirmPassword"
                  required
                />
                <mat-icon matPrefix>lock_outline</mat-icon>
                <button
                  mat-icon-button
                  matSuffix
                  type="button"
                  (click)="hideConfirm = !hideConfirm"
                >
                  <mat-icon>{{ hideConfirm ? 'visibility_off' : 'visibility' }}</mat-icon>
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
                <span *ngIf="!loading">Create Account</span>
              </button>
            </form>
          </mat-card-content>

          <mat-card-actions align="end">
            <p class="login-link">
              Already have an account?
              <a routerLink="/login">Sign in</a>
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
      background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #43a047 100%);
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
      color: #1b5e20;
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

    .login-link {
      margin: 1rem 0 0;
      font-size: 0.9rem;
      color: #666;
    }

    .login-link a {
      color: #1b5e20;
      font-weight: 600;
      text-decoration: none;
    }

    .login-link a:hover {
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
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  hidePassword = true;
  hideConfirm = true;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onRegister(): void {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.snackBar.open('Please fill in all fields', 'Close', { duration: 3000 });
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.snackBar.open('Passwords do not match', 'Close', { duration: 3000 });
      return;
    }

    if (this.password.length < 6) {
      this.snackBar.open('Password must be at least 6 characters', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;
    this.authService
      .register({ name: this.name, email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success) {
            this.snackBar.open('Registration successful!', 'Close', { duration: 2000 });
            this.router.navigate(['/student']);
          }
        },
        error: (err) => {
          this.loading = false;
          const msg = err.error?.message || 'Registration failed. Please try again.';
          this.snackBar.open(msg, 'Close', { duration: 4000 });
        },
      });
  }
}
