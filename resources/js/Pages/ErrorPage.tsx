import React from "react";
import { Link } from "@inertiajs/react";

interface ErrorPageProps {
  statusCode?: number;
  message?: string;
  componentStack?: string;
}

export default function ErrorPage({
  statusCode = 500,
  message = "An unexpected error occurred.",
  componentStack,
}: ErrorPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">{statusCode}</h1>
      <p className="text-xl text-gray-800 mb-6">{message}</p>

      {componentStack && (
        <div className="bg-red-100 text-left text-sm p-4 rounded mb-6 max-w-2xl w-full">
          <strong>Component Stack Trace:</strong>
          <pre className="whitespace-pre-wrap">{componentStack}</pre>
        </div>
      )}

      <Link
        href="/"
        className="inline-block px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium"
      >
        ⬅ Back to Home
      </Link>
    </div>
  );
}
