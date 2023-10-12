import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { COUNTRY_CODE, holidaysExampleResponse } from "../constants/constants";
import { twMerge } from "tailwind-merge";
import { DatePicker } from "./DatePicker";
import { yearMonthIndexDayToStr } from "../helpers/helpers";

interface FormInfo {
  firstname: string;
  lastname: string;
  email: string;
  age: number;
  photo: string;
  dateStr: string;
}

export interface HolidayInfo {
  country: string;
  iso: string;
  year: number;
  date: string;
  day: string;
  name: string;
  type: string;
}

interface FormError {
  firstname: string;
  lastname: string;
  email: string;
  age: string;
  photo: string;
  dateStr: string;
}

const initialFormInfo: FormInfo = {
  firstname: "",
  lastname: "",
  email: "",
  age: 0,
  photo: "",
  dateStr: "",
};

const initialError: FormError = {
  firstname: "",
  lastname: "",
  email: "",
  age: "",
  photo: "",
  dateStr: "",
};

export const Form = () => {
  const [year] = useState(() => new Date().getFullYear());
  const [monthIndex] = useState(() => new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [holidaysInfo, setHolidaysInfo] = useState<HolidayInfo[] | null>(null);

  const [formInfo, setFormInfo] = useState<FormInfo>(() => initialFormInfo);
  const [formError, setFormError] = useState<FormError>(() => initialError);

  const isFormError = Object.values(formError).filter((value) => value.length > 0).length > 0;

  const validate = (formInfo: FormInfo) => {
    const { firstname, lastname, email, age, photo, dateStr: date } = formInfo;
    const errors = {
      firstname: firstname.length === 0 ? "First name can not be empty" : "",
      lastname: lastname.length === 0 ? "Last name can not be empty" : "",
      email: email.length === 0 ? "Email can not be empty" : "",
      age: age === 0 ? "Age must be over 18" : "",
      photo: photo.length === 0 ? "Please add photo" : "",
      dateStr: date.length === 0 ? "Please select a date" : "",
    };
    setFormError(errors);

    return { errors, countErrors: Object.values(errors).filter((err) => err.length > 0).length };
  };

  useEffect(() => {
    axios
      .get(`https://api.api-ninjas.com/v1/holidays?country=${COUNTRY_CODE}&year=${year}`, {
        headers: {
          "X-Api-Key": "8DX8eEe67njS1lbThFsdSw==rQQNpQ8PYbPZBjrx", // change it later to process.env.REACT_APP_API_KEY
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
  }, [year]);

  const formRef = React.useRef<HTMLFormElement | null>(null);

  const { firstname, lastname, email, age, photo, dateStr: date } = formInfo;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { countErrors } = validate(formInfo);

    if (countErrors > 0) {
      return;
    }

    const form = formRef.current;

    if (!form) {
      return;
    }

    const formData = new FormData(form);

    for (const pair of formData.entries()) {
      console.log("formData michal ", `${pair[0]}: ${pair[1]}`, JSON.stringify(formData.entries()));
    }

    axios
      .post("http://localhost:3000", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const imageUrl = URL.createObjectURL(files[0]);

      setFormInfo((prev) => ({ ...prev, [name]: imageUrl }));
      return;
    }

    setFormInfo((prev) => ({ ...prev, [name]: value }));
  };

  const updateDate = useCallback(
    (year: number, monthIndex: number, selectedDay: number) => {
      setFormInfo((prev) => ({ ...prev, dateStr: yearMonthIndexDayToStr(year, monthIndex, selectedDay) }));
      setSelectedDay(selectedDay);
    },
    [setFormInfo, setSelectedDay]
  );

  const cssLabel = "block text-[#000853] font-normal text-base mb-1";
  const cssInputText = "bg-white border border-[#CBB6E5] text-[#000853] rounded-lg w-full px-4 py-2 active:border-[#761BE4]";

  return (
    <div className="max-w-md m-auto">
      <h1 className="font-medium text-2xl   text-[#000853] sm:text-3xl mb-4 sm:truncate">Personal info</h1>
      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        <div className="mb-2">
          <label htmlFor="firstname" className={cssLabel}>
            First Name
          </label>
          <input type="text" name="firstname" id="firstname" className={cssInputText} placeholder="John" onChange={handleChange} value={firstname} />
          {formError.firstname && <p className="text-sm text-red-500">{formError.firstname}</p>}
        </div>
        {/* lastname */}
        <div className="mb-2">
          <label htmlFor="lastname" className={cssLabel}>
            Last Name
          </label>
          <input type="text" name="lastname" id="lastname" className={cssInputText} placeholder="Doe" onChange={handleChange} value={lastname} />
          {formError.lastname && <p className="text-sm text-red-500">{formError.lastname}</p>}
        </div>
        {/* email */}
        <div className="mb-2">
          <label htmlFor="email" className={cssLabel}>
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className={twMerge(cssInputText, formError.email && "invalid:border-[#ED4545]")}
            placeholder="josh.doe@email.com"
            onChange={handleChange}
            value={email}
          />
          {formError.email && <p className="text-sm text-red-500">{formError.email}</p>}
        </div>
        {/* age range slider  */}
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
        {/* photo */}
        <div className="mb-2">
          <div className="flex items-center justify-center w-full">
            <label htmlFor="photo" className="flex flex-col items-center justify-center w-full border-[#CBB6E5] rounded-lg cursor-pointer bg-white    hover:bg-gray-100  ">
              <div className="flex flex-col items-center justify-center py-5 px-2">
                <p className="text-[#898DA9]  ">
                  <span className="text-[#761BE4] underline">Upload a file</span> or drag and drop
                </p>
              </div>
              <input id="photo" type="file" name="photo" className="hidden" onChange={handleChange} />
            </label>
          </div>
          {formError.photo && <p className="text-sm text-red-500">{formError.photo}</p>}
          {photo && <div style={{ backgroundImage: `url(${photo})` }} className="w-[50px] h-[50px] bg-cover bg-center bg-no-repeat " />}
        </div>

        {/* date */}
        <div className=" mb-2">
          <label htmlFor="date" className={cssLabel}>
            Date
          </label>
          <input type="date" name="date" id="date" className="hidden" value={date} readOnly />

          {holidaysInfo ? (
            <DatePicker holidaysInfo={holidaysInfo} updateDate={updateDate} year={year} monthIndex={monthIndex} selectedDay={selectedDay} />
          ) : (
            <p className="pb-2">Fetching data about holidays</p>
          )}
          {formError.dateStr && <p className="text-sm text-red-500">{formError.dateStr}</p>}
        </div>

        {/* submit */}
        <div className="mb-2">
          <button type="submit" className="block mb-2 w-full   bg-primary text-white rounded px-8 py-2 gap-2 disabled:bg-[#CBB6E5]" disabled={isFormError}>
            Send Application
          </button>

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

      <pre>
        <code>{JSON.stringify(formInfo, null, 2)}</code>
      </pre>
    </div>
  );
};
