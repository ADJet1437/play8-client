// API Response Types
export interface PagedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface DeleteResponse {
  status: string;
  id: string;
}

// Model Types
export interface Booking {
  id?: string;
  user_id?: string; // Optional because it's set by backend from authenticated user
  machine_id: string;
  start_time: string; // ISO date string
  end_time?: string; // ISO date string, optional as it can be set later
  status: string;
}

export interface Machine {
  id?: string;
  name: string;
  location: string;
  status: string;
}