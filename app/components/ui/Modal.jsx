"use client";

import { memo } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-[rgba(15,23,42,0.35)] dark:bg-[rgba(10,13,20,0.65)] z-50 flex justify-center items-center"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-surface p-8 rounded-2xl shadow-elevated max-w-sm w-full relative border border-default"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-800 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Fechar modal"
        >
          <X className="w-6 h-6" strokeWidth={2} />
        </button>
        {title && (
          <h2 className="text-2xl font-bold text-primary mb-4">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
};

export default memo(Modal);
