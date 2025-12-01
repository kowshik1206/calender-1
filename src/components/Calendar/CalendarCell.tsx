import React, { useState, useCallback, useRef } from 'react';
import clsx from 'clsx';
import type { CalendarDay, CalendarEvent } from './CalendarView.types';

interface CalendarCellProps {
  day: CalendarDay;
  onCellClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent, e?: React.MouseEvent) => void;
  maxVisibleEvents?: number;
}

const CalendarCell = React.memo<CalendarCellProps>(({
  day,
  onCellClick,
  onEventClick,
  maxVisibleEvents = 3,
}) => {
  const [showAll, setShowAll] = useState(false);
  const cellRef = useRef<HTMLDivElement>(null);

  const visibleEvents = showAll ? day.events : day.events.slice(0, maxVisibleEvents);
  const remainingCount = day.events.length - maxVisibleEvents;

  const handleCellClick = useCallback(() => {
    onCellClick(day.date);
  }, [day.date, onCellClick]);

  const handleEventClick = useCallback(
    (e: React.MouseEvent, event: CalendarEvent) => {
      e.stopPropagation();
      onEventClick(event, e);
    },
    [onEventClick]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCellClick();
      }
    },
    [handleCellClick]
  );

  return (
    <div
      ref={cellRef}
      role="button"
      tabIndex={0}
      aria-label={`${day.date.toLocaleDateString()}, ${day.events.length} events`}
      className={clsx(
        'min-h-[120px] border border-neutral-200/50 p-3 cursor-pointer transition-all duration-300',
        'hover:bg-gradient-to-br hover:from-primary-50 hover:to-purple-50 hover:shadow-lg hover:scale-[1.02] focus-ring',
        day.isCurrentMonth ? 'bg-white' : 'bg-neutral-50/50',
        day.isToday && 'ring-2 ring-primary-500 ring-inset bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md'
      )}
      onClick={handleCellClick}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className={clsx(
            'text-sm font-semibold transition-all duration-200',
            day.isCurrentMonth ? 'text-neutral-900' : 'text-neutral-400',
            day.isToday && 'bg-gradient-to-br from-primary-600 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg ring-2 ring-white ring-offset-2 ring-offset-primary-100 animate-pulse'
          )}
        >
          {day.date.getDate()}
        </span>
      </div>

      <div className="space-y-1">
        {visibleEvents.map((event) => (
          <button
            key={event.id}
            onClick={(e) => handleEventClick(e, event)}
            className={clsx(
              'w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold truncate shadow-sm',
              'hover:opacity-90 hover:shadow-md hover:scale-105 focus-ring transition-all duration-200'
            )}
            style={{ backgroundColor: event.color, color: '#fff' }}
            aria-label={`Event: ${event.title}`}
          >
            {event.title}
          </button>
        ))}

        {remainingCount > 0 && !showAll && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAll(true);
            }}
            className="text-xs text-primary-600 hover:text-primary-700 font-bold focus-ring bg-primary-50 hover:bg-primary-100 px-2 py-1 rounded-md transition-all duration-200 hover:shadow-sm"
          >
            +{remainingCount} more
          </button>
        )}
      </div>
    </div>
  );
});

CalendarCell.displayName = 'CalendarCell';

export default CalendarCell;
