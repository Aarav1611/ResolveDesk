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
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';
import { ComplaintService } from '../../services/complaint.service';
import { Complaint, DashboardStats } from '../../models/interfaces';

@Component({
  selector: 'app-admin-dashboard',
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
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  template: `
    <!-- Top Navigation Bar -->
    <mat-toolbar class="toolbar">
      <mat-icon class="toolbar-icon">support_agent</mat-icon>
      <span class="toolbar-title">ResolveDesk</span>
      <span class="toolbar-badge">ADMIN</span>
      <span class="spacer"></span>
      <span class="user-name">
        <mat-icon>admin_panel_settings</mat-icon>
        {{ currentUser?.name }}
      </span>
      <button mat-icon-button (click)="logout()" matTooltip="Logout">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>

    <div class="dashboard-container">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h2>Admin Dashboard</h2>
          <p>Monitor, manage, and resolve complaints</p>
        </div>
        <button mat-stroked-button (click)="loadData()" class="refresh-btn">
          <mat-icon>refresh</mat-icon> Refresh
        </button>
      </div>

      <!-- Stats Cards Row -->
      <div class="stats-grid" *ngIf="stats">
        <mat-card class="stat-card total">
          <div class="stat-icon"><mat-icon>assignment</mat-icon></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.total }}</span>
            <span class="stat-label">Total Complaints</span>
          </div>
        </mat-card>

        <mat-card class="stat-card pending">
          <div class="stat-icon"><mat-icon>hourglass_empty</mat-icon></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.byStatus['Pending'] }}</span>
            <span class="stat-label">Pending</span>
          </div>
        </mat-card>

        <mat-card class="stat-card in-progress">
          <div class="stat-icon"><mat-icon>autorenew</mat-icon></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.byStatus['In Progress'] }}</span>
            <span class="stat-label">In Progress</span>
          </div>
        </mat-card>

        <mat-card class="stat-card resolved">
          <div class="stat-icon"><mat-icon>check_circle</mat-icon></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.byStatus['Resolved'] }}</span>
            <span class="stat-label">Resolved</span>
          </div>
        </mat-card>

        <mat-card class="stat-card escalated">
          <div class="stat-icon"><mat-icon>warning</mat-icon></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.escalated }}</span>
            <span class="stat-label">Escalated</span>
          </div>
        </mat-card>

        <mat-card class="stat-card high-priority">
          <div class="stat-icon"><mat-icon>priority_high</mat-icon></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.byPriority['High'] }}</span>
            <span class="stat-label">High Priority</span>
          </div>
        </mat-card>
      </div>

      <!-- Filters -->
      <mat-card class="filter-card">
        <div class="filter-row">
          <mat-icon class="filter-icon">filter_list</mat-icon>
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="filters.status" (selectionChange)="applyFilters()">
              <mat-option value="">All Statuses</mat-option>
              <mat-option value="Pending">Pending</mat-option>
              <mat-option value="In Progress">In Progress</mat-option>
              <mat-option value="Resolved">Resolved</mat-option>
              <mat-option value="Escalated">Escalated</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Priority</mat-label>
            <mat-select [(ngModel)]="filters.priority" (selectionChange)="applyFilters()">
              <mat-option value="">All Priorities</mat-option>
              <mat-option value="High">🔴 High</mat-option>
              <mat-option value="Medium">🟡 Medium</mat-option>
              <mat-option value="Low">🟢 Low</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-stroked-button (click)="showEscalated()" class="escalated-filter-btn">
            <mat-icon>warning</mat-icon> Escalated Only
          </button>

          <button mat-button (click)="clearFilters()">
            <mat-icon>clear</mat-icon> Clear
          </button>
        </div>
      </mat-card>

      <!-- Complaints List -->
      <div class="section-header">
        <h3>All Complaints</h3>
        <span class="result-count">{{ complaints.length }} results</span>
      </div>

      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading && complaints.length === 0" class="empty-state">
        <mat-icon>search_off</mat-icon>
        <p>No complaints match the current filters</p>
      </div>

      <div class="complaints-list">
        <mat-card *ngFor="let complaint of complaints" class="complaint-card"
          [class.escalated]="complaint.isEscalated">

          <div class="complaint-top-row">
            <div class="complaint-info">
              <div class="complaint-title-row">
                <h4>{{ complaint.title }}</h4>
                <span class="priority-badge"
                  [class]="'priority-' + complaint.priority.toLowerCase()">
                  {{ complaint.priority }}
                </span>
              </div>
              <div class="complaint-meta">
                <span class="status-chip"
                  [class]="'status-' + complaint.status.toLowerCase().replace(' ', '-')">
                  {{ complaint.status }}
                </span>
                <span class="category-tag">{{ complaint.category }}</span>
                <span class="submitter">
                  <mat-icon class="small-icon">person</mat-icon>
                  {{ complaint.userId?.name || 'Unknown' }}
                </span>
                <span class="date">
                  <mat-icon class="small-icon">calendar_today</mat-icon>
                  {{ complaint.createdAt | date: 'MMM d, y h:mm a' }}
                </span>
              </div>
            </div>

            <div class="complaint-actions">
              <button mat-icon-button [matMenuTriggerFor]="statusMenu"
                matTooltip="Update Status" color="primary">
                <mat-icon>edit</mat-icon>
              </button>
              <mat-menu #statusMenu="matMenu">
                <button mat-menu-item (click)="updateStatus(complaint._id, 'Pending')">
                  <mat-icon>hourglass_empty</mat-icon> Pending
                </button>
                <button mat-menu-item (click)="updateStatus(complaint._id, 'In Progress')">
                  <mat-icon>autorenew</mat-icon> In Progress
                </button>
                <button mat-menu-item (click)="updateStatus(complaint._id, 'Resolved')">
                  <mat-icon>check_circle</mat-icon> Resolved
                </button>
                <button mat-menu-item (click)="updateStatus(complaint._id, 'Escalated')">
                  <mat-icon>warning</mat-icon> Escalated
                </button>
              </mat-menu>

              <button mat-icon-button (click)="deleteComplaint(complaint._id)"
                matTooltip="Delete" color="warn">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>

          <p class="complaint-description">{{ complaint.description }}</p>

          <div *ngIf="complaint.isEscalated" class="escalation-warning">
            <mat-icon>error_outline</mat-icon>
            <span>ESCALATED — unresolved for over 48 hours</span>
          </div>

          <div *ngIf="complaint.feedback" class="feedback-display">
            <mat-icon class="small-icon">rate_review</mat-icon>
            <strong>Student Feedback:</strong> {{ complaint.feedback }}
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .toolbar {
      background: linear-gradient(135deg, #1a237e, #0d47a1);
      color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .toolbar-icon { margin-right: 8px; }
    .toolbar-title { font-weight: 700; font-size: 1.25rem; }

    .toolbar-badge {
      background: rgba(255, 255, 255, 0.2);
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 700;
      margin-left: 10px;
      letter-spacing: 1px;
    }

    .spacer { flex: 1; }

    .user-name {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-right: 8px;
      font-size: 0.9rem;
    }

    .dashboard-container {
      max-width: 1300px;
      margin: 0 auto;
      padding: 2rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .page-header h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a237e;
      margin: 0;
    }

    .page-header p { color: #666; margin: 0.25rem 0 0; }

    .refresh-btn {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* ---- Stats Grid ---- */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      border-radius: 14px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon mat-icon { font-size: 28px; width: 28px; height: 28px; }

    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.75rem; font-weight: 700; line-height: 1; }
    .stat-label { font-size: 0.8rem; color: #888; margin-top: 4px; }

    .stat-card.total .stat-icon { background: #e3f2fd; color: #1565c0; }
    .stat-card.total .stat-value { color: #1565c0; }

    .stat-card.pending .stat-icon { background: #fff3e0; color: #e65100; }
    .stat-card.pending .stat-value { color: #e65100; }

    .stat-card.in-progress .stat-icon { background: #e8eaf6; color: #283593; }
    .stat-card.in-progress .stat-value { color: #283593; }

    .stat-card.resolved .stat-icon { background: #e8f5e9; color: #2e7d32; }
    .stat-card.resolved .stat-value { color: #2e7d32; }

    .stat-card.escalated .stat-icon { background: #ffebee; color: #c62828; }
    .stat-card.escalated .stat-value { color: #c62828; }

    .stat-card.high-priority .stat-icon { background: #fce4ec; color: #ad1457; }
    .stat-card.high-priority .stat-value { color: #ad1457; }

    /* ---- Filter Card ---- */
    .filter-card {
      border-radius: 14px;
      padding: 1rem 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    }

    .filter-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .filter-icon { color: #888; }

    .filter-field {
      min-width: 180px;
    }

    .escalated-filter-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #c62828;
    }

    /* ---- Section Header ---- */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .section-header h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .result-count {
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

    /* ---- Complaint Cards ---- */
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
      background: #fffafa;
    }

    .complaint-top-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .complaint-info { flex: 1; }

    .complaint-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
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
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .priority-high { background: #ffebee; color: #c62828; }
    .priority-medium { background: #fff8e1; color: #f57f17; }
    .priority-low { background: #e8f5e9; color: #2e7d32; }

    .complaint-meta {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    }

    .status-chip {
      padding: 2px 8px;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status-pending { background: #fff3e0; color: #e65100; }
    .status-in-progress { background: #e3f2fd; color: #1565c0; }
    .status-resolved { background: #e8f5e9; color: #2e7d32; }
    .status-escalated { background: #ffebee; color: #c62828; }

    .category-tag {
      font-size: 0.75rem;
      color: #888;
      background: #f5f5f5;
      padding: 2px 8px;
      border-radius: 8px;
    }

    .submitter, .date {
      font-size: 0.75rem;
      color: #999;
      display: flex;
      align-items: center;
      gap: 3px;
    }

    .small-icon {
      font-size: 14px !important;
      width: 14px !important;
      height: 14px !important;
    }

    .complaint-actions {
      display: flex;
      gap: 4px;
    }

    .complaint-description {
      color: #555;
      font-size: 0.9rem;
      line-height: 1.5;
      margin: 0.75rem 0 0;
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
      font-weight: 600;
    }

    .feedback-display {
      margin-top: 0.75rem;
      padding: 8px 12px;
      background: #f3e5f5;
      border-radius: 8px;
      font-size: 0.85rem;
      color: #6a1b9a;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 600px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .filter-row {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `],
})
export class AdminDashboardComponent implements OnInit {
  currentUser: any;
  complaints: Complaint[] = [];
  stats: DashboardStats | null = null;
  loading = true;

