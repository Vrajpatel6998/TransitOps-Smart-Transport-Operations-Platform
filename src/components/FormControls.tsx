/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// --- Input Component ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`w-full rounded border bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400/70 transition-all focus:border-teal-500 focus:ring-1 focus:ring-teal-100 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 ${
            icon ? 'pl-9' : ''
          } ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
              : 'border-slate-200 hover:border-slate-300'
          }`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs font-medium text-rose-600 animate-fade-in">{error}</span>
      )}
    </div>
  );
};

// --- Select Component ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full rounded border bg-white px-3 py-1.5 text-xs text-slate-800 transition-all focus:border-teal-500 focus:ring-1 focus:ring-teal-100 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 ${
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
            : 'border-slate-200 hover:border-slate-300'
        }`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-xs font-medium text-rose-600">{error}</span>
      )}
    </div>
  );
};

// --- DatePicker Component ---
interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </label>
      )}
      <input
        id={id}
        type="date"
        className={`w-full rounded border bg-white px-3 py-1.5 text-xs text-slate-800 transition-all focus:border-teal-500 focus:ring-1 focus:ring-teal-100 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 ${
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
            : 'border-slate-200 hover:border-slate-300'
        }`}
        {...props}
      />
      {error && (
        <span className="text-xs font-medium text-rose-600">{error}</span>
      )}
    </div>
  );
};
