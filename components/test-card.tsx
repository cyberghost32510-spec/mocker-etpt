"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, BarChart3 } from "lucide-react";
import Link from "next/link";
import type { TestCategory } from "@/lib/questions";

interface TestCardProps {
  category: TestCategory;
}

export function TestCard({ category }: TestCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-black/20 dark:hover:border-white/20 border-black/10 dark:border-white/10 bg-white dark:bg-black animate-slide-in">
      <div className={`absolute top-0 left-0 w-1 h-full ${category.color}`} />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-200 dark:bg-gray-800 rounded-full mix-blend-multiply filter blur-3xl opacity-5 group-hover:opacity-10 transition-opacity" />
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-bold leading-tight text-black dark:text-white">
            {category.name}
          </CardTitle>
        </div>
        <Badge variant="secondary" className="w-fit mt-1 bg-gray-100 dark:bg-gray-900 text-black dark:text-white border-black/20 dark:border-white/20">
          {category.description}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4 relative z-10">
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
            <BookOpen className="h-5 w-5 text-black dark:text-white flex-shrink-0" />
            <span>
              <span className="font-semibold text-black dark:text-white">{category.subjects.length}</span> subjects
            </span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
            <BarChart3 className="h-5 w-5 text-black dark:text-white flex-shrink-0" />
            <span>
              <span className="font-semibold text-black dark:text-white">{category.totalQuestions}</span> questions
            </span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
            <Clock className="h-5 w-5 text-black dark:text-white flex-shrink-0" />
            <span>
              <span className="font-semibold text-black dark:text-white">{category.timeInMinutes}</span> minutes
            </span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
            <BarChart3 className="h-5 w-5 text-black dark:text-white flex-shrink-0" />
            <span>
              <span className="font-semibold text-black dark:text-white capitalize">{category.difficulty}</span> level
            </span>
          </div>
        </div>
        <Link href={`/tests/${category.id}`} className="block">
          <Button className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105">
            Start Test
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
