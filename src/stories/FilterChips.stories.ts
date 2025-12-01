import type { Meta, StoryObj } from '@storybook/react';
import FilterChips from '../components/Calendar/FilterChips';
import type { FilterOption } from '../hooks/useEventFilter';

const meta = {
  title: 'Calendar/FilterChips',
  component: FilterChips,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FilterChips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    activeFilter: 'all',
    onFilterChange: (filter: FilterOption) => console.log('Filter changed:', filter),
  },
};

export const WithEventCounts: Story = {
  args: {
    activeFilter: 'all',
    onFilterChange: (filter: FilterOption) => console.log('Filter changed:', filter),
    eventCounts: {
      all: 42,
      work: 15,
      meeting: 10,
      personal: 8,
      reminder: 6,
      other: 3,
    },
  },
};

export const WorkFilterActive: Story = {
  args: {
    activeFilter: 'work',
    onFilterChange: (filter: FilterOption) => console.log('Filter changed:', filter),
    eventCounts: {
      all: 42,
      work: 15,
      meeting: 10,
      personal: 8,
      reminder: 6,
      other: 3,
    },
  },
};

export const MeetingFilterActive: Story = {
  args: {
    activeFilter: 'meeting',
    onFilterChange: (filter: FilterOption) => console.log('Filter changed:', filter),
    eventCounts: {
      all: 42,
      work: 15,
      meeting: 10,
      personal: 8,
      reminder: 6,
      other: 3,
    },
  },
};
