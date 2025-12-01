import type { Meta, StoryObj } from '@storybook/react';
import EventStats from '../components/Calendar/EventStats';
import { sampleEvents } from '../utils/sampleEvents';

const meta = {
  title: 'Calendar/EventStats',
  component: EventStats,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EventStats>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    events: sampleEvents,
    currentDate: new Date(2024, 0, 15),
  },
};

export const NoEvents: Story = {
  args: {
    events: [],
    currentDate: new Date(),
  },
};

export const ManyEvents: Story = {
  args: {
    events: [
      ...sampleEvents,
      ...sampleEvents.map(event => ({
        ...event,
        id: `${event.id}-duplicate`,
        startDate: new Date(event.startDate.getTime() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(event.endDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      })),
    ],
    currentDate: new Date(),
  },
};
