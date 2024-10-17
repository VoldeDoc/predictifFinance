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

export const customCarouselTheme: CustomFlowbiteTheme["carousel"] = {
  scrollContainer: {
    base: "flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth",
    snap: "snap-x",
  },
};