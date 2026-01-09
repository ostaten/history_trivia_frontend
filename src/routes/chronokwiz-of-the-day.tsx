import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { getChronokwizOfTheDay } from '../api/routes';
import TwoContainerSystem from '../helpers/TwoContainerSystem';
import { processKwizPayload } from '../utility/utility';
import type { LandmarkDataStructure } from '../models/types';

export const Route = createFileRoute('/chronokwiz-of-the-day')({
  component: ChronoKwizOfTheDay
});

function ChronoKwizOfTheDay() {
  const [score, setScore] = useState(0);
  const [ordered, setOrdered] = useState<LandmarkDataStructure[]>();
  const [randomized, setRandomized] = useState<LandmarkDataStructure[]>();

  useEffect(() => {
    getChronokwizOfTheDay({ category: 'American' })
      .then((response) => {
        const { ordered, randomized } = processKwizPayload(response.data);
        randomized[0].isConfirmed = true;
        setOrdered(ordered);
        setRandomized(randomized);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }, []);

  return (
    <>
      <div className="flex justify-between">
        <div className="grow basis-0 pl-10"></div>
        <h1 className="justify-center">Daily</h1>
        <div className="grow basis-0 self-center font-bold text-right pr-10">
          Score: {score}
        </div>
      </div>
      <div className="flex justify-center text-center">
        {randomized && (
          <TwoContainerSystem
            unplacedLandmarks={randomized.slice(2)}
            placedLandmarks={[randomized[0]]}
            onDeckLandmark={randomized[1]}
            score={score}
            setScore={setScore}
          />
        )}
        {!randomized && <div>Loading...</div>}
      </div>
    </>
  );
}
