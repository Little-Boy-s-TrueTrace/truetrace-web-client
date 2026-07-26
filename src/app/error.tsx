'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error securely (without exposing sensitive stack traces to client)
    console.error('Application Error:', error.message);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h2 className="text-2xl font-bold mb-4 text-red-500">Something went wrong!</h2>
      <p className="text-gray-400 mb-6">An unexpected application error has occurred. Please try again or contact support.</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
