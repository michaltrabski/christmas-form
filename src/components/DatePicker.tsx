import { FC, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { getDaysInMonthArr, monthIndexToName, yearMonthIndexDayToStr } from "../helpers/helpers";
import { HolidayInfo } from "./Form";
import { IconError } from "../icons/IconError";

interface DatePickerProps {
  holidaysInfo: HolidayInfo[];
  updateDate: (year: number, monthIndex: number, selectedDay: number) => void;
  setSelectedMonthIndex: (monthIndex: number) => void;
  year: number;
  selectedMonthIndex: number;
  selectedDay: number | null;
}

export const DatePicker: FC<DatePickerProps> = ({ holidaysInfo, updateDate, setSelectedMonthIndex, selectedDay, selectedMonthIndex, year }) => {
  const [holidayName, setHolidayName] = useState("");

  useEffect(() => {
    if (selectedDay === null) {
      setHolidayName("");
      return;
    }

    const holiday = holidaysInfo.find((h) => {
      const isTheSameDate = h.date === yearMonthIndexDayToStr(year, selectedMonthIndex, selectedDay);
      const isTypeObservance = h.type === "OBSERVANCE";

      return isTheSameDate && isTypeObservance;
    });

    if (holiday) {
      setHolidayName(holiday.name);
      return;
    }

    setHolidayName("");
  }, [holidaysInfo, year, selectedMonthIndex, selectedDay]);

  const handleDayClick = (monthIndex: number, day: number) => {
    updateDate(year, monthIndex, day);
  };

  const monthName = monthIndexToName(selectedMonthIndex);

  const daysInMonthArr = useMemo(() => getDaysInMonthArr(year, selectedMonthIndex), [year, selectedMonthIndex]);

  const cssDay =
    "p-2  block flex-1 leading-9 border-0 rounded-full cursor-pointer text-center text-[#000853] font-semibold text-sm day disabled:text-[#898DA9]  disabled:cursor-default disabled:bg-white disabled:hover:bg-white";

  return (
    <div className="flex gap-4">
      <div>
        <p className="text-[#000853] font-normal text-base mb-1">Date</p>
        <div className="mb-3">
          <div className="rounded-lg bg-white p-4 border border-[#CBB6E5]">
            <div className="">
              <div className="bg-white px-2 py-3 text-center font-semibold"></div>
              <div className="flex justify-between mb-2">
                <button
                  onClick={() => {
                    setSelectedMonthIndex(selectedMonthIndex === 0 ? 11 : selectedMonthIndex - 1);
                  }}
                  disabled={selectedMonthIndex === 0}
                  type="button"
                  className="bg-white rounded-lg hover:bg-gray-100 text-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 prev-btn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>

                <div className="text-sm rounded-lg text-gray-900 bg-white font-semibold py-2.5 px-5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
                  {monthName} {year}
                </div>
                <button
                  onClick={() => setSelectedMonthIndex(selectedMonthIndex === 11 ? 0 : selectedMonthIndex + 1)}
                  disabled={selectedMonthIndex === 11}
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
            <div className="p-1">
              <div className="flex">
                <div>
                  <div className="days-of-week grid grid-cols-7 mb-1">
                    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => {
                      return (
                        <span key={day} className="text-center h-6 leading-6 text-sm font-medium">
                          {day}
                        </span>
                      );
                    })}
                  </div>
                  <div className="w-64 grid grid-cols-7">
                    {daysInMonthArr.map(({ day, monthIndex, year }, i) => {
                      const cssSelectedDay = selectedDay === day && selectedMonthIndex === monthIndex ? "bg-[#761BE4] rounded-full text-white" : "";
                      const dateAsString = yearMonthIndexDayToStr(year, monthIndex, day);

                      const isSunday = i % 7 === 6;
                      const isNationalHoliday = holidaysInfo.find((h) => {
                        const isTheSameDate = h.date === dateAsString;
                        const isTypeNationalHoliday = h.type === "NATIONAL_HOLIDAY";

                        return isTheSameDate && isTypeNationalHoliday;
                      });
                      const isDayInCurrentMonth = selectedMonthIndex === monthIndex;

                      return (
                        <button
                          key={dateAsString}
                          className={twMerge(cssDay, cssSelectedDay)}
                          onClick={() => handleDayClick(monthIndex, day)}
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
        {holidayName && (
          <p className="pb-2">
            <span className="relative top-[-1px] pr-1 text-[#000853]">
              <IconError />
            </span>
            <span>{holidayName}</span>
          </p>
        )}
      </div>
      <div>
        <p className="text-[#000853] font-normal text-base mb-1">Time</p>
        {["11:00", "13:30", "17:30", "19:00"].map((time) => {
          return (
            <div className="pb-2">
              <button className="bg-white border border-[#CBB6E5] px-3 py-2 text-[#000853] rounded-lg">{time}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
