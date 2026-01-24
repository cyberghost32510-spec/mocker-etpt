"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  AlertTriangle,
} from "lucide-react";
import { useTestStore } from "@/lib/test-store";
import { cn } from "@/lib/utils";

export function TestInterface() {
  const router = useRouter();
  const {
    questions,
    currentQuestionIndex,
    answers,
    flaggedQuestions,
    timeRemaining,
    setTimeRemaining,
    answerQuestion,
    toggleFlag,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    endTest,
    isTestActive,
  } = useTestStore();

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Timer
  useEffect(() => {
    if (!isTestActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(timeRemaining - 1);
      if (timeRemaining <= 1) {
        endTest();
        router.push("/tests/results");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTestActive, timeRemaining, setTimeRemaining, endTest, router]);

  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const handleSubmit = () => {
    endTest();
    router.push("/tests/results");
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading questions...</p>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = flaggedQuestions.size;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Progress */}
            <div className="flex-1 max-w-md">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium whitespace-nowrap">
                  Q {currentQuestionIndex + 1}/{questions.length}
                </span>
                <Progress value={progress} className="h-2 flex-1" />
              </div>
            </div>

            {/* Timer */}
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold",
                timeRemaining < 300
                  ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
              )}
            >
              <Clock className="h-5 w-5" />
              {formatTime(timeRemaining)}
            </div>

            {/* Submit Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  Submit Test
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Submit Test?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p>Are you sure you want to submit your test?</p>
                    <div className="flex gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>Answered: {answeredCount}/{questions.length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4 text-amber-500" />
                        <span>Flagged: {flaggedCount}</span>
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Continue Test</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleSubmit}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    Submit
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3 space-y-6">
            {/* Question Card */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="space-y-2">
                    <Badge variant="outline">{currentQuestion.subject}</Badge>
                    <Badge
                      variant="secondary"
                      className={cn(
                        currentQuestion.difficulty === "easy" &&
                          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                        currentQuestion.difficulty === "medium" &&
                          "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                        currentQuestion.difficulty === "hard" &&
                          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      )}
                    >
                      {currentQuestion.difficulty}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFlag(currentQuestion.id)}
                    className={cn(
                      flaggedQuestions.has(currentQuestion.id) &&
                        "text-amber-500 hover:text-amber-600"
                    )}
                  >
                    <Flag className="h-5 w-5" />
                  </Button>
                </div>

                <h2 className="text-xl font-medium mb-6">
                  {currentQuestion.question}
                </h2>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = answers[currentQuestion.id] === index;
                    return (
                      <button
                        key={index}
                        onClick={() => answerQuestion(currentQuestion.id, index)}
                        className={cn(
                          "w-full text-left p-4 rounded-lg border-2 transition-all",
                          "hover:border-emerald-500/50 hover:bg-emerald-500/5",
                          isSelected
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-border"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium",
                              isSelected
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : "border-muted-foreground/30"
                            )}
                          >
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={nextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm sticky top-24">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Question Navigator</h3>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, index) => {
                    const isAnswered = answers[q.id] !== undefined;
                    const isFlagged = flaggedQuestions.has(q.id);
                    const isCurrent = index === currentQuestionIndex;

                    return (
                      <button
                        key={q.id}
                        onClick={() => goToQuestion(index)}
                        className={cn(
                          "relative w-10 h-10 rounded-lg text-sm font-medium transition-all",
                          "flex items-center justify-center",
                          isCurrent && "ring-2 ring-emerald-500 ring-offset-2",
                          isAnswered
                            ? "bg-emerald-500 text-white"
                            : "bg-muted hover:bg-muted/80"
                        )}
                      >
                        {index + 1}
                        {isFlagged && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded bg-emerald-500" />
                    <span>Answered ({answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded bg-muted" />
                    <span>Not Answered ({questions.length - answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="relative w-4 h-4">
                      <div className="w-4 h-4 rounded bg-muted" />
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full" />
                    </div>
                    <span>Flagged ({flaggedCount})</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
