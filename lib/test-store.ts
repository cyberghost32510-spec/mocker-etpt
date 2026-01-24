import { create } from "zustand";
import type { Question } from "./questions";

export interface TestState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<number, number>;
  flaggedQuestions: Set<number>;
  timeRemaining: number;
  isTestActive: boolean;
  testCategory: string;
  testStartTime: Date | null;
  testEndTime: Date | null;
}

export interface TestActions {
  startTest: (questions: Question[], timeInSeconds: number, category: string) => void;
  answerQuestion: (questionId: number, answerIndex: number) => void;
  toggleFlag: (questionId: number) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  setTimeRemaining: (time: number) => void;
  endTest: () => void;
  resetTest: () => void;
}

export const useTestStore = create<TestState & TestActions>((set, get) => ({
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  flaggedQuestions: new Set(),
  timeRemaining: 0,
  isTestActive: false,
  testCategory: "",
  testStartTime: null,
  testEndTime: null,

  startTest: (questions, timeInSeconds, category) => {
    set({
      questions,
      currentQuestionIndex: 0,
      answers: {},
      flaggedQuestions: new Set(),
      timeRemaining: timeInSeconds,
      isTestActive: true,
      testCategory: category,
      testStartTime: new Date(),
      testEndTime: null,
    });
  },

  answerQuestion: (questionId, answerIndex) => {
    set((state) => ({
      answers: { ...state.answers, [questionId]: answerIndex },
    }));
  },

  toggleFlag: (questionId) => {
    set((state) => {
      const newFlagged = new Set(state.flaggedQuestions);
      if (newFlagged.has(questionId)) {
        newFlagged.delete(questionId);
      } else {
        newFlagged.add(questionId);
      }
      return { flaggedQuestions: newFlagged };
    });
  },

  goToQuestion: (index) => {
    const { questions } = get();
    if (index >= 0 && index < questions.length) {
      set({ currentQuestionIndex: index });
    }
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  setTimeRemaining: (time) => {
    set({ timeRemaining: time });
  },

  endTest: () => {
    set({
      isTestActive: false,
      testEndTime: new Date(),
    });
  },

  resetTest: () => {
    set({
      questions: [],
      currentQuestionIndex: 0,
      answers: {},
      flaggedQuestions: new Set(),
      timeRemaining: 0,
      isTestActive: false,
      testCategory: "",
      testStartTime: null,
      testEndTime: null,
    });
  },
}));
