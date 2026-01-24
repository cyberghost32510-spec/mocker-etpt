"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-black/10 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black dark:bg-white">
                <Zap className="h-5 w-5 text-white dark:text-black" />
              </div>
              <span className="text-lg font-black">Mocker</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Master entry tests with free, comprehensive mock practice tests and analytics.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h3>
            <ul className="space-y-2">
              <li><Link href="/tests" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Practice Tests</Link></li>
              <li><Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/tests/results" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Results</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/docs/how-to-prepare.html" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">How to Prepare</Link></li>
              <li><Link href="/docs/get-started.html" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Getting Started</Link></li>
              <li><Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-black/10 dark:border-white/10 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2026 Mocker - Entry Test Master. All rights reserved.</p>
          <p className="mt-2 text-xs">Built with ❤️ for ambitious test-takers</p>
        </div>
      </div>
    </footer>
  );
}
