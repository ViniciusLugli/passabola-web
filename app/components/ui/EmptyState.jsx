"use client";

import React from "react";

/**
 * EmptyState - Componente reutilizável para exibir estados vazios
 *
 * @param {React.ReactNode} icon - Ícone do lucide-react ou qualquer elemento React
 * @param {string} title - Título do estado vazio
 * @param {string} description - Descrição do estado vazio
 * @param {React.ReactNode} action - Elemento de ação opcional (botão, link, etc)
 */
export default function EmptyState({ icon, title, description, action }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      role="status"
      aria-live="polite"
    >
      {/* Ícone */}
      {icon && (
        <div
          className="mb-4 text-tertiary"
          aria-hidden="true"
        >
          {React.cloneElement(icon, {
            className: "w-16 h-16 md:w-20 md:h-20",
            strokeWidth: 1.5,
          })}
        </div>
      )}

      {/* Título */}
      <h3 className="text-xl md:text-2xl font-semibold text-primary mb-2">
        {title}
      </h3>

      {/* Descrição */}
      {description && (
        <p className="text-sm md:text-base text-secondary max-w-md mb-6">
          {description}
        </p>
      )}

      {/* Ação opcional */}
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}
