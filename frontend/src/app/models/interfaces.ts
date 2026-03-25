/**
 * TypeScript interfaces matching the backend MongoDB models.
 * Used across all Angular services and components for type safety.
 */

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  token?: string;
}

export interface AuthResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Escalated';
  priority: 'High' | 'Medium' | 'Low';
  isEscalated: boolean;
  feedback: string;
  userId: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface ComplaintResponse {
  success: boolean;
  count?: number;
  data: Complaint | Complaint[];
  message?: string;
}

export interface DashboardStats {
  total: number;
  byStatus: {
    Pending: number;
    'In Progress': number;
    Resolved: number;
    Escalated: number;
  };
  byPriority: {
    High: number;
    Medium: number;
    Low: number;
  };
  escalated: number;
}

export interface StatsResponse {
  success: boolean;
  data: DashboardStats;
}
