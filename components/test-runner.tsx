"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import type { Test } from "@/lib/test-schema";

interface Props {
  test: Test;
}

interface TestState {
  currentQuestion: number;
  selectedAnswers: Record<number, number>;
  showSolution: boolean;
  timeRemaining: number;
  testStarted: boolean;
  testCompleted: boolean;
}

export default function TestRunner({ test }: Props) {
  const total = test.questions.length;
  const [state, setState] = useState<TestState>({
    currentQuestion: 0,
    selectedAnswers: {},
    showSolution: false,
    timeRemaining: (test.timeInMinutes || total) * 60,
    testStarted: false,
    testCompleted: false,
  });

  useEffect(() => {
    if (!state.testStarted || state.testCompleted) return;
    const timer = setInterval(() => {
      setState((prev) => {
        if (prev.timeRemaining <= 0) return { ...prev, timeRemaining: 0, testCompleted: true };
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [state.testStarted, state.testCompleted]);

  const current = test.questions[state.currentQuestion];
  const currentAnswer = state.selectedAnswers[current.id];
  const isCorrect = currentAnswer === current.correctAnswer;
  const answered = currentAnswer !== undefined;

  const correctCount = Object.keys(state.selectedAnswers).filter(
    (id) => state.selectedAnswers[parseInt(id)] === test.questions.find((q) => q.id === parseInt(id))?.correctAnswer
  ).length;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectAnswer = (optionIndex: number) => {
    if (!state.testStarted || state.testCompleted || answered) return;
    setState((prev) => ({
      ...prev,
      selectedAnswers: { ...prev.selectedAnswers, [current.id]: optionIndex },
      showSolution: true,
    }));
  };

  const handleNext = () => {
    if (state.currentQuestion < total - 1) {
      setState((prev) => ({ ...prev, currentQuestion: prev.currentQuestion + 1, showSolution: false }));
    } else {
      setState((prev) => ({ ...prev, testCompleted: true }));
    }
  };

  const handlePrevious = () => {
    if (state.currentQuestion > 0) setState((prev) => ({ ...prev, currentQuestion: prev.currentQuestion - 1, showSolution: false }));
  };

  const handleStartTest = () => setState((prev) => ({ ...prev, testStarted: true, timeRemaining: (test.timeInMinutes || total) * 60 }));

  const handleRetakeTest = () =>
    setState({ currentQuestion: 0, selectedAnswers: {}, showSolution: false, timeRemaining: (test.timeInMinutes || total) * 60, testStarted: true, testCompleted: false });

  if (!state.testStarted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">{test.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">{test.description}</p>
            </div>
            <div className="space-y-6">
              <div className="rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Total Questions</p>
                    <p className="text-2xl font-bold">{total}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Time Limit</p>
                    <p className="text-2xl font-bold">{test.timeInMinutes || total} min</p>
                  </div>
                </div>
              </div>
              <Button onClick={handleStartTest} className="w-full bg-black dark:bg-white text-white dark:text-black py-6 text-lg font-semibold rounded-lg">Start Test</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (state.testCompleted) {
    const percentage = ((correctCount / total) * 100).toFixed(1);
    const percentageInt = Math.round(parseFloat(percentage));
    const passed = percentageInt >= 40; // default pass

    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900">
            <div className="text-center mb-8">
              <div className="mb-6">
                <div className={`text-6xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-red-600'}`}>{percentage}%</div>
                <h1 className="text-3xl font-bold mb-2">{passed ? '🎉 Great Job!' : 'Keep Practicing!'}</h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">You answered {correctCount} out of {total} questions correctly</p>
            </div>
            <Button onClick={handleRetakeTest} className="w-full bg-black dark:bg-white text-white dark:text-black py-6 text-lg font-semibold rounded-lg">Retake Test</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-4 text-center border-black/10 dark:border-white/10 bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">Question</p>
            <p className="text-2xl font-bold">{state.currentQuestion + 1}/{total}</p>
          </Card>
          <Card className="p-4 text-center border-black/10 dark:border-white/10 bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">Time Left</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatTime(state.timeRemaining)}</p>
          </Card>
          <Card className="p-4 text-center border-black/10 dark:border-white/10 bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">Correct</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{correctCount}/{Object.keys(state.selectedAnswers).length}</p>
          </Card>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round(((state.currentQuestion + 1) / total) * 100)}%</span>
          </div>
          <Progress value={((state.currentQuestion + 1) / total) * 100} className="h-2" />
        </div>

        <Card className="p-8 mb-8 border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{current.subject} • {current.difficulty?.toUpperCase() || 'MIXED'}</p>
                <h2 className="text-2xl font-bold">{current.question}</h2>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {current.options.map((option, idx) => (
              <button key={idx} onClick={() => handleSelectAnswer(idx)} disabled={answered} className={`w-full p-4 text-left rounded-lg border-2 transition-all ${!answered ? 'border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 cursor-pointer' : idx === current.correctAnswer ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : idx === currentAnswer && !isCorrect ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold flex-shrink-0">{String.fromCharCode(65 + idx)}</div>
                  <span className="flex-1">{option}</span>
                  {answered && idx === current.correctAnswer && <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />}
                  {answered && idx === currentAnswer && !isCorrect && <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />}
                </div>
              </button>
            ))}
          </div>

          {state.showSolution && answered && (
            <div className={`p-4 rounded-lg border-l-4 ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : 'bg-red-50 dark:bg-red-900/20 border-red-500'}`}>
              <div className="flex gap-3">
                {isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <h3 className={`font-semibold mb-2 ${isCorrect ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}`}>{isCorrect ? '✓ Correct!' : '✗ Incorrect'}</h3>
                  <p className={`text-sm mb-2 ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}><strong>Correct Answer:</strong> {String.fromCharCode(65 + current.correctAnswer)} - {current.options[current.correctAnswer]}</p>
                  {current.explanation && <div className={`pt-3 border-t ${isCorrect ? 'border-green-300 dark:border-green-700' : 'border-red-300 dark:border-red-700'}`}><p className={`text-sm ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}><strong>Explanation:</strong> {current.explanation}</p></div>}
                </div>
              </div>
            </div>
          )}
        </Card>

        <div className="flex gap-4">
          <Button onClick={handlePrevious} disabled={state.currentQuestion === 0} variant="outline" className="flex-1 py-6 text-lg font-semibold rounded-lg">← Previous</Button>
          <Button onClick={handleNext} disabled={!answered} className="flex-1 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 py-6 text-lg font-semibold rounded-lg">{state.currentQuestion === total - 1 ? 'Finish →' : 'Next →'}</Button>
        </div>
      </div>
    </div>
  );
}
