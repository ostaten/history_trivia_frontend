import { createFileRoute, Link } from '@tanstack/react-router';
import clock from '../assets/clock.svg';
import calendar from '../assets/calendar.svg';
import beaker from '../assets/beaker.svg';

export const Route = createFileRoute('/')({
  component: Index
});

function Index() {
  return (
    <>
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="grow basis-0"></div>
        <h1 className="justify-center">Chronokwiz</h1>
        <div className="grow basis-0"></div>
      </div>
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 py-8 min-h-[60vh]">
        <div className="w-full max-w-2xl space-y-6">
          <p className="text-center text-text-secondary text-lg mb-8">
            Test your knowledge of history by placing events in chronological
            order!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/chronokwiz-of-the-day"
              className="flex flex-col items-center p-6 bg-surface border-2 border-border rounded-lg hover:border-primary hover:bg-surface-elevated transition-all duration-200 cursor-pointer group"
            >
              <img
                src={clock}
                className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform duration-200"
                alt="Daily Quiz"
              />
              <h2 className="text-xl font-semibold mb-2 text-center">
                Daily Quiz
              </h2>
              <p className="text-text-secondary text-sm text-center">
                Play today's chronokwiz challenge
              </p>
            </Link>

            <Link
              to="/chronokwiz-history"
              className="flex flex-col items-center p-6 bg-surface border-2 border-border rounded-lg hover:border-primary hover:bg-surface-elevated transition-all duration-200 cursor-pointer group"
            >
              <img
                src={calendar}
                className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform duration-200"
                alt="History"
              />
              <h2 className="text-xl font-semibold mb-2 text-center">
                History
              </h2>
              <p className="text-text-secondary text-sm text-center">
                Browse and play past quizzes
              </p>
            </Link>

            <Link
              to="/kustom-kwiz-kreation"
              search={{ error: undefined }}
              className="flex flex-col items-center p-6 bg-surface border-2 border-border rounded-lg hover:border-primary hover:bg-surface-elevated transition-all duration-200 cursor-pointer group"
            >
              <img
                src={beaker}
                className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform duration-200"
                alt="Custom Quiz"
              />
              <h2 className="text-xl font-semibold mb-2 text-center">
                Custom Quiz
              </h2>
              <p className="text-text-secondary text-sm text-center">
                Create your own custom chronokwiz
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
