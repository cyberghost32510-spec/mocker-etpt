'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { BookOpen, Zap, Target, Users, BarChart3, Lightbulb, CheckCircle2, Clock, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 lg:py-40 bg-gradient-to-br from-black/5 dark:from-white/5 via-white dark:via-black to-white dark:to-black border-b border-black/10 dark:border-white/10 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gray-200 dark:bg-gray-800 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gray-300 dark:bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-2000" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 text-black dark:text-white animate-slide-in">
              Master Entry Tests with <span className="font-black">Mocker</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
              The ultimate platform for entry test preparation. Practice with realistic mock tests, get detailed analytics, and ace your engineering & medical entrance exams with confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/tests">
                <Button size="lg" className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg shadow-lg text-lg px-10 py-7 transform hover:scale-105 transition-all duration-200 font-semibold animate-slide-in">
                  Start Practicing Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-black border-b border-black/10 dark:border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 rounded-lg bg-white dark:bg-black border border-black/10 dark:border-white/10 hover:shadow-md transition-all duration-300 transform hover:scale-105 animate-slide-in">
              <div className="text-4xl font-bold text-black dark:text-white mb-2">1000+</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Mock Questions</div>
            </div>
            <div className="p-6 rounded-lg bg-white dark:bg-black border border-black/10 dark:border-white/10 hover:shadow-md transition-all duration-300 transform hover:scale-105 animate-slide-in animation-delay-100">
              <div className="text-4xl font-bold text-black dark:text-white mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Practice Tests</div>
            </div>
            <div className="p-6 rounded-lg bg-white dark:bg-black border border-black/10 dark:border-white/10 hover:shadow-md transition-all duration-300 transform hover:scale-105 animate-slide-in animation-delay-200">
              <div className="text-4xl font-bold text-black dark:text-white mb-2">100%</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Free Access</div>
            </div>
            <div className="p-6 rounded-lg bg-white dark:bg-black border border-black/10 dark:border-white/10 hover:shadow-md transition-all duration-300 transform hover:scale-105 animate-slide-in animation-delay-300">
              <div className="text-4xl font-bold text-black dark:text-white mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-4 animate-slide-in">
              Everything You Need to Excel
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Our platform combines realistic mock tests with powerful analytics to help you identify strengths and master weak areas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Comprehensive Question Bank',
                description: 'Hundreds of entry test questions covering all subjects with detailed solutions.'
              },
              {
                icon: Target,
                title: 'Full-Length Mock Tests',
                description: 'Experience the real test format with timed, full-length mock examinations.'
              },
              {
                icon: BarChart3,
                title: 'Detailed Analytics',
                description: 'Track progress with comprehensive reports on accuracy, speed, and subject performance.'
              },
              {
                icon: Zap,
                title: 'Smart Learning Path',
                description: 'Personalized recommendations based on your performance patterns and weak areas.'
              },
              {
                icon: Users,
                title: 'Community Support',
                description: 'Connect with thousands of test-takers and get support from the Mocker community.'
              },
              {
                icon: Clock,
                title: 'Anytime, Anywhere',
                description: 'Practice at your own pace with full access on desktop, tablet, and mobile devices.'
              }
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card key={idx} className="p-6 border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow">
                  <div className="mb-4">
                    <Icon className="w-12 h-12 text-black dark:text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-black/5 dark:bg-white/5 border-y border-black/10 dark:border-white/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-4">
              How Mocker Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Simple yet powerful process to improve your entry test scores
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: '1', title: 'Choose Test', desc: 'Select from category-based or full-length mock tests' },
              { num: '2', title: 'Practice', desc: 'Solve questions under timed conditions' },
              { num: '3', title: 'Review', desc: 'Check detailed solutions and explanations' },
              { num: '4', title: 'Improve', desc: 'Use analytics to focus on weak areas' }
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-black/10 dark:border-white/10 text-center">
                  <div className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-black dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{step.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-1 bg-black/20 dark:bg-white/20 transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-black dark:bg-white text-white dark:text-black">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to Master Your Entry Test?
          </h2>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Join thousands of students who improved their scores with Mocker. Start free today!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/tests">
              <Button size="lg" className="bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg text-lg px-10 py-7 transform hover:scale-105 transition-all duration-300">
                Start Free Now
              </Button>
            </Link>
            <Link href="/docs/get-started.html">
              <Button variant="outline" size="lg" className="border-white dark:border-black text-white dark:text-black hover:bg-white/10 dark:hover:bg-black/10 rounded-lg text-lg px-10 py-7 transform hover:scale-105 transition-all duration-300">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
