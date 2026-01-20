import { Tooltip } from 'flowbite-react';
import calendar from '../assets/calendar.svg';
import home from '../assets/home.svg';
import clock from '../assets/clock.svg';
import beaker from '../assets/beaker.svg';
import questionMark from '../assets/questionMark.svg';
import { tooltipTheme } from '../models/variables';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import GuideModal from './GuideModal';

function SidebarMenu() {
  const [showGuide, setShowGuide] = useState(false);
  const homeText = <div>Home</div>;
  const chronoKwizOfTheDayText = <div>ChronoKwiz of the Day</div>;
  const chronokwizHistoryText = <div>Chronokwiz History</div>;
  const kustomKwizText = <div>Kustom Kwiz</div>;
  const guideText = <div>How to Play</div>;

  return (
    <>
      <nav className="fixed top-0 left-0 z-40 w-12 h-screen bg-off-light dark:bg-off-dark border-r border-primary">
        <div className="h-full overflow-y-auto mt-2">
          <ul className="m-2">
            <li className="sidebarItem">
              <Tooltip
                content={homeText}
                placement="right"
                style="auto"
                theme={tooltipTheme}
              >
                <Link
                  data-tooltip-target="tooltip-right"
                  data-tooltip-placement="right"
                  className="flex flex-row h-8 justify-center items-center cursor-pointer"
                  to="/"
                >
                  <img src={home} className="w-full"></img>
                </Link>
              </Tooltip>
            </li>

            <li className="sidebarItem">
              <Tooltip
                content={chronoKwizOfTheDayText}
                placement="right"
                style="auto"
                theme={tooltipTheme}
              >
                <Link
                  data-tooltip-target="tooltip-right"
                  data-tooltip-placement="right"
                  className="flex flex-row h-8 justify-center items-center cursor-pointer"
                  to="/chronokwiz-of-the-day"
                >
                  <img src={clock} className="w-full"></img>
                </Link>
              </Tooltip>
            </li>

            <li className="sidebarItem">
              <Tooltip
                content={chronokwizHistoryText}
                placement="right"
                style="auto"
                theme={tooltipTheme}
              >
                <Link
                  data-tooltip-target="tooltip-right"
                  data-tooltip-placement="right"
                  className="flex flex-row h-8 justify-center items-center cursor-pointer"
                  to="/chronokwiz-history"
                >
                  <img src={calendar} className="w-full"></img>
                </Link>
              </Tooltip>
            </li>

            <li className="sidebarItem">
              <Tooltip
                content={kustomKwizText}
                placement="right"
                style="auto"
                theme={tooltipTheme}
              >
                <Link
                  data-tooltip-target="tooltip-right"
                  data-tooltip-placement="right"
                  className="flex flex-row h-8 justify-center items-center cursor-pointer"
                  to="/kustom-kwiz-kreation"
                  search={{ error: undefined }}
                >
                  <img src={beaker} className="w-full"></img>
                </Link>
              </Tooltip>
            </li>

            <li className="sidebarItem">
              <Tooltip
                content={guideText}
                placement="right"
                style="auto"
                theme={tooltipTheme}
              >
                <button
                  onClick={() => setShowGuide(true)}
                  data-tooltip-target="tooltip-right"
                  data-tooltip-placement="right"
                  className="flex flex-row h-8 justify-center items-center cursor-pointer w-full"
                >
                  <img src={questionMark} className="w-full"></img>
                </button>
              </Tooltip>
            </li>
          </ul>
        </div>
      </nav>
      <GuideModal show={showGuide} onClose={() => setShowGuide(false)} />
    </>
  );
}

export default SidebarMenu;
