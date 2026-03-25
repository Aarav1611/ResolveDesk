import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { ComplaintService } from '../../services/complaint.service';
import { Complaint } from '../../models/interfaces';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatDividerModule,
    MatBadgeModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <!-- Top Navigation Bar -->
    <mat-toolbar class="toolbar" color="primary">
      <mat-icon class="toolbar-icon">support_agent</mat-icon>
      <span class="toolbar-title">ResolveDesk</span>
      <span class="spacer"></span>
      <span class="user-name">
        <mat-icon>person</mat-icon>
        {{ currentUser?.name }}
      </span>
      <button mat-icon-button (click)="logout()" matTooltip="Logout">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>

    <div class="dashboard-container">
      <!-- Page Header -->
      <div class="page-header">
        <h2>Student Dashboard</h2>
        <p>Submit and track your complaints</p>
      </div>

      <div class="dashboard-grid">
        <!-- Complaint Form Section -->
        <mat-card class="form-card">
          <mat-card-header>
            <mat-icon mat-card-avatar class="card-avatar">add_circle</mat-icon>
            <mat-card-title>Submit New Complaint</mat-card-title>
            <mat-card-subtitle>Priority is automatically assigned</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form (ngSubmit)="submitComplaint()" class="complaint-form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Title</mat-label>
                <input matInput [(ngModel)]="newComplaint.title" name="title" required
                  placeholder="Brief summary of the issue" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Category</mat-label>
                <mat-select [(ngModel)]="newComplaint.category" name="category" required>
                  <mat-option value="Infrastructure">🏗️ Infrastructure</mat-option>
                  <mat-option value="Electrical">⚡ Electrical</mat-option>
                  <mat-option value="Plumbing">🔧 Plumbing</mat-option>
                  <mat-option value="Internet">🌐 Internet</mat-option>
                  <mat-option value="Housekeeping">🧹 Housekeeping</mat-option>
                  <mat-option value="Academic">📚 Academic</mat-option>
                  <mat-option value="Other">📋 Other</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput [(ngModel)]="newComplaint.description" name="description"
                  required rows="4" placeholder="Describe the issue in detail..."></textarea>
              </mat-form-field>

              <button mat-raised-button color="primary" type="submit" [disabled]="submitting"
                class="full-width submit-btn">
                <mat-spinner *ngIf="submitting" diameter="20"></mat-spinner>
                <span *ngIf="!submitting">
                  <mat-icon>send</mat-icon> Submit Complaint
                </span>
              </button>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Complaints List Section -->
        <div class="complaints-section">
          <div class="section-header">
            <h3>
              <mat-icon>list_alt</mat-icon>
              My Complaints
            </h3>
            <span class="complaint-count">{{ complaints.length }} total</span>
          </div>

          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
          </div>

          <div *ngIf="!loading && complaints.length === 0" class="empty-state">
            <mat-icon>inbox</mat-icon>
            <p>No complaints submitted yet</p>
          </div>

          <div class="complaints-list">
            <mat-card *ngFor="let complaint of complaints" class="complaint-card"
              [class.escalated]="complaint.isEscalated">
              <div class="complaint-header">
                <div class="complaint-title-row">
                  <h4>{{ complaint.title }}</h4>
                  <span class="priority-badge" [class]="'priority-' + complaint.priority.toLowerCase()">
                    {{ complaint.priority }}
                  </span>
                </div>
                <div class="complaint-meta">
                  <span class="status-chip" [class]="'status-' + complaint.status.toLowerCase().replace(' ', '-')">
                    {{ complaint.status }}
                  </span>
                  <span class="category-tag">{{ complaint.category }}</span>
                  <span class="date">{{ complaint.createdAt | date: 'MMM d, y' }}</span>
                </div>
              </div>

              <p class="complaint-description">{{ complaint.description }}</p>

              <div *ngIf="complaint.isEscalated" class="escalation-warning">
                <mat-icon>warning</mat-icon>
                <span>This complaint has been escalated due to delayed resolution</span>
              </div>

              <!-- Feedback section for resolved complaints -->
              <div *ngIf="complaint.status === 'Resolved'" class="feedback-section">
                <mat-divider></mat-divider>
                <div *ngIf="complaint.feedback" class="existing-feedback">
                  <strong>Your Feedback:</strong> {{ complaint.feedback }}
                </div>
                <div *ngIf="!complaint.feedback" class="feedback-form">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Add your feedback</mat-label>
                    <input matInput [(ngModel)]="feedbackText[complaint._id]"
                      placeholder="How was the resolution?" />
                  </mat-form-field>
                  <button mat-stroked-button color="primary"
                    (click)="submitFeedback(complaint._id)">
                    <mat-icon>rate_review</mat-icon> Submit Feedback
                  </button>
                </div>
              </div>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toolbar {
      background: linear-gradient(135deg, #1a237e, #283593);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .toolbar-icon {
      margin-right: 8px;
    }

    .toolbar-title {
      font-weight: 700;
      font-size: 1.25rem;
    }

    .spacer {
      flex: 1;
    }

    .user-name {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-right: 8px;
      font-size: 0.9rem;
    }

    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a237e;
      margin: 0;
    }

    .page-header p {
      color: #666;
      margin: 0.25rem 0 0;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: 2rem;
      align-items: start;
    }

    .form-card {
      position: sticky;
      top: 80px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .card-avatar {
      font-size: 40px !important;
      width: 40px !important;
      height: 40px !important;
      color: #1a237e;
    }

    .complaint-form {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-top: 1rem;
    }

    .full-width {
      width: 100%;
    }

    .submit-btn {
      height: 44px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .section-header h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .complaint-count {
      background: #e3f2fd;
      color: #1a237e;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 3rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #999;
    }

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 1rem;
    }

    .complaints-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .complaint-card {
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      transition: box-shadow 0.2s ease;
      border-left: 4px solid transparent;
    }

    .complaint-card:hover {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .complaint-card.escalated {
      border-left-color: #f44336;
      background: #fff5f5;
    }

    .complaint-header {
      margin-bottom: 0.75rem;
    }

    .complaint-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .complaint-title-row h4 {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 600;
      color: #222;
    }

    .priority-badge {
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .priority-high {
      background: #ffebee;
      color: #c62828;
    }

    .priority-medium {
      background: #fff8e1;
      color: #f57f17;
    }

    .priority-low {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .complaint-meta {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }

    .status-chip {
      padding: 2px 8px;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status-pending {
      background: #fff3e0;
      color: #e65100;
    }

    .status-in-progress {
      background: #e3f2fd;
      color: #1565c0;
    }

    .status-resolved {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .status-escalated {
      background: #ffebee;
      color: #c62828;
    }

    .category-tag {
      font-size: 0.75rem;
      color: #888;
      background: #f5f5f5;
      padding: 2px 8px;
      border-radius: 8px;
    }

    .date {
      font-size: 0.75rem;
      color: #aaa;
    }

    .complaint-description {
      color: #555;
      font-size: 0.9rem;
      line-height: 1.5;
      margin: 0;
    }

    .escalation-warning {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 0.75rem;
      padding: 8px 12px;
      background: #ffebee;
      border-radius: 8px;
      color: #c62828;
      font-size: 0.85rem;
    }

    .feedback-section {
      margin-top: 1rem;
    }

    .existing-feedback {
      margin-top: 0.75rem;
      padding: 8px 12px;
      background: #f3e5f5;
      border-radius: 8px;
      font-size: 0.9rem;
      color: #6a1b9a;
    }

    .feedback-form {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-top: 0.75rem;
    }

    .feedback-form mat-form-field {
      flex: 1;
    }

    @media (max-width: 900px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
      .form-card {
        position: static;
      }
    }
  `],
})
export class StudentDashboardComponent implements OnInit {
  currentUser: any;
  complaints: Complaint[] = [];
  loading = true;
  submitting = false;
  feedbackText: { [id: string]: string } = {};

  newComplaint = {
    title: '',
    description: '',
    category: '',
  };

  constructor(
    private authService: AuthService,
    private complaintService: ComplaintService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.loading = true;
    this.complaintService.getComplaints().subscribe({
      next: (res) => {
        this.complaints = res.data as Complaint[];
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load complaints', 'Close', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  submitComplaint(): void {
    const { title, description, category } = this.newComplaint;
    if (!title || !description || !category) {
      this.snackBar.open('Please fill in all fields', 'Close', { duration: 3000 });
      return;
    }

    this.submitting = true;
    this.complaintService.createComplaint(this.newComplaint).subscribe({
      next: () => {
        this.snackBar.open('Complaint submitted successfully!', 'Close', { duration: 3000 });
        this.newComplaint = { title: '', description: '', category: '' };
        this.submitting = false;
        this.loadComplaints();
      },
      error: (err) => {
        this.submitting = false;
        this.snackBar.open(err.error?.message || 'Failed to submit', 'Close', { duration: 3000 });
      },
    });
  }

  submitFeedback(complaintId: string): void {
    const feedback = this.feedbackText[complaintId];
    if (!feedback) {
      this.snackBar.open('Please enter feedback', 'Close', { duration: 2000 });
      return;
    }

    this.complaintService.addFeedback(complaintId, feedback).subscribe({
      next: () => {
        this.snackBar.open('Feedback submitted!', 'Close', { duration: 2000 });
        this.loadComplaints();
      },
      error: () => {
        this.snackBar.open('Failed to submit feedback', 'Close', { duration: 3000 });
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
