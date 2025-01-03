export interface Question {
  id: number;
  collection: string | null;
  question_text: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correct_answer: string;
  explanation: string;
  topic: Topic;
  attempts?: number;
  difficulty?: number;
}

export type Topic =
  | "Polity"
  | "History"
  | "Economics"
  | "Environment and Ecology"
  | "Science & Technology"
  | "Geography"
  | "Current Events";

export interface QuestionSet {
  questions: Question[];
}

export interface TopicWeights {
  [key: string]: number;
}

export interface UserResponse {
  question: Question;
  userAnswer: string;
  isCorrect: boolean;
  timestamp: number;
}

export type ReportStatus = "pending" | "resolved" | "rejected";

export interface ReportedIssue {
  id: number;
  user_id: string;
  question_id: number | null;
  issue_type: string;
  description: string;
  status: ReportStatus;
  admin_comment?: string;
  created_at: string;
  questions?: {
    id: number;
    question_text: string;
    topic: Topic;
    explanation: string;
  };
}
