export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation?: string;
  tags?: string[];
  difficulty?: Difficulty;
  subject?: string;
}

export interface Test {
  slug: string;
  title: string;
  description?: string;
  timeInMinutes?: number;
  questions: Question[];
}

export interface TestConfig {
  id: string;
  name: string;
  description?: string;
  totalQuestions?: number;
  timeInMinutes?: number;
  subjects?: string[];
}
