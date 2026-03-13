"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2 max-w-md">
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            className="mt-6 px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
