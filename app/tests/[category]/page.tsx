"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TestInterface } from "@/components/test-interface";
import { useTestStore } from "@/lib/test-store";
import {
  testCategories,
  getQuestionsForCategory,
} from "@/lib/questions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { BookOpen, Clock, BarChart3, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CategoryTestPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.category as string;
  const category = testCategories.find((c) => c.id === categoryId);

  const { startTest, isTestActive } = useTestStore();
  const [showStartScreen, setShowStartScreen] = useState(true);

  useEffect(() => {
    if (isTestActive) {
      setShowStartScreen(false);
    }
  }, [isTestActive]);

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Test Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The requested test category does not exist.
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
    const questions = getQuestionsForCategory(categoryId);
    if (questions.length === 0) {
      alert("No questions available for this category");
      return;
    }
    startTest(questions, category.timeInMinutes * 60, category.name);
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
            <div className={`h-2 ${category.color}`} />
            <CardHeader className="text-center pb-2">
              <Badge variant="secondary" className="w-fit mx-auto mb-2">
                {category.description}
              </Badge>
              <CardTitle className="text-2xl">{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <BookOpen className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="font-medium">Subjects</p>
                    <p className="text-muted-foreground">
                      {category.subjects.join(", ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Questions</p>
                    <p className="text-muted-foreground">
                      {category.totalQuestions} MCQs
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-muted-foreground">
                      {category.timeInMinutes} minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Difficulty</p>
                    <p className="text-muted-foreground capitalize">
                      {category.difficulty}
                    </p>
                  </div>
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
