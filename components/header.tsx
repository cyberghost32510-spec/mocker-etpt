"use client";

import Link from "next/link";
import { Zap, Home, BarChart3 } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 dark:border-white/10 bg-white/95 dark:bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 dark:supports-[backdrop-filter]:bg-black/90 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 group hover:opacity-80 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black dark:bg-white group-hover:shadow-lg transition-shadow">
            <Zap className="h-6 w-6 text-white dark:text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-black dark:text-white">Mocker</span>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 leading-none">Entry Test Master</span>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors hover:animate-pulse">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link href="/tests" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors hover:animate-pulse">
            <Zap className="w-4 h-4" />
            Practice Tests
          </Link>
          <Link href="/tests/results" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors hover:animate-pulse">
            <BarChart3 className="w-4 h-4" />
            My Results
          </Link>
        </nav>
      </div>
    </header>
  );
}
