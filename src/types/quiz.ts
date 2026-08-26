export interface Question {
  id: number;
  topic: string;
  question: string;
  options: string[];
  answer: string;
  rationale: string;
}

export interface UserAnswer {
  questionId: number;
  selectedOption: string | null;
  isSubmitted: boolean;
  isCorrect: boolean | null;
}

export type QuizState = "START" | "CONFIG" | "QUIZ" | "RESULTS";
