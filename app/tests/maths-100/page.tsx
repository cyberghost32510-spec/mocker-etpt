"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { maths100Questions, mathsTestConfig } from "@/lib/maths-test";

interface TestState {
  currentQuestion: number;
  selectedAnswers: Record<number, number>;
  showSolution: boolean;
  timeRemaining: number;
  testStarted: boolean;
  testCompleted: boolean;
}

export default function Maths100TestPage() {
  const [state, setState] = useState<TestState>({
    currentQuestion: 0,
    selectedAnswers: {},
    showSolution: false,
    timeRemaining: mathsTestConfig.timeInMinutes * 60,
    testStarted: false,
    testCompleted: false,
  });

  // Timer effect
  useEffect(() => {
    if (!state.testStarted || state.testCompleted) return;

    const timer = setInterval(() => {
      setState((prev) => {
        if (prev.timeRemaining <= 0) {
          return { ...prev, testCompleted: true, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.testStarted, state.testCompleted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQuestion = maths100Questions[state.currentQuestion];
  const currentAnswer = state.selectedAnswers[currentQuestion.id];
  const isCorrect = currentAnswer === currentQuestion.correctAnswer;
  const answered = currentAnswer !== undefined;

  const progressPercent = ((state.currentQuestion + 1) / maths100Questions.length) * 100;

  const correctCount = Object.keys(state.selectedAnswers).filter(
    (id) =>
      state.selectedAnswers[parseInt(id)] ===
      maths100Questions.find((q) => q.id === parseInt(id))?.correctAnswer
  ).length;

  const handleSelectAnswer = (optionIndex: number) => {
    if (!state.testStarted || state.testCompleted || answered) return;

    setState((prev) => ({
      ...prev,
      selectedAnswers: {
        ...prev.selectedAnswers,
        [currentQuestion.id]: optionIndex,
      },
      showSolution: true,
    }));
  };

  const handleNext = () => {
    if (state.currentQuestion < maths100Questions.length - 1) {
      setState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        showSolution: false,
      }));
    } else {
      setState((prev) => ({ ...prev, testCompleted: true }));
    }
  };

  const handlePrevious = () => {
    if (state.currentQuestion > 0) {
      setState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1,
        showSolution: false,
      }));
    }
  };

  const handleStartTest = () => {
    setState((prev) => ({
      ...prev,
      testStarted: true,
      timeRemaining: mathsTestConfig.timeInMinutes * 60,
    }));
  };

  const handleRetakeTest = () => {
    setState({
      currentQuestion: 0,
      selectedAnswers: {},
      showSolution: false,
      timeRemaining: mathsTestConfig.timeInMinutes * 60,
      testStarted: true,
      testCompleted: false,
    });
  };

  // Pre-Test Screen
  if (!state.testStarted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">{mathsTestConfig.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {mathsTestConfig.description}
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Test Details
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Total Questions</p>
                    <p className="text-2xl font-bold">{mathsTestConfig.totalQuestions}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Time Limit</p>
                    <p className="text-2xl font-bold">{mathsTestConfig.timeInMinutes} min</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Time per Question</p>
                    <p className="text-2xl font-bold">1 min avg</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Difficulty</p>
                    <p className="text-2xl font-bold">Mixed</p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-400 mb-2">
                  ⚠️ Important Points
                </h3>
                <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-2">
                  <li>✓ Once you select an answer, it cannot be changed</li>
                  <li>✓ Solutions appear immediately after selection</li>
                  <li>✓ You can navigate between questions anytime</li>
                  <li>✓ Timer starts when you click "Start Test"</li>
                  <li>✓ Test auto-submits when time runs out</li>
                </ul>
              </div>

              <Button
                onClick={handleStartTest}
                className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 py-6 text-lg font-semibold rounded-lg"
              >
                Start Test
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Results Screen
  if (state.testCompleted) {
    const percentage = ((correctCount / maths100Questions.length) * 100).toFixed(1);
    const percentageInt = Math.round(parseFloat(percentage));
    const passed = percentageInt >= mathsTestConfig.passingPercentage;

    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900">
            <div className="text-center mb-8">
              <div className="mb-6">
                <div
                  className={`text-6xl font-bold mb-2 ${
                    passed
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {percentage}%
                </div>
                <h1 className="text-3xl font-bold mb-2">
                  {passed ? "🎉 Great Job!" : "Keep Practicing!"}
                </h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                You answered {correctCount} out of {maths100Questions.length} questions correctly
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {correctCount}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">Correct</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {maths100Questions.length - correctCount}
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">Incorrect</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {percentage}%
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">Score</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
              <h3 className="font-semibold mb-4">Performance Analysis</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Accuracy</span>
                    <span className="font-semibold">{percentage}%</span>
                  </div>
                  <Progress value={parseFloat(percentage)} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Questions Attempted</span>
                    <span className="font-semibold">{Object.keys(state.selectedAnswers).length}</span>
                  </div>
                  <Progress
                    value={
                      (Object.keys(state.selectedAnswers).length / maths100Questions.length) * 100
                    }
                    className="h-2"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleRetakeTest}
              className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 py-6 text-lg font-semibold rounded-lg"
            >
              Retake Test
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Test In Progress
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-4 text-center border-black/10 dark:border-white/10 bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">Question</p>
            <p className="text-2xl font-bold">
              {state.currentQuestion + 1}/{maths100Questions.length}
            </p>
          </Card>
          <Card className="p-4 text-center border-black/10 dark:border-white/10 bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">Time Left</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatTime(state.timeRemaining)}
            </p>
          </Card>
          <Card className="p-4 text-center border-black/10 dark:border-white/10 bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">Correct</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {correctCount}/{Object.keys(state.selectedAnswers).length}
            </p>
          </Card>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-8 border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  {currentQuestion.subject} • {currentQuestion.difficulty.toUpperCase()}
                </p>
                <h2 className="text-2xl font-bold">{currentQuestion.question}</h2>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(idx)}
                disabled={answered}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  !answered
                    ? "border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 cursor-pointer"
                    : idx === currentQuestion.correctAnswer
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : idx === currentAnswer && !isCorrect
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 dark:border-gray-600"
                } ${
                  currentAnswer === idx && !answered
                    ? "border-black dark:border-white bg-gray-100 dark:bg-gray-800"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold flex-shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="flex-1">{option}</span>
                  {answered && idx === currentQuestion.correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  )}
                  {answered && idx === currentAnswer && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Solution */}
          {state.showSolution && answered && (
            <div
              className={`p-4 rounded-lg border-l-4 ${
                isCorrect
                  ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                  : "bg-red-50 dark:bg-red-900/20 border-red-500"
              }`}
            >
              <div className="flex gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3
                    className={`font-semibold mb-2 ${
                      isCorrect
                        ? "text-green-800 dark:text-green-400"
                        : "text-red-800 dark:text-red-400"
                    }`}
                  >
                    {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
                  </h3>
                  <p
                    className={`text-sm mb-2 ${
                      isCorrect
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    <strong>Correct Answer:</strong>{" "}
                    {String.fromCharCode(65 + currentQuestion.correctAnswer)} -{" "}
                    {currentQuestion.options[currentQuestion.correctAnswer]}
                  </p>
                  {currentQuestion.explanation && (
                    <div
                      className={`pt-3 border-t ${
                        isCorrect
                          ? "border-green-300 dark:border-green-700"
                          : "border-red-300 dark:border-red-700"
                      }`}
                    >
                      <p
                        className={`text-sm ${
                          isCorrect
                            ? "text-green-700 dark:text-green-300"
                            : "text-red-700 dark:text-red-300"
                        }`}
                      >
                        <strong>Explanation:</strong> {currentQuestion.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex gap-4">
          <Button
            onClick={handlePrevious}
            disabled={state.currentQuestion === 0}
            variant="outline"
            className="flex-1 py-6 text-lg font-semibold rounded-lg"
          >
            ← Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!answered}
            className="flex-1 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 py-6 text-lg font-semibold rounded-lg"
          >
            {state.currentQuestion === maths100Questions.length - 1 ? "Finish →" : "Next →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
