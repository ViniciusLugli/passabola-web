"use client";

import { useState, memo, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const SelectInput = ({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
  placeholder = "Selecione uma opção",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  const defaultLabel = required ? `${placeholder} *` : placeholder;
  const selectedOption = options.find((opt) => opt.value === value) || {
    label: defaultLabel,
    value: "",
  };

  // Filtra opções baseado no termo de busca
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Foca no input de busca quando abre o dropdown
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (option) => {
    onChange({ target: { name: name, value: option.value } });
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setSearchTerm("");
    }
  };

  return (
    <div className="relative w-full">
      <label className="block text-md font-medium text-secondary mb-2">
        {label}
      </label>
      <div
        className="
          w-full 
          p-4 sm:p-5 
          rounded-xl 
          border-2 
          border-default 
          bg-surface
          text-lg sm:text-xl
          text-primary
          flex 
          justify-between 
          items-center 
          cursor-pointer
          transition-colors 
          duration-200
          hover:border-accent
        "
        onClick={handleToggle}
      >
        <span>{selectedOption.label}</span>
        <ChevronDown
          className={`
            w-5 h-5 
            text-gray-800
            dark:text-gray-300
            transition-transform 
            duration-200 
            ${isOpen ? "rotate-180" : "rotate-0"}
          `}
          strokeWidth={2}
        />
      </div>

      {isOpen && (
        <div
          className="
          absolute 
          top-full 
          left-0 
          mt-2 
          w-full 
          bg-surface 
          border 
          border-default 
          rounded-xl 
          shadow-lg 
          z-20
          max-h-60
          flex
          flex-col
        "
        >
          {/* Barra de busca */}
          <div className="p-3 border-b border-default sticky top-0 bg-surface rounded-t-xl">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Buscar..."
              className="
                w-full 
                p-2 sm:p-3
                text-base sm:text-lg
                border 
                border-default 
                rounded-lg 
                focus:outline-none 
                focus:border-accent
                focus:ring-2
                focus:ring-accent
                transition-colors
              "
            />
          </div>

          {/* Lista de opções filtradas */}
          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="
                    p-4 sm:p-5 
                    text-lg sm:text-xl 
                    text-primary
                    cursor-pointer 
                    hover:bg-surface-muted 
                    transition-colors 
                    duration-200
                  "
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="p-4 sm:p-5 text-lg sm:text-xl text-secondary text-center">
                Nenhum resultado encontrado
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(SelectInput);
