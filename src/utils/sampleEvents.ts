import type { CalendarEvent, EventCategory } from '../components/Calendar/CalendarView.types';
import { addDays, setHours, setMinutes } from 'date-fns';

const EVENT_COLORS = [
  '#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', 
  '#10b981', '#ef4444', '#6366f1', '#14b8a6'
];

const CATEGORIES: EventCategory[] = ['work', 'personal', 'meeting', 'reminder', 'other'];

const EVENT_TITLES = {
  work: [
    'Team Standup',
    'Code Review',
    'Sprint Planning',
    'Project Sync',
    'Documentation',
    'Bug Triage',
    'Architecture Discussion',
  ],
  meeting: [
    'Client Call',
    'Team Meeting',
    'One-on-One',
    'All Hands',
    'Quarterly Review',
    'Stakeholder Update',
  ],
  personal: [
    'Gym Session',
    'Lunch Break',
    'Doctor Appointment',
    'Grocery Shopping',
    'Reading Time',
    'Meditation',
  ],
  reminder: [
    'Submit Timesheet',
    'Pay Bills',
    'Call Mom',
    'Renew Subscription',
    'Book Appointment',
  ],
  other: [
    'Conference',
    'Workshop',
    'Webinar',
    'Training',
    'Networking Event',
  ],
};

/**
 * Generate sample events for testing
 */
export function generateSampleEvents(count: number = 10, baseDate: Date = new Date()): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  for (let i = 0; i < count; i++) {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const titles = EVENT_TITLES[category];
    const title = titles[Math.floor(Math.random() * titles.length)];
    
    const dayOffset = Math.floor(Math.random() * 30) - 15; // -15 to +15 days
    const hour = Math.floor(Math.random() * 12) + 8; // 8 AM to 8 PM
    const minute = Math.floor(Math.random() * 2) * 30; // 0 or 30
    const duration = (Math.floor(Math.random() * 4) + 1) * 30; // 30min to 2hrs

    const startDate = setMinutes(setHours(addDays(baseDate, dayOffset), hour), minute);
    const endDate = new Date(startDate.getTime() + duration * 60 * 1000);

    events.push({
      id: `event-${i}-${Date.now()}`,
      title,
      description: `This is a sample ${category} event`,
      startDate,
      endDate,
      color: EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)],
      category,
    });
  }

  return events;
}

/**
 * Generate events for current week
 */
export function generateWeekEvents(): CalendarEvent[] {
  const today = new Date();
  const events: CalendarEvent[] = [];

  // Morning standup (daily)
  for (let i = 0; i < 5; i++) {
    events.push({
      id: `standup-${i}`,
      title: 'Team Standup',
      description: 'Daily team sync',
      startDate: setMinutes(setHours(addDays(today, i), 9), 0),
      endDate: setMinutes(setHours(addDays(today, i), 9), 30),
      color: '#0ea5e9',
      category: 'meeting',
    });
  }

  // Lunch breaks
  for (let i = 0; i < 5; i++) {
    events.push({
      id: `lunch-${i}`,
      title: 'Lunch Break',
      description: 'Time to eat',
      startDate: setMinutes(setHours(addDays(today, i), 12), 0),
      endDate: setMinutes(setHours(addDays(today, i), 13), 0),
      color: '#10b981',
      category: 'personal',
    });
  }

  // Additional meetings
  events.push({
    id: 'client-call',
    title: 'Client Call',
    startDate: setMinutes(setHours(addDays(today, 1), 14), 0),
    endDate: setMinutes(setHours(addDays(today, 1), 15), 30),
    color: '#8b5cf6',
    category: 'meeting',
  });

  events.push({
    id: 'sprint-planning',
    title: 'Sprint Planning',
    startDate: setMinutes(setHours(addDays(today, 3), 10), 0),
    endDate: setMinutes(setHours(addDays(today, 3), 12), 0),
    color: '#ec4899',
    category: 'work',
  });

  return events;
}

/**
 * Generate events with overlaps for testing
 */
export function generateOverlappingEvents(): CalendarEvent[] {
  const today = new Date();

  return [
    {
      id: 'overlap-1',
      title: 'Morning Meeting',
      startDate: setMinutes(setHours(today, 9), 0),
      endDate: setMinutes(setHours(today, 10), 0),
      color: '#0ea5e9',
      category: 'meeting',
    },
    {
      id: 'overlap-2',
      title: 'Design Review',
      startDate: setMinutes(setHours(today, 9), 30),
      endDate: setMinutes(setHours(today, 11), 0),
      color: '#8b5cf6',
      category: 'work',
    },
    {
      id: 'overlap-3',
      title: 'Client Call',
      startDate: setMinutes(setHours(today, 10), 0),
      endDate: setMinutes(setHours(today, 11), 30),
      color: '#ec4899',
      category: 'meeting',
    },
    {
      id: 'overlap-4',
      title: 'Coffee Chat',
      startDate: setMinutes(setHours(today, 10), 30),
      endDate: setMinutes(setHours(today, 11), 0),
      color: '#f59e0b',
      category: 'personal',
    },
  ];
}

// Export a default set of sample events
export const sampleEvents = generateSampleEvents(10, new Date());
