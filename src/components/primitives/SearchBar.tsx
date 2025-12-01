import React, { useState } from 'react';
import clsx from 'clsx';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search events...',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <div
        className={clsx(
          'flex items-center gap-3 px-4 py-3 bg-white rounded-xl border-2 transition-all duration-200 shadow-sm',
          isFocused
            ? 'border-primary-500 shadow-lg ring-2 ring-primary-100'
            : 'border-neutral-200 hover:border-neutral-300 hover:shadow-md'
        )}
      >
        <svg
          className={clsx(
            'w-5 h-5 transition-colors duration-200',
            isFocused ? 'text-primary-600' : 'text-neutral-400'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 outline-none bg-transparent text-neutral-900 placeholder-neutral-400 font-medium"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg p-1 transition-all duration-200"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
