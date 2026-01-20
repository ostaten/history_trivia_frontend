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
import GuideModal from '../helpers/GuideModal';
import questionMark from '../assets/questionMark.svg';

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
  const [showGuide, setShowGuide] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Trigger score animation when score changes
  useEffect(() => {
    setScoreKey((prev) => prev + 1);
  }, [score]);

  useEffect(() => {
    setLoading(true);
    setError(null);

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
            setLoading(false);
          } else {
            throw new Error('No events found for this date');
          }
        });
      })
      .catch((e: Error | unknown) => {
        console.error('Error loading chronokwiz:', e);
        const errorMessage =
          e instanceof Error
            ? e.message
            : 'Failed to load chronokwiz. Please try again.';
        setError(errorMessage);
        setLoading(false);
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
        <div className="grow basis-0 self-center font-semibold text-right flex items-center justify-end gap-2">
          <button
            onClick={() => setShowGuide(true)}
            className="cursor-pointer hover:opacity-70 transition-opacity"
            aria-label="How to play"
          >
            <img src={questionMark} className="w-6 h-6" alt="Help" />
          </button>
          <span>
            Score:{' '}
            <span key={scoreKey} className="score-value score-updated">
              {isCompleted ? (completedScore ?? 0) : score}
            </span>
          </span>
        </div>
      </div>
      <GuideModal show={showGuide} onClose={() => setShowGuide(false)} />
      <div className="flex justify-center text-center px-2 sm:px-4">
        {error ? (
          <div className="w-full max-w-2xl p-6 bg-red-500/20 border border-red-500/50 rounded-lg">
            <h2 className="text-xl font-semibold text-red-400 mb-2">
              Error Loading Chronokwiz
            </h2>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-off-dark font-semibold rounded-lg hover:bg-primary-bright transition-all duration-200 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : isCompleted && ordered ? (
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
        ) : loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <span>Loading...</span>
          </div>
        ) : null}
      </div>
    </>
  );
}
