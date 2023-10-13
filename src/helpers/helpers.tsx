import { FormError, FormInfo } from "../components/Form";

export const monthIndexToName = (monthIndex: number) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return months[monthIndex];
};

export const yearMonthIndexDayToStr = (year: number, monthIndex: number, day: number) => {
  const month = monthIndex + 1;

  const monthStr = month < 10 ? `0${month}` : `${month}`;
  const dayStr = day < 10 ? `0${day}` : `${day}`;

  return `${year}-${monthStr}-${dayStr}`;
};

export const getDaysInMonthArr = (year: number, monthIndex: number) => {
  const firstDayIndex = new Date(year, monthIndex, 1).getDay(); // 0 - Sunday, 1 - Monday, etc.

  const sliceStart = firstDayIndex > 1 ? firstDayIndex - 1 : 6;

  const prevMonthIndex = monthIndex === 0 ? 11 : monthIndex - 1;
  const howManyDaysInPrevMonth = new Date(year, monthIndex === 0 ? 11 : monthIndex - 1, 0).getDate();
  const daysInPrevMonthArr = Array.from({ length: howManyDaysInPrevMonth }, (_, i) => i + 1);
  const daysInPrevMonthArrSliced = daysInPrevMonthArr.slice(daysInPrevMonthArr.length - sliceStart);
  const prev = daysInPrevMonthArrSliced.map((day) => ({ day, monthIndex: prevMonthIndex, year }));

  const howManyDaysInCurrentMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysInCurrenMonthArr = Array.from({ length: howManyDaysInCurrentMonth }, (_, i) => i + 1);
  const current = daysInCurrenMonthArr.map((day) => ({ day, monthIndex, year }));

  const arraySum = [...prev, ...current];

  const nextMonthIndex = monthIndex === 11 ? 0 : monthIndex + 1;
  const howManyDaysInNextMonth = new Date(year, nextMonthIndex, 0).getDate();
  const daysInNextMonthArr = Array.from({ length: howManyDaysInNextMonth }, (_, i) => i + 1);
  const daysInNextMonthArrSliced = daysInNextMonthArr.slice(0, 42 - arraySum.length);
  const next = daysInNextMonthArrSliced.map((day) => ({ day, monthIndex: nextMonthIndex, year }));

  return [...arraySum, ...next];
};

export const validateForm = (data: FormInfo): { countErrors: number; errors: FormError } => {
  const validateAge = (age: string) => {
    const ageInt = parseInt(age, 10);
    return ageInt >= 18 ? "" : "Age must be over 18";
  };

  const validateEmail = (email: string) => {
    if (email.length === 0) {
      return "Email can not be empty";
    }

    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email) ? "" : "Email is invalid";
  };

  const errors = {
    firstname: data.firstname.length === 0 ? "First name can not be empty" : "",
    lastname: data.lastname.length === 0 ? "Last name can not be empty" : "",
    email: validateEmail(data.email),
    age: validateAge(data.age),
    photo: data.photo.length === 0 ? "Please add photo" : "",
    dateStr: data.dateStr.length === 0 ? "Please select a date" : "",
  };

  return { errors, countErrors: Object.values(errors).filter((err) => err.length > 0).length };
};
