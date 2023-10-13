import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { COUNTRY_CODE, HolidayInfo, holidaysExampleResponse } from "../constants/constants";
import { twMerge } from "tailwind-merge";
import { DatePicker } from "./DatePicker";
import { validateForm, yearMonthIndexDayToStr } from "../helpers/helpers";

export interface FormInfo {
  firstname: string;
  lastname: string;
  email: string;
  age: string;
  photo: string;
  dateStr: string;
}

export interface FormError extends FormInfo {}

const initialValue = {
  firstname: "",
  lastname: "",
  email: "",
  age: "",
  photo: "",
  dateStr: "",
};

export const Form = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  // const [selectedHour, setSelectedHour] = useState<number | null>(null);
  // const [selectedMinute, setSelectedMinute] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState("");

  const [holidaysInfo, setHolidaysInfo] = useState<HolidayInfo[] | null>(null);

  const [formInfo, setFormInfo] = useState<FormInfo>(() => initialValue);
  const [isFormSent, setIsFormSent] = useState(false);
  const { firstname, lastname, email, age, photo, dateStr: date } = formInfo;

  const [formError, setFormError] = useState<FormError>(() => initialValue);
  const [isFirstValidationDone, setIsFirstValidationDone] = useState(false);
  const isFormError = Object.values(formError).filter((value) => value.length > 0).length > 0;

  const validateField = (fieldName: keyof FormInfo, value: string) => {
    if (!isFirstValidationDone) {
      return;
    }

    const newFormInfo = { ...formInfo, [fieldName]: value };

    const { errors } = validateForm(newFormInfo);
    setFormError(errors);
  };

  useEffect(() => {
    axios
      .get(`https://api.api-ninjas.com/v1/holidays?country=${COUNTRY_CODE}&year=${selectedYear || 2023}`, {
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
  }, [selectedYear]);

  const formRef = React.useRef<HTMLFormElement | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsFirstValidationDone(true);
    const { countErrors, errors } = validateForm(formInfo);
    setFormError(errors);

    if (countErrors > 0) {
      return;
    }

    const form = formRef.current;

    if (!form) {
      return;
    }

    const formData = new FormData(form);

    axios
      .post("http://localhost:3000", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("res", res);
        setIsFormSent(true);
      })
      .catch((err) => {
        console.log("handle server error", err);
        setIsFormSent(true);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    validateField(name as keyof FormInfo, value);

    if (files && files[0]) {
      const imageUrl = URL.createObjectURL(files[0]);

      setFormInfo((prev) => ({ ...prev, [name]: imageUrl }));
      return;
    }

    setFormInfo((prev) => ({ ...prev, [name]: value }));
  };

  const updatePhotoOnDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    const imageUrl = URL.createObjectURL(file);
    setFormInfo((prev) => ({ ...prev, photo: imageUrl }));
  };

  const selectDate = useCallback(
    (year: number, monthIndex: number, day: number, time?: string) => {
      if (time) {
        setFormInfo((prev) => ({ ...prev, dateStr: yearMonthIndexDayToStr(year, monthIndex, day, time) }));
        setSelectedYear(year);
        setSelectedMonthIndex(monthIndex);
        setSelectedDay(day);
        setSelectedTime(time);

        return;
      }

      setFormInfo((prev) => ({ ...prev, dateStr: yearMonthIndexDayToStr(year, monthIndex, day) }));
      setSelectedYear(year);
      setSelectedMonthIndex(monthIndex);
      setSelectedDay(day);
      setSelectedTime("");
    },
    [setFormInfo, setSelectedDay, setSelectedMonthIndex, setSelectedYear]
  );

  const cssLabel = "block text-[#000853] font-normal text-base mb-1";
  const cssInputText = "bg-white border border-[#CBB6E5] text-[#000853] rounded-lg w-full px-4 py-2 active:border-[#761BE4]";

  return (
    <div className="max-w-md m-auto pb-20">
      <h1 className="font-medium text-2xl   text-[#000853] sm:text-3xl mb-4 sm:truncate">Personal info</h1>
      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        <div className="mb-2">
          <label htmlFor="firstname" className={cssLabel}>
            First Name
          </label>
          <input type="text" name="firstname" id="firstname" className={cssInputText} onChange={handleChange} value={firstname} />
          {formError.firstname && <p className="text-sm text-red-500">{formError.firstname}</p>}
        </div>

        <div className="mb-2">
          <label htmlFor="lastname" className={cssLabel}>
            Last Name
          </label>
          <input type="text" name="lastname" id="lastname" className={cssInputText} onChange={handleChange} value={lastname} />
          {formError.lastname && <p className="text-sm text-red-500">{formError.lastname}</p>}
        </div>

        <div className="mb-2">
          <label htmlFor="email" className={cssLabel}>
            Email
          </label>
          <input type="email" name="email" id="email" className={twMerge(cssInputText, formError.email && "invalid:border-[#ED4545]")} onChange={handleChange} value={email} />
          {formError.email && <p className="text-sm text-red-500">{formError.email}</p>}
        </div>

        <div className="  mb-5">
          <label htmlFor="age" className={twMerge(cssLabel, "mb-3")}>
            Age
          </label>

          <div className="relative">
            <input
              type="range"
              name="age"
              id="age"
              min="8"
              max="100"
              onChange={handleChange}
              value={age}
              className="w-full h-1 bg-[#CBB6E5] rounded-lg appearance-none cursor-pointer accent-[#761BE4]"
            />
            <div className="absolute top-[-8px] left-0 text-[#000853] text-sm font-base">{8}</div>

            <div className="absolute top-[-8px] right-0 text-[#000853] text-sm font-base">{100}</div>
            {formError.age && <p className="text-sm text-red-500">{formError.age}</p>}
          </div>
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="photo"
              className="flex flex-col items-center justify-center w-full border-[#CBB6E5] rounded-lg cursor-pointer bg-white hover:bg-gray-100"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = "copy";
              }}
              onDrop={(e) => updatePhotoOnDrop(e)}
            >
              <div className="flex flex-col items-center justify-center py-5 px-2">
                <p className="text-[#3f4469]">
                  <span className="text-[#761BE4] underline">Upload a file</span> or drag and drop
                </p>
              </div>
              <input id="photo" type="file" name="photo" className="hidden" onChange={handleChange} />
            </label>
          </div>
          {formError.photo && <p className="text-sm text-red-500">{formError.photo}</p>}
          {photo && <div style={{ backgroundImage: `url(${photo})` }} className="w-[50px] h-[50px] bg-cover bg-center bg-no-repeat " />}
        </div>

        <div className="mb-2">
          <input type={selectedTime ? "datetime-local" : "date"} name="date" id="date" className="hidden" value={date} onChange={handleChange} />

          {holidaysInfo ? (
            <DatePicker
              holidaysInfo={holidaysInfo}
              selectDate={selectDate}
              selectedYear={selectedYear}
              selectedMonthIndex={selectedMonthIndex}
              selectedDay={selectedDay}
              selectedTime={selectedTime}
            />
          ) : (
            <p className="pb-2">Fetching data about holidays</p>
          )}
          {formError.dateStr && <p className="text-sm text-red-500">{formError.dateStr}</p>}
        </div>

        <div className="mb-2">
          <button type="submit" className="block mb-2 w-full bg-primary text-white rounded px-8 py-2 gap-2 disabled:bg-[#CBB6E5]" disabled={isFormError || !holidaysInfo}>
            Send Application
          </button>

          {isFormSent && (
            <div className="text-green-500">
              <p>Form is send to fake endpoint with new FormData!</p>
            </div>
          )}

          {isFormError && (
            <div className="text-sm text-red-500">
              <p>
                <strong>Please fix errors in the form:</strong>
              </p>

              {Object.values(formError)
                .filter((value) => value.length > 0)
                .map((value) => (
                  <p key={value}>{value}</p>
                ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
