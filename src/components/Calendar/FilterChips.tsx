import React from 'react';
import clsx from 'clsx';
import type { EventCategory } from '../Calendar/CalendarView.types';
import type { FilterOption } from '../../hooks/useEventFilter';

interface FilterChipsProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  eventCounts?: Record<EventCategory | 'all', number>;
}

const FILTERS: { value: FilterOption; label: string; color: string }[] = [
  { value: 'all', label: 'All Events', color: 'bg-gradient-to-r from-neutral-600 to-neutral-700' },
  { value: 'work', label: 'Work', color: 'bg-gradient-to-r from-blue-600 to-blue-700' },
  { value: 'meeting', label: 'Meetings', color: 'bg-gradient-to-r from-purple-600 to-purple-700' },
  { value: 'personal', label: 'Personal', color: 'bg-gradient-to-r from-green-600 to-green-700' },
  { value: 'reminder', label: 'Reminders', color: 'bg-gradient-to-r from-orange-600 to-orange-700' },
  { value: 'other', label: 'Other', color: 'bg-gradient-to-r from-pink-600 to-pink-700' },
];

const FilterChips: React.FC<FilterChipsProps> = ({
  activeFilter,
  onFilterChange,
  eventCounts,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const count = eventCounts?.[filter.value] ?? 0;
        const isActive = activeFilter === filter.value;

        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={clsx(
              'px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 focus-ring',
              isActive
                ? `${filter.color} text-white shadow-lg scale-105 ring-2 ring-offset-2 ring-current/30`
                : 'bg-white text-neutral-700 hover:bg-neutral-50 border-2 border-neutral-200 hover:border-neutral-300 shadow-sm hover:shadow-md'
            )}
          >
            <span className="flex items-center gap-2">
              {filter.label}
              {eventCounts && (
                <span
                  className={clsx(
                    'px-2 py-0.5 rounded-full text-xs font-bold',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-neutral-100 text-neutral-600'
                  )}
                >
                  {count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterChips;
