"use client";

import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
  className = "",
  ...props
}) {
  const baseStyle =
    "px-4 py-2 rounded-lg font-semibold transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--color-page))]";

  const variants = {
    primary:
      "bg-accent text-on-brand hover:bg-accent-strong focus:ring-accent shadow-elevated",
    secondary:
      "bg-surface-muted text-secondary border border-default hover:bg-surface-elevated focus:ring-accent",
    danger:
      "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 shadow-elevated",
  };

  const disabledStyle = "opacity-60 cursor-not-allowed";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${
        disabled ? disabledStyle : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
