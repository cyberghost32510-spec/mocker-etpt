"use client";

import React from "react"

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Sparkles,
  Clock,
  BookOpen,
  Zap,
  Target,
  BarChart3,
  Settings2,
  Shuffle,
  CheckCircle2,
} from "lucide-react";
import { availableSubjects, getSubjectCounts } from "@/lib/questions";
import { cn } from "@/lib/utils";

const subjectIcons: Record<string, React.ReactNode> = {
  Physics: <Zap className="h-4 w-4" />,
  Chemistry: <span className="text-xs font-bold">Chem</span>,
  Mathematics: <span className="text-xs font-bold">Math</span>,
  Biology: <span className="text-xs font-bold">Bio</span>,
  English: <span className="text-xs font-bold">Eng</span>,
  "Basic Maths": <span className="text-xs font-bold">BM</span>,
  "Advanced Maths": <span className="text-xs font-bold">AM</span>,
  "Design Aptitude": <span className="text-xs font-bold">DA</span>,
};

const subjectColors: Record<string, string> = {
  Physics: "bg-blue-500/10 border-blue-500/30 text-blue-600 hover:bg-blue-500/20",
  Chemistry: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/20",
  Mathematics: "bg-purple-500/10 border-purple-500/30 text-purple-600 hover:bg-purple-500/20",
  Biology: "bg-green-500/10 border-green-500/30 text-green-600 hover:bg-green-500/20",
  English: "bg-orange-500/10 border-orange-500/30 text-orange-600 hover:bg-orange-500/20",
  "Basic Maths": "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 hover:bg-cyan-500/20",
  "Advanced Maths": "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 hover:bg-indigo-500/20",
  "Design Aptitude": "bg-pink-500/10 border-pink-500/30 text-pink-600 hover:bg-pink-500/20",
};

const difficultyConfig = {
  mixed: { label: "Mixed", color: "bg-gray-500", description: "All difficulty levels" },
  easy: { label: "Easy", color: "bg-green-500", description: "Beginner friendly" },
  medium: { label: "Medium", color: "bg-yellow-500", description: "Moderate challenge" },
  hard: { label: "Hard", color: "bg-red-500", description: "Advanced level" },
};

