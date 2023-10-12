import { FC, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { getDaysInMonthArr, monthIndexToName, yearMonthIndexDayToStr } from "../helpers/helpers";
import { HolidayInfo } from "./Form";

interface DatePickerProps {
  holidaysInfo: HolidayInfo[];
  updateDate: (year: number, monthIndex: number, selectedDay: number) => void;
  year: number;
  monthIndex: number;
  selectedDay: number | null;
}

export const DatePicker: FC<DatePickerProps> = ({ holidaysInfo, updateDate, selectedDay, monthIndex, year }) => {
  const [holidayName, setHolidayName] = useState("");

  useEffect(() => {
    if (selectedDay === null) {
      setHolidayName("");
      return;
    }

    const holiday = holidaysInfo.find((h) => {
      const isTheSameDate = h.date === yearMonthIndexDayToStr(year, monthIndex, selectedDay);
      const isTypeObservance = h.type === "OBSERVANCE";

      return isTheSameDate && isTypeObservance;
    });

    if (holiday) {
      setHolidayName(holiday.name);
      return;
    }

    setHolidayName("");
  }, [holidaysInfo, year, monthIndex, selectedDay]);

  const handleDayClick = (day: number) => {
    updateDate(year, monthIndex, day);
  };

  const monthName = monthIndexToName(monthIndex);

  const daysInMonthArr = useMemo(() => getDaysInMonthArr(year, monthIndex), [year, monthIndex]);

  const cssDay =
    "p-2 hover:bg-gray-100 block flex-1 leading-9 border-0 rounded-full cursor-pointer text-center text-gray-900 font-semibold text-sm day disabled:opacity-50 disabled:cursor-default disabled:bg-white disabled:hover:bg-white";

  return (
    <>
      <div className="mb-3 top-0 left-0 z-50 pt-2 active block datepicker-orient-bottom datepicker-orient-left">
        <div className="datepicker-picker inline-block rounded-lg bg-white shadow-lg p-4">
          <div className="datepicker-header">
            <div className="datepicker-title bg-white px-2 py-3 text-center font-semibold"></div>
            <div className="datepicker-controls flex justify-between mb-2">
              <button type="button" className="bg-white rounded-lg hover:bg-gray-100 text-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 prev-btn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              <button
                type="button"
                className="text-sm rounded-lg text-gray-900 bg-white font-semibold py-2.5 px-5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 view-switch"
              >
                {monthName} {year}
              </button>
              <button
                type="button"
                className="bg-white rounded-lg hover:bg-gray-100   hover:text-gray-900  text-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 next-btn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
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
                    return (
                      <span key={day} className="text-center h-6 leading-6 text-sm font-medium  ">
                        {day}
                      </span>
                    );
                  })}
                </div>
                <div className="w-64 grid grid-cols-7">
                  {daysInMonthArr.map(({ day, monthIndex: _monthIndex, year }, i) => {
                    const cssSelectedDay = selectedDay === day && monthIndex === _monthIndex ? "bg-blue-700 rounded-full text-white" : "";
                    const dateAsString = yearMonthIndexDayToStr(year, _monthIndex, day);

                    const isSunday = i % 7 === 6;
                    const isNationalHoliday = holidaysInfo.find((h) => {
                      const isTheSameDate = h.date === dateAsString;
                      const isTypeNationalHoliday = h.type === "NATIONAL_HOLIDAY";

                      return isTheSameDate && isTypeNationalHoliday;
                    });
                    const isDayInCurrentMonth = monthIndex === _monthIndex;

                    return (
                      <button
                        key={dateAsString}
                        className={twMerge(cssDay, cssSelectedDay)}
                        onClick={() => handleDayClick(day)}
                        disabled={isSunday || !!isNationalHoliday || !isDayInCurrentMonth}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {holidayName && <p className="pb-2">{holidayName}</p>}
    </>
  );
};
