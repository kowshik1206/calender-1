import React, { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import clsx from 'clsx';
import { useCalendar } from '../../hooks/useCalendar';
import { useEventManager } from '../../hooks/useEventManager';
import { useEventFilter } from '../../hooks/useEventFilter';
import { useEventDrag } from '../../hooks/useEventDrag';
import MonthView from './MonthView';
import WeekView from './WeekView';
import EventStats from './EventStats';
import FilterChips from './FilterChips';
import Button from '../primitives/Button';
import SearchBar from '../primitives/SearchBar';
import MonthYearPicker from '../primitives/MonthYearPicker';
import ThemeToggle from '../primitives/ThemeToggle';
import type { CalendarEvent, EventFormData, ViewType, EventCategory } from './CalendarView.types';
import { getMonthName, getYear } from '../../utils/date.utils';
import { createDateAtTime } from '../../utils/date.utils';

// Lazy load EventModal for better performance
const EventModal = lazy(() => import('./EventModal'));

export interface CalendarViewProps {
  initialDate?: Date;
  initialEvents?: CalendarEvent[];
  className?: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  initialDate,
  initialEvents = [],
  className,
}) => {
  const {
    currentDate,
    viewType,
    navigatePrevious,
    navigateNext,
    navigateToday,
    switchView,
    setDate,
    getDays,
  } = useCalendar(initialDate);

  const { events, addEvent, updateEvent, deleteEvent, setEvents } = useEventManager();
  const { searchQuery, setSearchQuery, activeFilter, setActiveFilter, filterEvents } = useEventFilter();
  const { dragState, startDrag, endDrag, getDraggedEvent } = useEventDrag();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Initialize events
  React.useEffect(() => {
    if (initialEvents.length > 0) {
      setEvents(initialEvents);
    }
  }, [initialEvents, setEvents]);

  // Filter events based on search and filters
  const filteredEvents = useMemo(() => filterEvents(events), [events, filterEvents]);

  // Calculate event counts by category
  const eventCounts = useMemo(() => {
    const counts: Record<EventCategory | 'all', number> = {
      all: events.length,
      work: 0,
      meeting: 0,
      personal: 0,
      reminder: 0,
      other: 0,
    };
    events.forEach((event) => {
      counts[event.category] = (counts[event.category] || 0) + 1;
    });
    return counts;
  }, [events]);

  const days = useMemo(() => getDays(filteredEvents), [getDays, filteredEvents]);

  const handleDateClick = useCallback((date: Date) => {
    const draggedEvent = getDraggedEvent();
    if (draggedEvent && dragState.isDragging) {
      // Drop event on new date
      const duration = new Date(draggedEvent.endDate).getTime() - new Date(draggedEvent.startDate).getTime();
      const newStartDate = new Date(date);
      newStartDate.setHours(new Date(draggedEvent.startDate).getHours());
      newStartDate.setMinutes(new Date(draggedEvent.startDate).getMinutes());
      const newEndDate = new Date(newStartDate.getTime() + duration);
      
      updateEvent(draggedEvent.id, {
        ...draggedEvent,
        startDate: newStartDate,
        endDate: newEndDate,
      });
      endDrag();
    } else {
      setSelectedDate(date);
      setSelectedEvent(null);
      setIsModalOpen(true);
    }
  }, [dragState, getDraggedEvent, updateEvent, endDrag]);

  const handleEventClick = useCallback((event: CalendarEvent, e?: React.MouseEvent) => {
    if (e?.shiftKey) {
      // Shift+click to start drag
      startDrag(event);
    } else {
      setSelectedEvent(event);
      setSelectedDate(undefined);
      setIsModalOpen(true);
    }
  }, [startDrag]);

  const handleTimeSlotClick = useCallback((date: Date, hour: number, minute: number) => {
    const slotDate = createDateAtTime(date, hour, minute);
    setSelectedDate(slotDate);
    setSelectedEvent(null);
    setIsModalOpen(true);
  }, []);

  const handleSaveEvent = useCallback(
    (formData: EventFormData) => {
      if (selectedEvent) {
        updateEvent(selectedEvent.id, formData);
      } else {
        addEvent(formData);
      }
      setIsModalOpen(false);
      setSelectedEvent(null);
      setSelectedDate(undefined);
    },
    [selectedEvent, addEvent, updateEvent]
  );

  const handleDeleteEvent = useCallback(() => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      setIsModalOpen(false);
      setSelectedEvent(null);
    }
  }, [selectedEvent, deleteEvent]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedDate(undefined);
  }, []);

  const handleMonthChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newDate = new Date(currentDate);
      newDate.setMonth(parseInt(e.target.value, 10));
      setDate(newDate);
    },
    [currentDate, setDate]
  );

  const handleYearChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newDate = new Date(currentDate);
      newDate.setFullYear(parseInt(e.target.value, 10));
      setDate(newDate);
    },
    [currentDate, setDate]
  );

  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        value: i.toString(),
        label: new Date(2000, i, 1).toLocaleString('default', { month: 'long' }),
      })),
    []
  );

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => ({
      value: (currentYear - 5 + i).toString(),
      label: (currentYear - 5 + i).toString(),
    }));
  }, []);

  const handleViewSwitch = useCallback(
    (view: ViewType) => {
      switchView(view);
    },
    [switchView]
  );

  return (
    <div className={clsx('calendar-view min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6', className)} role="application" aria-label="Calendar">
      {/* Event Statistics */}
      <div className="mb-6 animate-fadeIn">
        <EventStats events={filteredEvents} currentDate={currentDate} />
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search events by title or description..."
        />
        <FilterChips
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          eventCounts={eventCounts}
        />
      </div>

      {/* Header Controls */}
      <div className="mb-8 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-neutral-700/50 animate-slideUp">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            {getMonthName(currentDate)} {getYear(currentDate)}
          </h1>
          <Button onClick={navigateToday} variant="ghost" size="sm" className="hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-200">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
              </svg>
              Today
            </span>
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Enhanced Month/Year Picker */}
          <MonthYearPicker
            currentDate={currentDate}
            onDateChange={setDate}
          />
          
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Navigation Buttons */}
          <div className="flex gap-1">
            <Button
              onClick={navigatePrevious}
              variant="secondary"
              size="sm"
              aria-label={`Previous ${viewType}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <Button
              onClick={navigateNext}
              variant="secondary"
              size="sm"
              aria-label={`Next ${viewType}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>

          {/* View Toggle */}
          <div className="flex bg-gradient-to-r from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 rounded-xl p-1 shadow-inner border border-neutral-200/50 dark:border-neutral-700/50">
            <button
              onClick={() => handleViewSwitch('month')}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 focus-ring',
                viewType === 'month'
                  ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg scale-105'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-white/50 dark:hover:bg-neutral-700/50'
              )}
              aria-pressed={viewType === 'month'}
            >
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1z" />
                </svg>
                Month
              </span>
            </button>
            <button
              onClick={() => handleViewSwitch('week')}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 focus-ring',
                viewType === 'week'
                  ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg scale-105'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-white/50 dark:hover:bg-neutral-700/50'
              )}
              aria-pressed={viewType === 'week'}
            >
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm8 7a1 1 0 100-2H6a1 1 0 000 2h8zm0 4a1 1 0 100-2H6a1 1 0 000 2h8z" clipRule="evenodd" />
                </svg>
                Week
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Drag Indicator */}
      {dragState.isDragging && (
        <div className="mb-4 p-4 bg-primary-50 border-2 border-primary-300 border-dashed rounded-xl text-primary-700 font-medium text-center animate-pulse">
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
            Moving "{dragState.draggedEvent?.title}" - Click a date to drop
          </span>
        </div>
      )}

      {/* No Results Message */}
      {filteredEvents.length === 0 && (searchQuery || activeFilter !== 'all') && (
        <div className="mb-6 p-8 bg-white rounded-2xl shadow-lg border border-neutral-200 text-center animate-fadeIn">
          <svg className="w-16 h-16 mx-auto mb-4 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl font-semibold text-neutral-600 mb-2">No events found</p>
          <p className="text-neutral-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Calendar View */}
      {viewType === 'month' ? (
        <MonthView
          days={days}
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
        />
      ) : (
        <WeekView
          days={days}
          onEventClick={handleEventClick}
          onTimeSlotClick={handleTimeSlotClick}
        />
      )}

      {/* Event Modal */}
      <Suspense fallback={null}>
        <EventModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
          onDelete={selectedEvent ? handleDeleteEvent : undefined}
          event={selectedEvent}
          initialDate={selectedDate}
        />
      </Suspense>
    </div>
  );
};

export default CalendarView;