export function CustomTestDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState([30]);
  const [difficulty, setDifficulty] = useState<"mixed" | "easy" | "medium" | "hard">("mixed");
  const [timeLimit, setTimeLimit] = useState([45]);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [showTimer, setShowTimer] = useState(true);
  const [activeTab, setActiveTab] = useState("subjects");

  const subjectCounts = useMemo(() => getSubjectCounts(), []);

  const availableQuestionsCount = useMemo(() => {
    if (selectedSubjects.length === 0) return 0;
    
    let count = 0;
    selectedSubjects.forEach(subject => {
      if (difficulty === "mixed") {
        count += subjectCounts[subject]?.total || 0;
      } else {
        count += subjectCounts[subject]?.[difficulty] || 0;
      }
    });
    return count;
  }, [selectedSubjects, difficulty, subjectCounts]);

  const maxQuestions = Math.min(availableQuestionsCount, 100);

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) => {
      const newSelected = prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject];
      
      // Adjust question count if it exceeds available questions
      const newAvailable = newSelected.reduce((acc, s) => {
        if (difficulty === "mixed") {
          return acc + (subjectCounts[s]?.total || 0);
        }
        return acc + (subjectCounts[s]?.[difficulty] || 0);
      }, 0);
      
      if (questionCount[0] > newAvailable) {
        setQuestionCount([Math.max(5, newAvailable)]);
      }
      
      return newSelected;
    });
  };

  const selectAllSubjects = () => {
    setSelectedSubjects([...availableSubjects]);
  };

  const clearAllSubjects = () => {
    setSelectedSubjects([]);
  };

  const handleStartTest = () => {
    if (selectedSubjects.length === 0) return;

    const params = new URLSearchParams({
      subjects: selectedSubjects.join(","),
      count: questionCount[0].toString(),
      difficulty,
      time: timeLimit[0].toString(),
      shuffle: shuffleQuestions.toString(),
      timer: showTimer.toString(),
    });

    setOpen(false);
    router.push(`/tests/custom?${params.toString()}`);
  };

  const timePresets = [
    { label: "Quick", value: 15, icon: <Zap className="h-3 w-3" /> },
    { label: "Normal", value: 45, icon: <Clock className="h-3 w-3" /> },
    { label: "Extended", value: 90, icon: <Target className="h-3 w-3" /> },
    { label: "Full", value: 180, icon: <BarChart3 className="h-3 w-3" /> },
  ];

  const questionPresets = [10, 25, 50, 75, 100];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-auto py-6 px-8 border-dashed border-2 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all bg-transparent"
        >
          <div className="flex flex-col items-center gap-2">
            <Sparkles className="h-8 w-8 text-emerald-500" />
            <span className="font-semibold">Custom Test</span>
            <span className="text-xs text-muted-foreground">
              Create your own test
            </span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-emerald-500" />
            Create Custom Test
          </DialogTitle>
          <DialogDescription>
            Customize every aspect of your test for the perfect practice session.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="subjects" className="text-xs sm:text-sm">
              <BookOpen className="h-4 w-4 mr-1 sm:mr-2" />
              Subjects
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">
              <Settings2 className="h-4 w-4 mr-1 sm:mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs sm:text-sm">
              <Zap className="h-4 w-4 mr-1 sm:mr-2" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] pr-4">
            <TabsContent value="subjects" className="mt-4 space-y-4">
              {/* Subject Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Select Subjects</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={selectAllSubjects}
                      className="h-7 text-xs"
                    >
                      Select All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllSubjects}
                      className="h-7 text-xs"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {availableSubjects.map((subject) => {
                    const isSelected = selectedSubjects.includes(subject);
                    const counts = subjectCounts[subject];
                    return (
                      <button
                        key={subject}
                        onClick={() => toggleSubject(subject)}
                        className={cn(
                          "flex items-center justify-between rounded-lg border p-3 transition-all text-left",
                          isSelected
                            ? subjectColors[subject]
                            : "border-border hover:border-muted-foreground/30"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-md flex items-center justify-center",
                              isSelected ? "bg-background/50" : "bg-muted"
                            )}
                          >
                            {subjectIcons[subject]}
                          </div>
                          <div>
                            <span className="text-sm font-medium block">{subject}</span>
                            <span className="text-xs text-muted-foreground">
                              {counts?.total || 0} questions
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="h-5 w-5 text-current" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedSubjects.length > 0 && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{availableQuestionsCount}</span> questions available from {selectedSubjects.length} subject{selectedSubjects.length > 1 ? "s" : ""}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-4 space-y-6">
              {/* Difficulty Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Difficulty Level</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(difficultyConfig) as [keyof typeof difficultyConfig, typeof difficultyConfig.mixed][]).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setDifficulty(key)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border p-3 transition-all text-left",
                        difficulty === key
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-border hover:border-muted-foreground/30"
                      )}
                    >
                      <div className={cn("w-3 h-3 rounded-full", config.color)} />
                      <div>
                        <span className="text-sm font-medium block">{config.label}</span>
                        <span className="text-xs text-muted-foreground">{config.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Number of Questions</Label>
                  <Badge variant="secondary" className="font-mono">
                    {questionCount[0]} / {maxQuestions}
                  </Badge>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {questionPresets.map((preset) => (
                    <Button
                      key={preset}
                      variant={questionCount[0] === preset ? "default" : "outline"}
                      size="sm"
                      onClick={() => setQuestionCount([Math.min(preset, maxQuestions)])}
                      disabled={preset > maxQuestions}
                      className={cn(
                        "text-xs",
                        questionCount[0] === preset && "bg-emerald-500 hover:bg-emerald-600"
                      )}
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
                <Slider
                  value={questionCount}
                  onValueChange={setQuestionCount}
                  max={maxQuestions || 100}
                  min={5}
                  step={5}
                  className="w-full"
                  disabled={maxQuestions === 0}
                />
              </div>

              {/* Time Limit */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Time Limit</Label>
                  <Badge variant="secondary" className="font-mono">
                    {timeLimit[0]} min
                  </Badge>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {timePresets.map((preset) => (
                    <Button
                      key={preset.value}
                      variant={timeLimit[0] === preset.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTimeLimit([preset.value])}
                      className={cn(
                        "text-xs gap-1",
                        timeLimit[0] === preset.value && "bg-emerald-500 hover:bg-emerald-600"
                      )}
                    >
                      {preset.icon}
                      {preset.label}
                    </Button>
                  ))}
                </div>
                <Slider
                  value={timeLimit}
                  onValueChange={setTimeLimit}
                  max={180}
                  min={5}
                  step={5}
                  className="w-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="mt-4 space-y-6">
              {/* Advanced Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Shuffle className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Shuffle Questions</p>
                      <p className="text-xs text-muted-foreground">
                        Randomize question order each time
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={shuffleQuestions}
                    onCheckedChange={setShuffleQuestions}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Show Timer</p>
                      <p className="text-xs text-muted-foreground">
                        Display countdown timer during test
                      </p>
                    </div>
                  </div>
                  <Switch checked={showTimer} onCheckedChange={setShowTimer} />
                </div>
              </div>

              {/* Test Summary */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Test Summary
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subjects:</span>
                    <span className="font-medium">{selectedSubjects.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Questions:</span>
                    <span className="font-medium">{questionCount[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">{timeLimit[0]} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <span className="font-medium capitalize">{difficulty}</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Estimated time per question:{" "}
                    <span className="font-medium text-foreground">
                      {questionCount[0] > 0
                        ? Math.round((timeLimit[0] * 60) / questionCount[0])
                        : 0}{" "}
                      seconds
                    </span>
                  </p>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleStartTest}
            disabled={selectedSubjects.length === 0}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Start Test
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
