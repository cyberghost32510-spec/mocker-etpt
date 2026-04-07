import React from 'react';
import { notFound } from 'next/navigation';
import tests, { testsMap } from '@/lib/tests';
import dynamic from 'next/dynamic';

const TestRunner = dynamic(() => import('@/components/test-runner'), { ssr: false });

export default function Page({ params }: { params: { slug: string } }) {
  const test = testsMap[params.slug];
  if (!test) return notFound();
  return <TestRunner test={test} />;
}
