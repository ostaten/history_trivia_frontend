import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { createCustomChronokwiz, normalizePrompt } from '../api';
import TwoContainerSystem from '../helpers/TwoContainerSystem';
import {
  processKwizPayload,
  getAttemptCounter,
  incrementAttemptCounter
} from '../utility/utility';
import type { LandmarkDataStructure } from '../api/generated/models';
import GuideModal from '../helpers/GuideModal';
import questionMark from '../assets/questionMark.svg';

export const Route = createFileRoute('/kustom-kwiz/$topic')({
  component: KustomKwizTopic,
  validateSearch: (search: Record<string, unknown>) => ({
    error: (search.error as string) || undefined
  })
});

function KustomKwizTopic() {
  const { topic } = Route.useParams();
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [randomized, setRandomized] = useState<LandmarkDataStructure[]>();
  const [scoreKey, setScoreKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(
    'Generating your custom chronokwiz...'
  );
  const [displayTopic, setDisplayTopic] = useState<string>('');
  const [showGuide, setShowGuide] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Trigger score animation when score changes
  useEffect(() => {
    setScoreKey((prev) => prev + 1);
  }, [score]);

  useEffect(() => {
    const decodedTopic = decodeURIComponent(topic);

    // Update loading message periodically to show progress
    const messageInterval = setInterval(() => {
      setLoadingMessage((prev) => {
        if (prev.includes('...')) {
          return prev.replace('...', '');
        }
        return prev + '.';
      });
    }, 1000);

    // First normalize the prompt, then use it for the counter and API call
    normalizePrompt(decodedTopic)
      .then((normalizeResponse) => {
        const normalizedPrompt =
          normalizeResponse.normalizedPrompt || decodedTopic;

        // Get the current attempt counter for the normalized prompt
        const attemptNumber = getAttemptCounter(normalizedPrompt);

        // Now create the custom chronokwiz with the normalized prompt
        return createCustomChronokwiz(normalizedPrompt, attemptNumber).then(
          (response) => {
            clearInterval(messageInterval);
            // Set the display topic from the API response (corrected prompt)
            const finalPrompt = response.prompt || normalizedPrompt;
            setDisplayTopic(finalPrompt);

            // Increment the counter for the normalized prompt
            incrementAttemptCounter(normalizedPrompt);

            if (response.events && response.events.length > 0) {
              const { randomized } = processKwizPayload({
                events: response.events,
                category: 'Custom',
                date: new Date().toISOString(),
                userId: '' // Not needed for processing
              });

              if (randomized[0]) {
                randomized[0].isConfirmed = true;
              }

              setRandomized(randomized);
              setLoading(false);
            } else {
              throw new Error('No events generated for this topic');
            }
          }
        );
      })
      .catch((e: Error | unknown) => {
        clearInterval(messageInterval);
        console.error('Error creating custom chronokwiz:', e);
        const errorMessage =
          e instanceof Error
            ? e.message
            : 'Failed to generate quiz. Please try again.';
        setError(errorMessage);
        setLoading(false);
      });

    // Cleanup interval on unmount
    return () => {
      clearInterval(messageInterval);
    };
  }, [topic, navigate]);

  return (
    <>
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="grow basis-0"></div>
        <h1 className="justify-center">{displayTopic || ''}</h1>
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
              {score}
            </span>
          </span>
        </div>
      </div>
      <GuideModal show={showGuide} onClose={() => setShowGuide(false)} />
      <div className="flex justify-center text-center px-2 sm:px-4">
        {error ? (
          <div className="w-full max-w-2xl p-6 bg-red-500/20 border border-red-500/50 rounded-lg">
            <h2 className="text-xl font-semibold text-red-400 mb-2">
              Error Generating Quiz
            </h2>
            <p className="text-red-300 mb-4">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  navigate({
                    to: '/kustom-kwiz-kreation',
                    search: { error: undefined }
                  });
                }}
                className="px-6 py-2 bg-primary text-off-dark font-semibold rounded-lg hover:bg-primary-bright transition-all duration-200 cursor-pointer"
              >
                Try Another Topic
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-surface-elevated border border-border text-text-primary font-semibold rounded-lg hover:bg-surface transition-all duration-200 cursor-pointer"
              >
                Retry
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <span>{loadingMessage}</span>
          </div>
        ) : randomized ? (
          <TwoContainerSystem
            unplacedLandmarks={randomized.slice(2)}
            placedLandmarks={[randomized[0]]}
            onDeckLandmark={randomized[1]}
            score={score}
            setScore={setScore}
            isCustomQuiz={true}
          />
        ) : null}
      </div>
    </>
  );
}
