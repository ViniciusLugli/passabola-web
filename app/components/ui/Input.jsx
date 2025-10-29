"use client";

import React, { memo, useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = ({
  label,
  type,
  placeholder,
  name,
  value,
  onChange,
  className = "",
  ...props
}) => {
  const inputId = name;
  const [showPassword, setShowPassword] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (type === "textarea" && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, type]);

  const baseClasses = `
    w-full
    p-4 sm:p-5
    rounded-xl
    border
    border-default
    bg-surface
    text-lg sm:text-xl
    text-primary
    placeholder:text-tertiary
    transition-colors duration-200
    focus:outline-none
    focus:ring-2
    focus:ring-accent
    focus:border-accent
    ${className}
  `;

  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 text-base font-medium text-secondary"
        >
          {label}
        </label>
      )}
      {type === "textarea" ? (
        <textarea
          id={inputId}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          ref={textareaRef}
          className={`${baseClasses} resize-none overflow-hidden`}
          rows="1"
          {...props}
        />
      ) : (
        <div className="relative w-full">
          <input
            id={inputId}
            type={inputType}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`${baseClasses} ${isPasswordField ? "pr-14" : ""}`}
            {...props}
          />
          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-800
                dark:text-gray-300
                hover:text-gray-900
                dark:hover:text-white
                transition-colors
                duration-200
                focus:outline-none
              "
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff className="h-6 w-6" strokeWidth={2} />
              ) : (
                <Eye className="h-6 w-6" strokeWidth={2} />
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(Input);
