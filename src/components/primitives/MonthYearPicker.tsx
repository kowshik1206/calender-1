import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

interface MonthYearPickerProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({ currentDate, onDateChange }) => {
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

  const selectedMonth = currentDate.getMonth();
  const selectedYear = currentDate.getFullYear();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monthRef.current && !monthRef.current.contains(event.target as Node)) {
        setIsMonthOpen(false);
      }
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setIsYearOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIndex);
    onDateChange(newDate);
    setIsMonthOpen(false);
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    onDateChange(newDate);
    setIsYearOpen(false);
  };

  return (
    <div className="flex gap-2">
      {/* Month Picker */}
      <div ref={monthRef} className="relative">
        <button
          onClick={() => {
            setIsMonthOpen(!isMonthOpen);
            setIsYearOpen(false);
          }}
          className={clsx(
            'px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200',
            'bg-white dark:bg-neutral-800 border-2 shadow-md hover:shadow-lg',
            'focus-ring hover:scale-105 active:scale-95',
            isMonthOpen
              ? 'border-primary-500 dark:border-primary-400 text-primary-700 dark:text-primary-300 ring-2 ring-primary-100 dark:ring-primary-900'
              : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:border-primary-300 dark:hover:border-primary-600'
          )}
        >
          <span className="flex items-center gap-2">
            {MONTHS[selectedMonth]}
            <svg
              className={clsx(
                'w-4 h-4 transition-transform duration-200',
                isMonthOpen && 'rotate-180'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>

        {isMonthOpen && (
          <div className="absolute z-50 mt-2 w-56 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden animate-slideUp">
            <div className="p-2 max-h-80 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-3 gap-1">
                {MONTHS.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => handleMonthSelect(index)}
                    className={clsx(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                      'hover:scale-105 active:scale-95',
                      index === selectedMonth
                        ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    )}
                  >
                    {month.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Year Picker */}
      <div ref={yearRef} className="relative">
        <button
          onClick={() => {
            setIsYearOpen(!isYearOpen);
            setIsMonthOpen(false);
          }}
          className={clsx(
            'px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200',
            'bg-white dark:bg-neutral-800 border-2 shadow-md hover:shadow-lg',
            'focus-ring hover:scale-105 active:scale-95',
            isYearOpen
              ? 'border-primary-500 dark:border-primary-400 text-primary-700 dark:text-primary-300 ring-2 ring-primary-100 dark:ring-primary-900'
              : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:border-primary-300 dark:hover:border-primary-600'
          )}
        >
          <span className="flex items-center gap-2">
            {selectedYear}
            <svg
              className={clsx(
                'w-4 h-4 transition-transform duration-200',
                isYearOpen && 'rotate-180'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>

        {isYearOpen && (
          <div className="absolute z-50 mt-2 w-32 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden animate-slideUp">
            <div className="p-2 max-h-80 overflow-y-auto custom-scrollbar">
              <div className="space-y-1">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    className={clsx(
                      'w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                      'hover:scale-105 active:scale-95',
                      year === selectedYear
                        ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthYearPicker;
