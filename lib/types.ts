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