  filters = {
    status: '',
    priority: '',
    escalated: '',
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
    this.loadData();
  }

  loadData(): void {
    this.loadStats();
    this.loadComplaints();
  }

  loadStats(): void {
    this.complaintService.getStats().subscribe({
      next: (res) => {
        this.stats = res.data;
      },
      error: () => {
        this.snackBar.open('Failed to load statistics', 'Close', { duration: 3000 });
      },
    });
  }

  loadComplaints(): void {
    this.loading = true;
    const activeFilters: any = {};
    if (this.filters.status) activeFilters.status = this.filters.status;
    if (this.filters.priority) activeFilters.priority = this.filters.priority;
    if (this.filters.escalated) activeFilters.escalated = this.filters.escalated;

    this.complaintService.getComplaints(activeFilters).subscribe({
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

  applyFilters(): void {
    this.filters.escalated = '';
    this.loadComplaints();
  }

  showEscalated(): void {
    this.filters = { status: '', priority: '', escalated: 'true' };
    this.loadComplaints();
  }

  clearFilters(): void {
    this.filters = { status: '', priority: '', escalated: '' };
    this.loadComplaints();
  }

  updateStatus(id: string, status: string): void {
    this.complaintService.updateStatus(id, status).subscribe({
      next: () => {
        this.snackBar.open(`Status updated to "${status}"`, 'Close', { duration: 2000 });
        this.loadData();
      },
      error: () => {
        this.snackBar.open('Failed to update status', 'Close', { duration: 3000 });
      },
    });
  }

  deleteComplaint(id: string): void {
    if (confirm('Are you sure you want to delete this complaint?')) {
      this.complaintService.deleteComplaint(id).subscribe({
        next: () => {
          this.snackBar.open('Complaint deleted', 'Close', { duration: 2000 });
          this.loadData();
        },
        error: () => {
          this.snackBar.open('Failed to delete complaint', 'Close', { duration: 3000 });
        },
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
