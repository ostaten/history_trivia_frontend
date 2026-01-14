import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import {
  getChronokwizByDate,
  getChronokwizDates,
  markChronokwizSeen
} from '../api';
import TwoContainerSystem from '../helpers/TwoContainerSystem';
import CompletedChronokwizView from '../helpers/CompletedChronokwizView';
import { processKwizPayload } from '../utility/utility';
import type { LandmarkDataStructure } from '../api/generated/models';

export const Route = createFileRoute('/chronokwiz-by-date/$date')({
  component: ChronokwizByDate
});

function ChronokwizByDate() {
  const { date } = Route.useParams();
  const [score, setScore] = useState(0);
  const [ordered, setOrdered] = useState<LandmarkDataStructure[]>();
  const [randomized, setRandomized] = useState<LandmarkDataStructure[]>();
  const [scoreKey, setScoreKey] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedScore, setCompletedScore] = useState<number | undefined>();
  const [chronokwizId, setChronokwizId] = useState<number | undefined>();

  // Trigger score animation when score changes
  useEffect(() => {
    setScoreKey((prev) => prev + 1);
  }, [score]);

  useEffect(() => {
    // First, fetch the chronokwiz to get the ID and events
    getChronokwizByDate(date)
      .then((chronokwiz) => {
        // Store chronokwiz ID for marking as seen
        if (chronokwiz.id) {
          setChronokwizId(chronokwiz.id);
        }

        // Now check if this chronokwiz has been completed by checking dates
        return getChronokwizDates().then((datesResponse) => {
          // Check if this chronokwiz ID is in the list and if it's been seen
          // Try to find by ID first (if the API includes it), otherwise fall back to date
          let dateData = null;
          if (chronokwiz.id) {
            dateData = datesResponse.dates?.find(
              (d) => (d as any).chronokwizId === chronokwiz.id
            );
          }

          // If not found by ID, try by date as fallback
          if (!dateData) {
            dateData = datesResponse.dates?.find((d) => d.date === date);
          }

          const wasCompleted =
            dateData?.isSeen && dateData?.score !== undefined;

          if (wasCompleted && dateData) {
            // Already completed - set completed state
            setIsCompleted(true);
            setCompletedScore(dateData.score);
          }

          // Process the quiz data
          if (chronokwiz.events && chronokwiz.events.length > 0) {
            const { ordered, randomized } = processKwizPayload({
              events: chronokwiz.events,
              category: chronokwiz.category || 'American',
              date: chronokwiz.date || date,
              userId: '' // Not needed for processing
            });

            if (!wasCompleted) {
              // Only set up interactive mode if not completed
              if (randomized[0]) {
                randomized[0].isConfirmed = true;
              }
              setRandomized(randomized);
            }

            setOrdered(ordered);
          }
        });
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }, [date]);

  const handleComplete = async (finalScore: number) => {
    if (chronokwizId) {
      try {
        await markChronokwizSeen(chronokwizId, finalScore);
        setIsCompleted(true);
        setCompletedScore(finalScore);
        setScore(finalScore);
      } catch (e: Error | unknown) {
        console.error('Error marking chronokwiz as seen:', e);
      }
    }
  };

  // Format date for display
  // Parse YYYY-MM-DD format and create date in local timezone to avoid timezone shift
  const [year, month, day] = date.split('-').map(Number);
  const displayDate = new Date(year, month - 1, day).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  );

  return (
    <>
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="grow basis-0"></div>
        <h1 className="justify-center">{displayDate}</h1>
        <div className="grow basis-0 self-center font-semibold text-right">
          Score:{' '}
          <span key={scoreKey} className="score-value score-updated">
            {isCompleted ? (completedScore ?? 0) : score}
          </span>
        </div>
      </div>
      <div className="flex justify-center text-center px-2 sm:px-4">
        {isCompleted && ordered ? (
          <CompletedChronokwizView orderedLandmarks={ordered} />
        ) : randomized ? (
          <TwoContainerSystem
            unplacedLandmarks={randomized.slice(2)}
            placedLandmarks={[randomized[0]]}
            onDeckLandmark={randomized[1]}
            score={score}
            setScore={setScore}
            onComplete={handleComplete}
          />
        ) : (
          <div className="loading">
            <div className="loading-spinner"></div>
            <span>Loading...</span>
          </div>
        )}
      </div>
    </>
  );
}
