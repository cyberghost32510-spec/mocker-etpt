"use client";

import { Header } from "@/components/header";
import { TestCard } from "@/components/test-card";
import { CustomTestDialog } from "@/components/custom-test-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { testCategories } from "@/lib/questions";
import tests from '@/lib/tests';
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TestsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="preset" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-gray-100 dark:bg-gray-900">
            <TabsTrigger value="preset" className="data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-black dark:data-[state=active]:text-white font-semibold">Preset Tests</TabsTrigger>
            <TabsTrigger value="custom" className="data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-black dark:data-[state=active]:text-white font-semibold">Custom Test</TabsTrigger>
          </TabsList>

          <TabsContent value="preset" className="space-y-8">
            {/* Maths 100 MCQ Test Banner */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black rounded-lg p-1">
              <div className="bg-white dark:bg-black rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-black dark:text-white mb-2 animate-slide-in">
                      📐 Maths 100 MCQ Mock Test
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      100 carefully curated mathematics questions with detailed solutions. 100 minutes to complete.
                    </p>
                    <div className="flex gap-6 mt-3 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        <strong>100 Questions</strong> • 100 Minutes • Mixed Difficulty
                      </span>
                    </div>
                  </div>

              {/* Combined / Preset Tests from lib/tests */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Other Preset Tests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tests.map((t) => (
                    <div key={t.slug} className="animate-slide-in">
                      <div className="border border-black/10 dark:border-white/10 rounded-lg p-4 bg-white dark:bg-black">
                        <h4 className="font-bold mb-1">{t.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t.description}</p>
                        <div className="flex gap-2">
                          <Link href={`/tests/${t.slug}`} className="w-full">
                            <Button className="w-full bg-black dark:bg-white text-white dark:text-black">Open →</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
                  <Link href="/tests/maths-100" className="flex-shrink-0">
                    <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 px-8 py-2 font-semibold rounded-lg transition-all transform hover:scale-105 duration-200">
                      Take Test →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Category Tests Grid */}
            <div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-6">
                Category-Based Tests
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {testCategories.map((category) => (
                  <TestCard key={category.id} category={category} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <div className="flex justify-center py-12">
              <CustomTestDialog />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <Link href="/">
            <Button className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg font-semibold px-6 py-2 transition-all transform hover:scale-105 duration-200">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
