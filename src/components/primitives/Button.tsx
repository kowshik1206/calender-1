import React from 'react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = React.memo<ButtonProps>(({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 active:from-primary-800 active:to-primary-900 shadow-primary-500/20',
    secondary: 'bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-900 hover:from-neutral-200 hover:to-neutral-300 active:from-neutral-300 active:to-neutral-400',
    ghost: 'bg-transparent text-neutral-700 hover:bg-gradient-to-r hover:from-neutral-100 hover:to-neutral-50 active:bg-neutral-200',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 active:from-red-800 active:to-red-900 shadow-red-500/20',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
