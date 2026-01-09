import { Tooltip } from 'flowbite-react';
import calendar from '../assets/calendar.svg';
import home from '../assets/home.svg';
import { tooltipTheme } from '../models/variables';
import { Link } from '@tanstack/react-router';

function SidebarMenu() {
  const homeText = <div>Home</div>;
  const chronoKwizOfTheDayText = <div>ChronoKwiz of the Day</div>;

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

            <li>
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
                  <img src={calendar} className="w-full"></img>
                </Link>
              </Tooltip>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default SidebarMenu;
