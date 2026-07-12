/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface CardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    isPositive?: boolean;
  };
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon,
  trend,
  className = '',
}) => {
  return (
    <div
      id={id}
      className={`bg-white rounded border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs hover:border-slate-300 flex flex-col justify-between transition-all duration-150 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl font-extrabold text-slate-950 mt-1 font-mono tracking-tight leading-none">{value}</h3>
        </div>
        {icon && (
          <div className="p-2 rounded bg-teal-50 text-teal-600 border border-teal-100/50 shrink-0">
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
          {subtitle && (
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">{subtitle}</span>
          )}
          {trend && (
            <span
              className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                trend.isPositive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/60'
                  : 'bg-rose-50 text-rose-700 border border-rose-100/60'
              }`}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;
