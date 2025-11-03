"use client";

import React from "react";

export default function NotificationCardSkeleton() {
  return (
    <div className="p-4 rounded-lg border bg-surface animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded bg-surface-muted"></div>
        <div className="flex-1">
          <div className="h-4 bg-surface-muted rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-surface-muted rounded w-full mb-2"></div>
          <div className="h-3 bg-surface-muted rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
}
