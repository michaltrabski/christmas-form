import React, { useState, useEffect } from "react";
import axios from "axios";
import { holidaysExampleResponse } from "../constants/constants";
import { twMerge } from "tailwind-merge";
import { DatePicker } from "./DatePicker";

interface FormInformation {
  firstname: string;
  lastname: string;
  email: string;
  age: number;
  photo: string;
  date: string;
}

const countryCode = "PL";
const year = "2023";
// const initialFormInfo: FormInformation = {
//   firstname: "jan",
//   lastname: "kowal",
//   email: "michal.trabski@gmail.com",
//   age: 54,
//   photo: "",
//   date: "2023-10-20",
// };

const initialFormInfo: FormInformation = {
  firstname: "John",
  lastname: "",
  email: "",
  age: 0, // michal - this is wrong, change it later
  photo: "",
  date: "",
};

export const Form = () => {
  const [formInfo, setFormInfo] = useState<FormInformation>(() => initialFormInfo);

  const [holidaysData, setHolidaysData] = useState<
    | {
        country: string;
        iso: string;
        year: number;
        date: string;
        day: string;
        name: string;
        type: string;
      }[]
    | null
  >(null);

  useEffect(() => {
    const type = "national_holiday";

    console.log(`https://api.api-ninjas.com/v1/holidays?country=${countryCode}&year=${year}&type=${type}`);
    axios
      .get(`https://api.api-ninjas.com/v1/holidays?country=${countryCode}&year=${year}&type=${type}`, {
        headers: {
          "X-Api-Key": "8DX8eEe67njS1lbThFsdSw==rQQNpQ8PYbPZBjrx", // change it later to process.env.REACT_APP_API_KEY
        },
      })
      .then((res) => {
        console.log("res", res);
        setHolidaysData(res.data);
      })
      .catch((err) => {
        console.log("err", err);

        // if api is not working, use fake data
        setHolidaysData(() => holidaysExampleResponse);
      });
  }, []);

  const formRef = React.useRef<HTMLFormElement | null>(null);

  const { firstname, lastname, email, age, photo, date } = formInfo;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
    const { name, value } = e.target;
    setFormInfo((prev) => ({ ...prev, [name]: value }));
  };

  const updateDate = (date: string) => {
    setFormInfo((prev) => ({ ...prev, date }));
  };

  const cssLabel = "block text-[#000853] font-normal text-base mb-1";
  const cssInputText = "bg-white border border-[#CBB6E5] text-[#000853] rounded-lg w-full px-4 py-2";

  return (
    <div className="max-w-md m-auto">
      <h1 className="font-medium text-2xl   text-[#000853] sm:text-3xl mb-4 sm:truncate">Personal info</h1>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="mb-2">
          <label htmlFor="firstname" className={cssLabel}>
            First Name
          </label>
          <input type="text" name="firstname" id="firstname" className={cssInputText} placeholder="John" onChange={handleChange} value={firstname} />
        </div>

        {/* lastname */}
        <div className="mb-2">
          <label htmlFor="lastname" className={cssLabel}>
            Last Name
          </label>
          <input type="text" name="lastname" id="lastname" className={cssInputText} placeholder="Doe" onChange={handleChange} value={lastname} />
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
            className={twMerge(cssInputText, "invalid:border-[#ED4545]")}
            placeholder="josh.doe@email.com"
            onChange={handleChange}
            value={email}
          />
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
              <input id="photo" type="file" name="photo" className="hidden" onChange={handleChange} value={photo} />
            </label>
          </div>
        </div>

        {/* date */}
        <div className=" mb-2">
          <label htmlFor="date" className={cssLabel}>
            Date
          </label>
          <input type="date" name="date" id="date" className="block border-gray-400 border-2" onChange={handleChange} value={date} />
        </div>

        <DatePicker updateDate={updateDate} />

        {/* submit */}
        <div className="mb-2">
          <button type="submit" className="w-full block bg-primary text-white rounded px-8 py-2 gap-2 disabled:bg-[#CBB6E5]" disabled>
            Send Application
          </button>
        </div>
      </form>
      <div className="mt-10 text-xs">
        <pre>
          formInfo:
          <code>{JSON.stringify(formInfo, null, 2)}</code>
        </pre>

        <pre>
          <code>{JSON.stringify(holidaysData, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
};
