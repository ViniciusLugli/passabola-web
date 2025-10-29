import React from "react";

export default function LoadingSkeleton({ count = 3 }) {
  return (
    <div role="status" aria-live="polite" className="space-y-4">
      <span className="sr-only">Carregando</span>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-surface border border-default rounded-xl p-4"
        >
          <div className="h-4 bg-default rounded w-1/3 mb-3" />
          <div className="h-3 bg-default rounded w-full mb-2" />
          <div className="h-3 bg-default rounded w-5/6" />
        </div>
      ))}
    </div>
  );
}
