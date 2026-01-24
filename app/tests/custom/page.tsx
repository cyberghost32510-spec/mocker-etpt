"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TestInterface } from "@/components/test-interface";
import { useTestStore } from "@/lib/test-store";
import { getCustomQuestions } from "@/lib/questions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { BookOpen, Clock, BarChart3, ArrowRight, ArrowLeft, Sparkles, Shuffle, Timer } from "lucide-react";
import Link from "next/link";
import Loading from "./loading"; // Import the Loading component

function CustomTestContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const subjects = searchParams.get("subjects")?.split(",") || [];
  const count = parseInt(searchParams.get("count") || "20");
  const difficulty = searchParams.get("difficulty") || "mixed";
  const time = parseInt(searchParams.get("time") || "30");
  const shuffle = searchParams.get("shuffle") !== "false";
  const showTimer = searchParams.get("timer") !== "false";

  const { startTest, isTestActive } = useTestStore();
  const [showStartScreen, setShowStartScreen] = useState(true);

  useEffect(() => {
    if (isTestActive) {
      setShowStartScreen(false);
    }
  }, [isTestActive]);

  if (subjects.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Test Configuration</h1>
          <p className="text-muted-foreground mb-6">
            Please select at least one subject to create a custom test.
          </p>
          <Link href="/tests">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Back to Tests
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleStartTest = () => {
    const questions = getCustomQuestions(subjects, count, difficulty);
    if (questions.length === 0) {
      alert("No questions available for the selected subjects");
      return;
    }
    startTest(questions, time * 60, "Custom Test");
    setShowStartScreen(false);
  };

  if (!showStartScreen && isTestActive) {
    return <TestInterface />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/tests" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Tests
          </Link>

          <Card className="overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-emerald-500" />
              </div>
              <CardTitle className="text-2xl">Custom Test</CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                Personalized test based on your preferences
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <BookOpen className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="font-medium">Subjects</p>
                    <p className="text-muted-foreground">
                      {subjects.length} selected
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Questions</p>
                    <p className="text-muted-foreground">{count} MCQs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-muted-foreground">{time} minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Difficulty</p>
                    <p className="text-muted-foreground capitalize">
                      {difficulty}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Selected Subjects:</p>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <Badge key={subject} variant="secondary">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Shuffle className={`h-4 w-4 ${shuffle ? "text-emerald-500" : "text-muted-foreground"}`} />
                  <span className={shuffle ? "text-foreground" : "text-muted-foreground"}>
                    {shuffle ? "Shuffled" : "Sequential"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Timer className={`h-4 w-4 ${showTimer ? "text-emerald-500" : "text-muted-foreground"}`} />
                  <span className={showTimer ? "text-foreground" : "text-muted-foreground"}>
                    {showTimer ? "Timer On" : "Timer Hidden"}
                  </span>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Instructions:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Each question has only one correct answer.</li>
                  <li>• You can navigate between questions using the navigator.</li>
                  <li>• Flag questions you want to review later.</li>
                  <li>• The test will auto-submit when time runs out.</li>
                  <li>• Make sure you have a stable internet connection.</li>
                </ul>
              </div>

              <Button
                onClick={handleStartTest}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-12 text-lg"
              >
                Start Test
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function CustomTestPage() {
  return (
    <Suspense fallback={<Loading />}> {/* Use the Loading component as fallback */}
      <CustomTestContent />
    </Suspense>
  );
}
