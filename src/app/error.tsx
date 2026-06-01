"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center px-4">
      <h1 className="text-3xl font-bold font-playfair">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md">
        An unexpected error occurred. We&apos;ve been notified.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
