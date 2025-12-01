import { useState, useCallback, useRef } from 'react';
import type { CalendarEvent } from '../components/Calendar/CalendarView.types';

interface DragState {
  isDragging: boolean;
  draggedEvent: CalendarEvent | null;
  dragStartTime: Date | null;
}

export function useEventDrag() {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedEvent: null,
    dragStartTime: null,
  });

  const dragEventRef = useRef<CalendarEvent | null>(null);

  const startDrag = useCallback((event: CalendarEvent) => {
    dragEventRef.current = event;
    setDragState({
      isDragging: true,
      draggedEvent: event,
      dragStartTime: event.startDate,
    });
  }, []);

  const endDrag = useCallback(() => {
    dragEventRef.current = null;
    setDragState({
      isDragging: false,
      draggedEvent: null,
      dragStartTime: null,
    });
  }, []);

  const getDraggedEvent = useCallback(() => dragEventRef.current, []);

  return {
    dragState,
    startDrag,
    endDrag,
    getDraggedEvent,
  };
}
