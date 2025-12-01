import React, { useCallback, useRef } from 'react';
import CalendarCell from './CalendarCell';
import type { CalendarDay, CalendarEvent } from './CalendarView.types';

interface MonthViewProps {
  days: CalendarDay[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MonthView = React.memo<MonthViewProps>(({ days, onDateClick, onEventClick }) => {
  const gridRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let newIndex = index;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          newIndex = Math.max(0, index - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          newIndex = Math.min(days.length - 1, index + 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          newIndex = Math.max(0, index - 7);
          break;
        case 'ArrowDown':
          e.preventDefault();
          newIndex = Math.min(days.length - 1, index + 7);
          break;
        case 'Home':
          e.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          newIndex = days.length - 1;
          break;
        default:
          return;
      }
      
      // Focus the new cell
      const cells = gridRef.current?.querySelectorAll('[role="button"]');
      if (cells && cells[newIndex]) {
        (cells[newIndex] as HTMLElement).focus();
      }
    },
    [days.length]
  );

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-100 transition-all duration-300 hover:shadow-3xl">
      {/* Header with day names */}
      <div className="grid grid-cols-7 bg-gradient-to-r from-primary-50 via-purple-50 to-pink-50 border-b border-neutral-200/50">
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="py-4 text-center text-sm font-bold text-primary-900 tracking-wide"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        ref={gridRef}
        role="grid"
        aria-label="Calendar month view"
        className="grid grid-cols-7"
      >
        {days.map((day, index) => (
          <div
            key={day.date.toISOString()}
            role="gridcell"
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            <CalendarCell
              day={day}
              onCellClick={onDateClick}
              onEventClick={onEventClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

MonthView.displayName = 'MonthView';

export default MonthView;
