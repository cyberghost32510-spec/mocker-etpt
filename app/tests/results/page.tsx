"use client";

import { TestResults } from "@/components/test-results";
import { Header } from "@/components/header";

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TestResults />
    </div>
  );
}
