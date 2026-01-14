import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { getChronokwizDates } from '../api';
import type { DateWithSeenStatus } from '../api/generated/models';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const Route = createFileRoute('/chronokwiz-history')({
  component: ChronokwizHistory
});

function ChronokwizHistory() {
  const [value] = useState<Value>(new Date());
  const [datesData, setDatesData] = useState<DateWithSeenStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getChronokwizDates()
      .then((response) => {
        if (response.dates) {
          setDatesData(response.dates);
        }
        setLoading(false);
      })
      .catch((e: Error) => {
        console.error('Error fetching chronokwiz dates:', e);
        setLoading(false);
      });
  }, []);

  // Helper function to normalize date strings to YYYY-MM-DD format
  const normalizeDate = (date: Date | string): string => {
    if (typeof date === 'string') {
      // If it's already a string, try to parse and normalize it
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    }
    // Convert Date to YYYY-MM-DD format (local time, not UTC)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to check if a date is in the future
  const isFutureDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate > today;
  };

  // Create a map of dates to their status for quick lookup
  const dateStatusMap = new Map<string, DateWithSeenStatus>();
  datesData.forEach((item) => {
    if (item.date) {
      // Normalize the date string from API
      const normalizedDate = normalizeDate(item.date);
      dateStatusMap.set(normalizedDate, item);
    }
  });

  // Custom tile content function
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;

    const dateStr = normalizeDate(date);
    const status = dateStatusMap.get(dateStr);

    if (!status) {
      // No chronokwiz for this day - no indicator, just faded styling
      return null;
    }

    if (status.isSeen) {
      // Chronokwiz completed - green checked (hide date number, show large checkmark)
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    }

    // Chronokwiz available but not taken - normal display (no indicator needed)
    return null;
  };

  // Custom tile className function
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return '';

    // Disable future dates
    if (isFutureDate(date)) {
      return 'opacity-30 cursor-not-allowed text-text-muted';
    }

    const dateStr = normalizeDate(date);
    const status = dateStatusMap.get(dateStr);

    if (!status) {
      // No chronokwiz - more faded and disabled
      return 'opacity-30 cursor-not-allowed text-text-muted';
    }

    if (status.isSeen) {
      // Completed - green highlight, hide date number
      return 'bg-green-500/20 hover:bg-green-500/30 cursor-pointer chronokwiz-completed';
    }

    // Available but not taken - normal clickable
    return 'hover:bg-primary/20 cursor-pointer';
  };

  const handleDateChange = (newValue: Value) => {
    if (!newValue || Array.isArray(newValue)) return;

    // Don't allow navigation to future dates
    if (isFutureDate(newValue)) {
      return;
    }

    const dateStr = normalizeDate(newValue);
    const status = dateStatusMap.get(dateStr);

    // Only navigate if the date has a chronokwiz and is not already seen
    if (status && !status.isSeen) {
      navigate({
        to: '/chronokwiz-by-date/$date',
        params: { date: dateStr }
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading">
          <div className="loading-spinner"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="grow basis-0"></div>
        <h1 className="justify-center">Chronokwiz History</h1>
        <div className="grow basis-0"></div>
      </div>
      <div className="flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-10 py-4">
        <div className="w-full max-w-4xl">
          <Calendar
            onChange={handleDateChange}
            value={value}
            tileContent={tileContent}
            tileClassName={tileClassName}
            className="w-full"
          />
        </div>
      </div>
    </>
  );
}
