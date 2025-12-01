import React from 'react';
import clsx from 'clsx';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  label?: string;
  error?: string;
}

const Select = React.memo<SelectProps>(({ options, label, error, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
        </label>
      )}
      <select
        className={clsx(
          'w-full px-4 py-2.5 border-2 rounded-xl focus-ring transition-all duration-200 shadow-sm hover:shadow-md',
          error
            ? 'border-red-300 focus:border-red-500 bg-red-50'
            : 'border-neutral-200 focus:border-primary-500 hover:border-primary-300 bg-white',
          'text-neutral-900 font-medium',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
