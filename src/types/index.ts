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

// Conversation Types
export interface Conversation {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentBlockResponse {
  id: string;
  type: 'text' | 'tool_use';
  content: string;
  tool_name?: string | null;
  order: number;
  checked_steps?: boolean[] | null;
}

export interface MessageResponse {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  content_blocks?: ContentBlockResponse[];
}

export interface ConversationDetail extends Conversation {
  messages: MessageResponse[];
}

// Studio Card Types
export interface StreamingStudioCard {
  title: string;
  description: string;
  category: 'training' | 'technique' | 'ball-machine';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
  overview: string;
  steps: string[];
  tips: string[];
  isStreaming: boolean;
  streamingSection?: 'overview' | 'steps' | 'tips';
  content_block_id?: string;
  checked_steps?: boolean[];
}

// Plan Types
export interface PlanItem {
  id: string;
  title: string;
  description: string;
  category: 'training' | 'technique' | 'ball-machine';
  difficulty?: string;
  duration?: string;
  overview: string;
  steps: string[];
  tips: string[];
  checked_steps: boolean[];
  status: 'todo' | 'in_progress' | 'complete';
  created_at: string;
  updated_at: string;
}

export interface PlanItemCreate {
  title: string;
  description?: string;
  category?: string;
  difficulty?: string;
  duration?: string;
  overview?: string;
  steps?: string[];
  tips?: string[];
}