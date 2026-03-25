import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, AuthResponse } from '../models/interfaces';

/**
 * AuthService handles login, registration, JWT token persistence,
 * and exposes the current user's role/state to the rest of the app.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = '/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  /** Observable of the currently logged-in user (null if logged out) */
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Restore user from localStorage on app startup
    const stored = localStorage.getItem('user');
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  /** Register a new user and store the JWT token */
  register(data: { name: string; email: string; password: string; role?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap((res) => {
        if (res.success) {
          this.storeUser(res.data);
        }
      })
    );
  }

  /** Login with email/password and store the JWT token */
  login(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, data).pipe(
      tap((res) => {
        if (res.success) {
          this.storeUser(res.data);
        }
      })
    );
  }

  /** Clear user data and token from storage */
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  /** Get the stored JWT token */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /** Check if the user is currently authenticated */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /** Get the current user's role */
  getRole(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.role : null;
  }

  /** Get the current user object */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /** Store user data and token to localStorage */
  private storeUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    if (user.token) {
      localStorage.setItem('token', user.token);
    }
    this.currentUserSubject.next(user);
  }
}
