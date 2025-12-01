import { useState, useCallback } from 'react';
import type { CalendarEvent } from '../components/Calendar/CalendarView.types';

export type FilterOption = 'all' | 'work' | 'personal' | 'meeting' | 'reminder' | 'other';

export function useEventFilter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');

  const filterEvents = useCallback(
    (events: CalendarEvent[]): CalendarEvent[] => {
      let filtered = events;

      // Filter by category
      if (activeFilter !== 'all') {
        filtered = filtered.filter((event) => event.category === activeFilter);
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (event) =>
            event.title.toLowerCase().includes(query) ||
            event.description?.toLowerCase().includes(query)
        );
      }

      return filtered;
    },
    [searchQuery, activeFilter]
  );

  return {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    filterEvents,
  };
}
