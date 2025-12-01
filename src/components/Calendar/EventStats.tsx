import React, { useMemo } from 'react';
import type { CalendarEvent } from './CalendarView.types';
import { getEventDuration } from '../../utils/event.utils';

interface EventStatsProps {
  events: CalendarEvent[];
  currentDate?: Date;
}

const EventStats: React.FC<EventStatsProps> = ({ events }) => {
  const stats = useMemo(() => {
    const today = new Date();
    const todayEvents = events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.toDateString() === today.toDateString()
      );
    });

    const upcomingEvents = events.filter((event) => event.startDate > today);
    
    const totalDuration = events.reduce(
      (sum, event) => sum + getEventDuration(event),
      0
    );

    return {
      total: events.length,
      today: todayEvents.length,
      upcoming: upcomingEvents.length,
      totalHours: Math.round(totalDuration / 60),
    };
  }, [events]);

  const statCards = [
    {
      label: 'Total Events',
      value: stats.total,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Today',
      value: stats.today,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Upcoming',
      value: stats.upcoming,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Total Hours',
      value: stats.totalHours,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl p-4 shadow-lg border border-neutral-100 hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-md`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
              <p className="text-xs text-neutral-500 font-medium">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventStats;
