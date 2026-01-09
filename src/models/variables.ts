import { createTheme } from 'flowbite-react';

export const tooltipTheme = createTheme({
  target: 'w-fit',
  animation: 'transition-opacity',
  arrow: {
    base: 'absolute z-10 h-2 w-2 rotate-45',
    style: {
      dark: 'bg-neutral dark:bg-neutral',
      light: 'bg-neutral',
      auto: 'bg-neutral dark:bg-neutral'
    },
    placement: '-4px'
  },
  base: 'absolute z-10 inline-block rounded-lg px-3 py-2 text-sm font-medium shadow-sm text-center',
  hidden: 'invisible opacity-0',
  style: {
    dark: 'bg-neutral text-primary dark:bg-neutral',
    light: 'bg-neutral text-primary',
    auto: 'bg-neutral text-primary dark:bg-neutral dark:text-primary'
  },
  content: 'relative z-20'
});

export const MaxItemScore = 3;
