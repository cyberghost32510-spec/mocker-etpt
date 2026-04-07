import { maths100Questions, mathsTestConfig } from '../maths-test';
import { combined200, combinedTestConfig } from '../combined-200';
import type { Test, Question } from '../test-schema';

function normalizeMaths(): Test {
  return {
    slug: mathsTestConfig.id || 'maths-100',
    title: mathsTestConfig.name || 'Maths 100',
    description: mathsTestConfig.description || '',
    timeInMinutes: mathsTestConfig.timeInMinutes || 100,
    questions: maths100Questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      subject: 'Mathematics',
    })) as Question[],
  };
}

function normalizeCombined(): Test {
  return {
    slug: combinedTestConfig.id || 'combined-200',
    title: combinedTestConfig.name || 'Combined 200',
    description: combinedTestConfig.description || '',
    timeInMinutes: combinedTestConfig.timeInMinutes || combined200.length,
    questions: combined200.map((q: any) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      subject: q.subject || 'Mixed',
    })) as Question[],
  };
}

export const tests: Test[] = [normalizeMaths(), normalizeCombined()];

export const testsMap: Record<string, Test> = Object.fromEntries(
  tests.map((t) => [t.slug, t])
);

export default tests;
