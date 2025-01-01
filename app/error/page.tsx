"use client";

import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error?: Error;
  reset?: () => void;
}) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Oops! Something went wrong
      </h1>

      <p className="text-gray-600 mb-6 max-w-md">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>

      <div className="flex gap-4">
        {reset && (
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try again
          </button>
        )}

        <Link
          href="/"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Go back home
        </Link>
      </div>

      {error?.message && (
        <p className="mt-8 text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
          Error details: {error.message}
        </p>
      )}
    </div>
  );
}
