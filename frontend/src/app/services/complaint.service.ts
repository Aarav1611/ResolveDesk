import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComplaintResponse, StatsResponse } from '../models/interfaces';

/**
 * ComplaintService handles all API calls related to complaints.
 * Used by both Student and Admin dashboards.
 */
@Injectable({ providedIn: 'root' })
export class ComplaintService {
  private readonly API_URL = 'http://localhost:5000/api/complaints';

  constructor(private http: HttpClient) {}

  /**
   * Get complaints.
   * Students see only their own; admins see all.
   * Optional filters: status, priority, escalated.
   */
  getComplaints(filters?: {
    status?: string;
    priority?: string;
    escalated?: string;
  }): Observable<ComplaintResponse> {
    let params = new HttpParams();
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.priority) params = params.set('priority', filters.priority);
      if (filters.escalated) params = params.set('escalated', filters.escalated);
    }
    return this.http.get<ComplaintResponse>(this.API_URL, { params });
  }

  /** Get a single complaint by ID */
  getComplaint(id: string): Observable<ComplaintResponse> {
    return this.http.get<ComplaintResponse>(`${this.API_URL}/${id}`);
  }

  /** Create a new complaint (student only) */
  createComplaint(data: {
    title: string;
    description: string;
    category: string;
  }): Observable<ComplaintResponse> {
    return this.http.post<ComplaintResponse>(this.API_URL, data);
  }

  /** Update complaint status (admin only) */
  updateStatus(id: string, status: string): Observable<ComplaintResponse> {
    return this.http.put<ComplaintResponse>(`${this.API_URL}/${id}/status`, { status });
  }

  /** Add feedback to a complaint (student only, own complaint) */
  addFeedback(id: string, feedback: string): Observable<ComplaintResponse> {
    return this.http.put<ComplaintResponse>(`${this.API_URL}/${id}/feedback`, { feedback });
  }

  /** Delete a complaint (admin only) */
  deleteComplaint(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  /** Get dashboard statistics (admin only) */
  getStats(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.API_URL}/stats`);
  }
}
