import { FC, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import axios from "axios";

import { getDaysInMonthArray, monthIndexToName, valuesToDateString } from "../helpers/helpers";
import { IconError } from "../icons/IconError";
import { COUNTRY_CODE, HOLIDAYS_ENDPOINT, HOLIDAY_TYPES, HolidayInfo, holidaysExampleResponse } from "../constants/constants";

interface DatePickerProps {
  selectDate: (year: number, monthIndex: number, selectedDay: number, time?: string) => void;
  selectedYear: number | null;
  selectedMonthIndex: number | null;
  selectedDay: number | null;
  selectedTime?: string;
}

export const DatePicker: FC<DatePickerProps> = ({ selectDate, selectedYear, selectedMonthIndex, selectedDay, selectedTime }) => {
  const [callendarYear, setCallendarYear] = useState(() => new Date().getFullYear());
  const [callendarMonthIndex, setCallendarMonthIndex] = useState(() => new Date().getMonth());

  const [holidaysInfo, setHolidaysInfo] = useState<HolidayInfo[] | null>(null);
  const [holidayName, setHolidayName] = useState("");

  useEffect(() => {
    if (!selectedYear || !selectedMonthIndex || !selectedDay) {
      return;
    }

    if (selectedDay === null) {
      setHolidayName("");
      return;
    }

    const holiday = holidaysInfo?.find((h) => {
      const isTheSameDate = h.date === valuesToDateString(selectedYear, selectedMonthIndex, selectedDay);
      const isTypeObservance = h.type === HOLIDAY_TYPES.OBSERVANCE;

      return isTheSameDate && isTypeObservance;
    });

    if (holiday) {
      setHolidayName(holiday.name);
      return;
    }

    setHolidayName("");
  }, [holidaysInfo, selectedYear, selectedMonthIndex, selectedDay]);

  useEffect(() => {
    axios
      .get(`${HOLIDAYS_ENDPOINT}?country=${COUNTRY_CODE}&year=${callendarYear}`, {
        headers: {
          "X-Api-Key": import.meta.env.VITE_API_KEY,
        },
      })
      .then((res) => {
        console.log("res", res);
        setHolidaysInfo(res.data);
      })
      .catch((err) => {
        console.log("err", err);

        // if api is not working, use fake data
        setHolidaysInfo(() => holidaysExampleResponse);
      });
  }, [callendarYear]);

  const monthName = monthIndexToName(callendarMonthIndex);

  const nextMonth = () => {
    if (callendarMonthIndex === 11) {
      setCallendarMonthIndex(0);
      setCallendarYear(callendarYear + 1);
      return;
    }

    setCallendarMonthIndex(callendarMonthIndex + 1);
  };

  const prevMonth = () => {
    if (callendarMonthIndex === 0) {
      setCallendarMonthIndex(11);
      setCallendarYear(callendarYear - 1);
      return;
    }

    setCallendarMonthIndex(callendarMonthIndex - 1);
  };

  const daysInMonthArray = useMemo(() => getDaysInMonthArray(callendarYear, callendarMonthIndex), [callendarYear, callendarMonthIndex]);

  const cssDay =
    "p-2 block flex-1 leading-9 border-0 rounded-full cursor-pointer text-center text-[#000853] font-semibold text-sm day disabled:text-[#898DA9] disabled:cursor-default disabled:bg-white disabled:hover:bg-white";

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
                  onClick={() => prevMonth()}
                  type="button"
                  className="bg-white rounded-lg hover:bg-gray-100 text-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
                  {monthName} {callendarYear}
                </div>
                <button
                  onClick={() => nextMonth()}
                  type="button"
                  className="bg-white rounded-lg hover:bg-gray-100 hover:text-gray-900  text-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
                    {daysInMonthArray.map(({ _year, _monthIndex, _day }, i) => {
                      const cssSelectedDay = selectedDay === _day && selectedMonthIndex === _monthIndex && selectedYear === _year ? "bg-[#761BE4] rounded-full text-white" : "";

                      const dateAsString = valuesToDateString(_year, _monthIndex, _day);

                      const isSunday = i % 7 === 6;
                      const isNationalHoliday = holidaysInfo?.find((h) => {
                        const isTheSameDate = h.date === dateAsString;
                        const isTypeNationalHoliday = h.type === HOLIDAY_TYPES.NATIONAL_HOLIDAY;

                        return isTheSameDate && isTypeNationalHoliday;
                      });

                      const isDayInCurrentMonth = callendarMonthIndex === _monthIndex;

                      return (
                        <button
                          key={dateAsString}
                          className={twMerge(cssDay, cssSelectedDay)}
                          onClick={() => selectDate(callendarYear, callendarMonthIndex, _day)}
                          disabled={isSunday || !!isNationalHoliday || !isDayInCurrentMonth}
                        >
                          {_day}
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

      {selectedYear && selectedMonthIndex && selectedDay && (
        <div>
          <p className="text-[#000853] font-normal text-base mb-1">Time</p>
          {["11:00", "13:30", "16:00", "18:45"].map((_time) => {
            const isSelected = selectedTime === _time;
            const cssSelected = isSelected ? "border-2 border-[#761BE4]" : "";

            return (
              <div key={_time} className="pb-2">
                <button
                  className={twMerge("bg-white border border-[#CBB6E5] px-3 py-2 text-[#000853] rounded-lg", cssSelected)}
                  onClick={() => selectDate(selectedYear, selectedMonthIndex, selectedDay, _time)}
                >
                  {_time}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
