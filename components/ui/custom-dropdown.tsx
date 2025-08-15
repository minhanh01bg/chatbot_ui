"use client"

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Search } from "lucide-react";

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "compact" | "large";
}

export const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select option",
  className = "",
  disabled = false,
  variant = "default"
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getVariantClasses = () => {
    switch (variant) {
      case "compact":
        return "px-3 py-2 text-xs";
      case "large":
        return "px-6 py-4 text-base";
      default:
        return "px-4 py-3 text-sm";
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full ${getVariantClasses()} bg-white/10 backdrop-blur-xl border border-white/20 
          rounded-xl text-white placeholder-gray-400
          focus:ring-2 focus:ring-purple-500 focus:border-transparent 
          transition-all duration-300 outline-none
          flex items-center justify-between
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-white/20'}
          ${isOpen ? 'ring-2 ring-purple-500 border-purple-500 shadow-lg shadow-purple-500/25' : ''}
          group
        `}
      >
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          {selectedOption?.icon && (
            <span className="text-purple-400 flex-shrink-0">{selectedOption.icon}</span>
          )}
          <span className={`truncate ${selectedOption ? 'text-white' : 'text-gray-400'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 ml-2"
        >
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl shadow-black/20 overflow-hidden">
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {options.map((option, index) => (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full ${getVariantClasses()} text-left transition-all duration-200
                      flex items-center justify-between group dropdown-option dropdown-option-hover
                      hover:bg-white/20 hover:text-white
                      ${value === option.value 
                        ? 'bg-purple-600/20 text-purple-300 border-l-4 border-purple-500' 
                        : 'text-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      {option.icon && (
                        <span className="text-purple-400 flex-shrink-0">{option.icon}</span>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate">{option.label}</div>
                        {option.description && (
                          <div className="text-xs text-gray-500 truncate">{option.description}</div>
                        )}
                      </div>
                    </div>
                    
                    {value === option.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="flex-shrink-0 ml-2"
                      >
                        <Check className="w-4 h-4 text-purple-400" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

 