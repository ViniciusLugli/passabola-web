"use client";

import React from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function Button({
  children,
  type = "button",
  onClick,
  loading = false,
  disabled = false,
  variant = "primary", // primary | secondary | ghost
  className = "",
  ariaLabel,
  ...props
}) {
  const isDisabled = disabled || loading;

  const base = `inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`;

  const variants = {
    primary: `w-full bg-accent text-on-brand px-5 py-3 sm:py-4 hover:bg-accent-strong shadow-elevated ${
      isDisabled
        ? "opacity-70 cursor-not-allowed"
        : "hover:scale-105 active:scale-95"
    }`,
    secondary: `w-full bg-surface border border-default text-primary px-4 py-3 ${
      isDisabled
        ? "opacity-70 cursor-not-allowed"
        : "hover:border-accent hover:text-accent"
    }`,
    ghost: `bg-transparent text-accent px-3 py-2 ${
      isDisabled ? "opacity-70 cursor-not-allowed" : "hover:underline"
    }`,
  };

  const variantClass = variants[variant] ?? variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      aria-label={ariaLabel}
      className={`${base} ${variantClass} ${className}`}
      {...props}
    >
      {loading ? (
        // when children (text) present, keep visible text and make spinner srOnly to avoid double announce
        <span className="flex items-center justify-center gap-3">
          <LoadingSpinner
            label={typeof children === "string" ? children : "Carregando"}
            srOnly={true}
            size={20}
            iconClassName="text-on-brand"
          />
          {children && <span className="font-semibold">{children}</span>}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
