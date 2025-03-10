import { CustomFlowbiteTheme } from "flowbite-react";

export const customNavbarTheme: CustomFlowbiteTheme["navbar"] = {
  root: {
    base: "bg-white px-2 py-2.5 dark:border-gray-700 dark:bg-gray-800 sm:px-4 sticky top-0 z-50",
  },
  link: {
    active: {
      on: "md:text-blue-700 md:dark:text-blue-300 md:bg-transparent bg-blue-500 dark:text-white text-blue-700 md:rounded-none rounded border-b-2 border-blue-500",
      off: "text-black hover:text-blue-500 dark:text-white",
    },
  },
};

export const customMarketZoneNavbarTheme: CustomFlowbiteTheme["navbar"] = {
  root: {
    base: "bg-black px-2 py-2.5 sm:px-4 sticky top-0 z-50",
  },
  link: {
    active: {
      on: "md:text-white md:dark:text-dark md:bg-transparent bg-gray-500 text-white md:rounded-none rounded",
      off: "text-gray-400 hover:text-gray-600",
    },
  },
};

export const customCarouselTheme: CustomFlowbiteTheme["carousel"] = {
  scrollContainer: {
    base: "flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth",
    snap: "snap-x",
  },
};

export const customPillsTabTheme: CustomFlowbiteTheme["tabs"] = {
  tablist: {
    tabitem: {
      base: "flex items-center justify-center rounded-t-lg p-2 text-sm font-medium first:ml-0 focus:outline-none disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
      variant: {
        pills: {
          base: "",
          active: {
            on: "rounded-lg bg-[#6425fe] text-white hover:bg-[#6425fe] hover:text-white dark:bg-gray-800 dark:hover:bg-gray-800",
            off: "rounded-lg hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white",
          },
        },
      },
    },
  },
};
