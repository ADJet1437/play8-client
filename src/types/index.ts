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

// Studio Card Types (Legacy)
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
  messageIndex?: number; // Which message generated this card
}

// New Play8 Card Types
export interface DrillItem {
  name: string;
  duration: string;
  focus: string;
}

export interface TrainingPlanCard {
  title: string;
  description: string;
  total_duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  sport?: 'tennis' | 'padel';
  drills: DrillItem[];
  training_plan_id: string;
  content_block_id?: string;
  messageIndex?: number; // Which message generated this card
}

// New ball settings structure for PongBot Pace S Series
export interface BallSettings {
  ball_number: number;
  spin_type: 'Topspin' | 'No Spin' | 'Underspin';
  spin_strength: number; // 0-10
  speed: number; // 0-10
  drop_point: number; // -10 to +10
  depth: number; // 0-20
  feed: number; // seconds, 0.8-5.0
}

// Legacy parameters (for backward compatibility)
export interface PongBotParameters {
  spin: string;
  height: string;
  distance: string;
  repetitions: number;
  location: string;
  speed: string;
}

export interface DrillCard {
  title: string;
  description: string;
  drill_number: number;
  duration: string;
  machine_position?: string;
  ball_sequence?: BallSettings[]; // New format
  sequence_repetitions?: number;
  parameters?: PongBotParameters; // Legacy format (for backward compatibility)
  focus_points: string[];
  training_plan_id: string;
  content_block_id?: string;
  messageIndex?: number; // Which message generated this card
}

// Union type for all card types
export type CardType = StreamingStudioCard | TrainingPlanCard | DrillCard;

// Type guards
export function isTrainingPlanCard(card: any): card is TrainingPlanCard {
  return card && 'training_plan_id' in card && 'drills' in card && Array.isArray(card.drills);
}

export function isDrillCard(card: any): card is DrillCard {
  return card && 'drill_number' in card && 'training_plan_id' in card && ('parameters' in card || 'ball_sequence' in card);
}

export function isStreamingStudioCard(card: any): card is StreamingStudioCard {
  return card && 'overview' in card && 'steps' in card && 'tips' in card;
}

// Saved Training Session Types
export interface SavedTrainingSession {
  id: string;
  title: string;
  description: string;
  total_duration: string;
  difficulty: string;
  training_plan_data: TrainingPlanCard;
  drill_cards_data: DrillCard[];
  created_at: string;
  updated_at: string;
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