import type { Meta, StoryObj } from '@storybook/react';
import SearchBar from '../components/primitives/SearchBar';

const meta = {
  title: 'Primitives/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    onChange: (value: string) => console.log('Search:', value),
    placeholder: 'Search events...',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Team meeting',
    onChange: (value: string) => console.log('Search:', value),
    placeholder: 'Search events...',
  },
};

export const CustomPlaceholder: Story = {
  args: {
    value: '',
    onChange: (value: string) => console.log('Search:', value),
    placeholder: 'Find your next event...',
  },
};
