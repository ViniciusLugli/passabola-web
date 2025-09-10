"use client";

import React from "react";

export default function Input({
  label,
  type,
  placeholder,
  name,
  value,
  onChange,
  className = "",
}) {
  const inputId = name || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 text-base font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-full 
          p-4 sm:p-5 
          rounded-xl 
          border-2 
          border-gray-200 
          focus:outline-none 
          focus:ring-2 
          focus:ring-purple-500 
          text-lg sm:text-xl 
          text-gray-800 
          transition-colors duration-200
          ${className}
        `}
      />
    </div>
  );
}
