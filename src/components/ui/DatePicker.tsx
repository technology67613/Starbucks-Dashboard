import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown, ArrowRight } from 'lucide-react';
import { cn, formatDatePretty } from '../../lib/utils';

export type DateRange = { start: string; end: string } | null;

interface DatePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  availableDates?: string[];
  label?: string;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  availableDates = [],
  label,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customView, setCustomView] = useState(false);
  const [customStart, setCustomStart] = useState(value?.start || '');
  const [customEnd, setCustomEnd] = useState(value?.end || '');

  const displayDate = value
    ? value.start === value.end
      ? formatDatePretty(value.start, true)
      : `${formatDatePretty(value.start, true)} - ${formatDatePretty(value.end, true)}`
    : 'All Dates';

  const defaultDates = ['2026-09-16', '2026-09-15', '2026-09-14', '2026-09-13', '2026-09-12', '2026-09-11', '2026-09-10', '2026-09-09'];
  const dates = availableDates.length > 0 ? availableDates : defaultDates;

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      if (customStart > customEnd) {
        onChange({ start: customEnd, end: customStart });
      } else {
        onChange({ start: customStart, end: customEnd });
      }
      setIsOpen(false);
      setCustomView(false);
    }
  };

  return (
    <div className={cn('relative inline-block text-left', className)}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setCustomView(false);
        }}
        className="inline-flex items-center justify-between gap-2 px-3.5 py-2 glass-card rounded-btn text-xs sm:text-sm font-medium text-customText hover:glass-card-hover transition-all focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon size={15} className="text-customText-secondary shrink-0" />
          <span>{label ? `${label}: ` : ''}{displayDate}</span>
        </div>
        <ChevronDown size={14} className="text-customText-secondary shrink-0" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1.5 w-64 rounded-card glass-modal z-30 py-2 animate-in fade-in zoom-in-95 duration-150">
            {!customView ? (
              <div className="max-h-72 overflow-y-auto">
                <button
                  onClick={() => {
                    onChange(null);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full text-left px-4 py-2 text-xs sm:text-sm hover:bg-primary-tint/50 transition-colors',
                    !value && 'font-bold text-primary bg-primary-tint/30'
                  )}
                >
                  All Dates (Full Range)
                </button>
                <button
                  onClick={() => setCustomView(true)}
                  className="w-full text-left px-4 py-2 text-xs sm:text-sm hover:bg-primary-tint/50 transition-colors font-semibold text-primary"
                >
                  Custom Range...
                </button>
                <div className="h-px bg-black/5 my-1" />
                {dates.map(d => {
                  const isSelected = value?.start === d && value?.end === d;
                  return (
                    <button
                      key={d}
                      onClick={() => {
                        onChange({ start: d, end: d });
                        setIsOpen(false);
                      }}
                      className={cn(
                        'w-full text-left px-4 py-1.5 text-xs sm:text-sm hover:bg-primary-tint/50 transition-colors flex items-center justify-between',
                        isSelected && 'font-bold text-primary bg-primary-tint/30'
                      )}
                    >
                      <span>{formatDatePretty(d, true)}</span>
                      {d === '2026-09-16' && (
                        <span className="text-[10px] bg-primary-tint text-primary px-1.5 py-0.5 rounded-full font-semibold">
                          Today
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-2 flex flex-col gap-3">
                <h3 className="text-xs font-bold text-customText-secondary uppercase tracking-wider mb-1">Select Range</h3>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-customText-secondary">Start Date</label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-black/10 rounded glass-pill focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-customText-secondary">End Date</label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-black/10 rounded glass-pill focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => setCustomView(false)}
                    className="flex-1 py-1.5 text-xs font-medium text-customText-secondary hover:bg-black/5 rounded transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCustomApply}
                    disabled={!customStart || !customEnd}
                    className="flex-1 py-1.5 text-xs font-medium bg-primary text-white rounded hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    Apply Range
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

