'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-dvh flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold">Cancellation Flow Demo</h1>
        <p className="text-gray-600">Open the flow and walk through the steps.</p>
        <Link href="/cancel" className="inline-block rounded-lg bg-gray-900 px-4 py-2 text-white">Open /cancel</Link>
      </div>
    </main>
  );
}
