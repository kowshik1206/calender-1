import React, { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import Modal from '../primitives/Modal';
import Button from '../primitives/Button';
import Select from '../primitives/Select';
import type { CalendarEvent, EventFormData, EventCategory } from './CalendarView.types';
import { EVENT_COLORS, CATEGORY_OPTIONS } from './CalendarView.types';
import { validateEventForm } from '../../utils/event.utils';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: EventFormData) => void;
  onDelete?: () => void;
  event?: CalendarEvent | null;
  initialDate?: Date;
}

const EventModal = React.memo<EventModalProps>(({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  initialDate,
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startDate: initialDate || new Date(),
    endDate: initialDate || new Date(),
    color: EVENT_COLORS[0],
    category: 'other' as EventCategory,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (event) {
        setFormData({
          title: event.title,
          description: event.description || '',
          startDate: event.startDate,
          endDate: event.endDate,
          color: event.color,
          category: event.category,
        });
      } else if (initialDate) {
        const endDate = new Date(initialDate);
        endDate.setHours(initialDate.getHours() + 1);
        
        setFormData({
          title: '',
          description: '',
          startDate: initialDate,
          endDate,
          color: EVENT_COLORS[0],
          category: 'other',
        });
      }
      setErrors({});
    }
  }, [isOpen, event, initialDate]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      
      const validation = validateEventForm(formData);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      onSave(formData);
      onClose();
    },
    [formData, onSave, onClose]
  );

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  }, [onDelete, onClose]);

  const formatDateTimeLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? 'Edit Event' : 'New Event'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus-ring focus:border-primary-500 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            placeholder="Enter event title"
            autoFocus
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus-ring focus:border-primary-500 resize-none transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            rows={3}
            placeholder="Add a description (optional)"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-neutral-700 mb-1">
              Start Date & Time
            </label>
            <input
              id="startDate"
              type="datetime-local"
              value={formatDateTimeLocal(formData.startDate)}
              onChange={(e) =>
                setFormData({ ...formData, startDate: new Date(e.target.value) })
              }
              className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus-ring focus:border-primary-500 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-neutral-700 mb-1">
              End Date & Time
            </label>
            <input
              id="endDate"
              type="datetime-local"
              value={formatDateTimeLocal(formData.endDate)}
              onChange={(e) =>
                setFormData({ ...formData, endDate: new Date(e.target.value) })
              }
              className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus-ring focus:border-primary-500 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            />
            {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
          </div>
        </div>

        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as EventCategory })}
          options={CATEGORY_OPTIONS}
        />

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {EVENT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={clsx(
                  'w-10 h-10 rounded-full focus-ring transition-all duration-200 shadow-md hover:shadow-xl',
                  formData.color === color && 'ring-4 ring-offset-2 ring-neutral-400 scale-125 shadow-2xl'
                )}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          {event && onDelete && (
            <Button type="button" variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <div className="flex-1" />
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {event ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
});

EventModal.displayName = 'EventModal';

export default EventModal;
