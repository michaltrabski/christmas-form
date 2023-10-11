import { FC, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { monthIndexToName } from "../helpers/helpers";

interface DatePickerProps {
  updateDate: (date: string) => void;
}

export const DatePicker: FC<DatePickerProps> = ({ updateDate }) => {
  const date = new Date(); // "2023-12-01" "2024-01-01"
  const [year] = useState(() => date.getFullYear()); // todo - make it possible to change year
  const [monthIndex] = useState(() => date.getMonth()); // todo - make it possible to change month
  const [selectedDay, setSelectedDay] = useState(() => date.getDate());

  useEffect(() => {
    updateDate(`${year}-${monthIndex + 1}-${selectedDay}`);
  }, [updateDate, year, monthIndex, selectedDay]);

  const monthName = monthIndexToName(monthIndex);

  const firstDayIndex = new Date(year, monthIndex, 1).getDay();

  const arrayOfDaysNumbers = [...Array.from({ length: firstDayIndex > 1 ? firstDayIndex - 1 : 6 }, () => 0), ...Array.from({ length: 31 }, (_, i) => i + 1)];

  const handleDayChange = (day: number) => {
    setSelectedDay(day);
  };

  const cssDay =
    "p-2 hover:bg-gray-100 dark:hover:bg-gray-600 block flex-1 leading-9 border-0 rounded-lg cursor-pointer text-center text-gray-900 dark:text-white font-semibold text-sm day";

  return (
    <div className="mb-3 top-0 left-0 z-50 pt-2 active block datepicker-orient-bottom datepicker-orient-left">
      <div className="datepicker-picker inline-block rounded-lg bg-white dark:bg-gray-700 shadow-lg p-4">
        <div className="datepicker-header">
          <div className="datepicker-title bg-white dark:bg-gray-700 dark:text-white px-2 py-3 text-center font-semibold"></div>
          <div className="datepicker-controls flex justify-between mb-2">
            <button
              type="button"
              className="bg-white dark:bg-gray-700 rounded-lg   dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white text-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 prev-btn"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
            <button
              type="button"
              className="text-sm rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 font-semibold py-2.5 px-5 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200 view-switch"
            >
              {monthName} {year}
            </button>
            <button
              type="button"
              className="bg-white dark:bg-gray-700 rounded-lg   dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white text-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 next-btn"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="datepicker-main p-1">
          <div className="datepicker-view flex">
            <div className="days">
              <div className="days-of-week grid grid-cols-7 mb-1">
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => {
                  return <span className="text-center h-6 leading-6 text-sm font-medium dark:text-gray-400">{day}</span>;
                })}
              </div>
              <div className="w-64 grid grid-cols-7">
                {arrayOfDaysNumbers.map((day) => {
                  const cssCurrentDay = selectedDay === day ? "bg-blue-700 rounded-full text-white" : "";

                  if (day === 0) {
                    return <span></span>;
                  }

                  return (
                    <span className={twMerge(cssDay, cssCurrentDay)} onClick={() => handleDayChange(day)}>
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="datepicker-footer">
          <div className="datepicker-controls flex space-x-2 mt-2">
            <button
              type="button"
              className="button today-btn text-white bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center w-1/2"
            >
              Today
            </button>
            <button
              type="button"
              className="button clear-btn text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center w-1/2"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
