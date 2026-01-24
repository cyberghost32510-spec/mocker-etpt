"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Award,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Home,
} from "lucide-react";
import { useTestStore } from "@/lib/test-store";
import { cn } from "@/lib/utils";

interface SubjectStats {
  total: number;
  correct: number;
  wrong: number;
  unanswered: number;
}

export function TestResults() {
  const router = useRouter();
  const {
    questions,
    answers,
    testCategory,
    testStartTime,
    testEndTime,
    resetTest,
  } = useTestStore();

  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Calculate results
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(answers).length;
  const correctAnswers = questions.filter(
    (q) => answers[q.id] === q.correctAnswer
  ).length;
  const wrongAnswers = answeredQuestions - correctAnswers;
  const unansweredQuestions = totalQuestions - answeredQuestions;
  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Calculate time taken
  const timeTaken =
    testStartTime && testEndTime
      ? Math.round((testEndTime.getTime() - testStartTime.getTime()) / 1000)
      : 0;

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  // Calculate subject-wise stats
  const subjectStats: Record<string, SubjectStats> = {};
  questions.forEach((q) => {
    if (!subjectStats[q.subject]) {
      subjectStats[q.subject] = {
        total: 0,
        correct: 0,
        wrong: 0,
        unanswered: 0,
      };
    }
    subjectStats[q.subject].total++;
    if (answers[q.id] === undefined) {
      subjectStats[q.subject].unanswered++;
    } else if (answers[q.id] === q.correctAnswer) {
      subjectStats[q.subject].correct++;
    } else {
      subjectStats[q.subject].wrong++;
    }
  });

  const getGrade = (score: number) => {
    if (score >= 90) return { grade: "A+", color: "text-emerald-500" };
    if (score >= 80) return { grade: "A", color: "text-emerald-500" };
    if (score >= 70) return { grade: "B", color: "text-blue-500" };
    if (score >= 60) return { grade: "C", color: "text-amber-500" };
    if (score >= 50) return { grade: "D", color: "text-orange-500" };
    return { grade: "F", color: "text-red-500" };
  };

  const gradeInfo = getGrade(score);

  const displayedQuestions = showAll ? questions : questions.slice(0, 10);

  const handleRetake = () => {
    resetTest();
    router.push("/tests");
  };

  const handleGoHome = () => {
    resetTest();
    router.push("/tests");
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No test data found.</p>
            <Button onClick={() => router.push("/tests")} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Go to Tests
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Test Completed!</h1>
          <p className="text-muted-foreground">
            {testCategory || "Custom Test"} Results
          </p>
        </div>

        {/* Score Overview */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 mb-1">Your Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">{score}%</span>
                  <span className={cn("text-3xl font-bold", gradeInfo.color)}>
                    {gradeInfo.grade}
                  </span>
                </div>
              </div>
              <Award className="h-20 w-20 text-emerald-200" />
            </div>
            <Progress
              value={score}
              className="mt-4 h-3 bg-emerald-400/30"
            />
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                <CheckCircle className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {correctAnswers}
                </p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                <XCircle className="h-6 w-6 mx-auto mb-2 text-red-500" />
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {wrongAnswers}
                </p>
                <p className="text-sm text-muted-foreground">Wrong</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <Target className="h-6 w-6 mx-auto mb-2 text-amber-500" />
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {unansweredQuestions}
                </p>
                <p className="text-sm text-muted-foreground">Skipped</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <Clock className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatTime(timeTaken)}
                </p>
                <p className="text-sm text-muted-foreground">Time Taken</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject-wise Performance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Subject-wise Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(subjectStats).map(([subject, stats]) => {
                const subjectScore =
                  stats.total > 0
                    ? Math.round((stats.correct / stats.total) * 100)
                    : 0;
                return (
                  <div key={subject} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{subject}</span>
                      <span className="text-sm text-muted-foreground">
                        {stats.correct}/{stats.total} ({subjectScore}%)
                      </span>
                    </div>
                    <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-muted">
                      <div
                        className="bg-emerald-500 transition-all"
                        style={{
                          width: `${(stats.correct / stats.total) * 100}%`,
                        }}
                      />
                      <div
                        className="bg-red-500 transition-all"
                        style={{
                          width: `${(stats.wrong / stats.total) * 100}%`,
                        }}
                      />
                      <div
                        className="bg-amber-500 transition-all"
                        style={{
                          width: `${(stats.unanswered / stats.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-6 mt-4 pt-4 border-t text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Correct</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>Wrong</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Skipped</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayedQuestions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                const isUnanswered = userAnswer === undefined;
                const isExpanded = expandedQuestion === question.id;

                return (
                  <div
                    key={question.id}
                    className={cn(
                      "border rounded-lg overflow-hidden",
                      isCorrect && "border-emerald-200 dark:border-emerald-800",
                      !isCorrect &&
                        !isUnanswered &&
                        "border-red-200 dark:border-red-800",
                      isUnanswered && "border-amber-200 dark:border-amber-800"
                    )}
                  >
                    <button
                      onClick={() =>
                        setExpandedQuestion(isExpanded ? null : question.id)
                      }
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
                            isCorrect && "bg-emerald-500",
                            !isCorrect && !isUnanswered && "bg-red-500",
                            isUnanswered && "bg-amber-500"
                          )}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1">
                            {question.question}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {question.subject}
                            </Badge>
                            {isCorrect && (
                              <Badge className="bg-emerald-500 text-white text-xs">
                                Correct
                              </Badge>
                            )}
                            {!isCorrect && !isUnanswered && (
                              <Badge className="bg-red-500 text-white text-xs">
                                Wrong
                              </Badge>
                            )}
                            {isUnanswered && (
                              <Badge className="bg-amber-500 text-white text-xs">
                                Skipped
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="p-4 pt-0 border-t bg-muted/30">
                        <p className="font-medium mb-4">{question.question}</p>
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => {
                            const isUserAnswer = userAnswer === optIndex;
                            const isCorrectAnswer =
                              question.correctAnswer === optIndex;

                            return (
                              <div
                                key={optIndex}
                                className={cn(
                                  "p-3 rounded-lg border",
                                  isCorrectAnswer &&
                                    "bg-emerald-50 border-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-700",
                                  isUserAnswer &&
                                    !isCorrectAnswer &&
                                    "bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700",
                                  !isUserAnswer &&
                                    !isCorrectAnswer &&
                                    "bg-background border-border"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={cn(
                                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                                      isCorrectAnswer &&
                                        "bg-emerald-500 text-white",
                                      isUserAnswer &&
                                        !isCorrectAnswer &&
                                        "bg-red-500 text-white",
                                      !isUserAnswer &&
                                        !isCorrectAnswer &&
                                        "bg-muted border"
                                    )}
                                  >
                                    {String.fromCharCode(65 + optIndex)}
                                  </div>
                                  <span>{option}</span>
                                  {isCorrectAnswer && (
                                    <CheckCircle className="h-4 w-4 text-emerald-500 ml-auto" />
                                  )}
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <XCircle className="h-4 w-4 text-red-500 ml-auto" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {questions.length > 10 && (
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
                className="w-full mt-4"
              >
                {showAll
                  ? "Show Less"
                  : `Show All ${questions.length} Questions`}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            onClick={handleRetake}
            className="gap-2 bg-transparent"
          >
            <RotateCcw className="h-4 w-4" />
            Take Another Test
          </Button>
          <Button
            onClick={handleGoHome}
            className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            <Home className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
