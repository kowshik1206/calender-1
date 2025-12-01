import type { Meta, StoryObj } from '@storybook/react';
import MonthYearPicker from '../components/primitives/MonthYearPicker';

const meta = {
  title: 'Primitives/MonthYearPicker',
  component: MonthYearPicker,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MonthYearPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentDate: new Date(2025, 11, 1), // December 2025
    onDateChange: (date: Date) => console.log('Date changed:', date),
  },
};

export const January: Story = {
  args: {
    currentDate: new Date(2025, 0, 1), // January 2025
    onDateChange: (date: Date) => console.log('Date changed:', date),
  },
};

export const Summer: Story = {
  args: {
    currentDate: new Date(2025, 6, 15), // July 2025
    onDateChange: (date: Date) => console.log('Date changed:', date),
  },
};
