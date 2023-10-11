import React, { useState } from "react";
import axios from "axios";

interface FormInformation {
  firstname: string;
  lastname: string;
  email: string;
  age: number;
  photo: string;
  date: string;
}

// const initialFormInfo: FormInformation = {
//   firstname: "jan",
//   lastname: "kowal",
//   email: "michal.trabski@gmail.com",
//   age: 54,
//   photo: "",
//   date: "2023-10-20",
// };

const initialFormInfo: FormInformation = {
  firstname: "",
  lastname: "",
  email: "",
  age: 0, // michal - this is wrong, change it later
  photo: "",
  date: "",
};

export const Form = () => {
  const [formInfo, setFormInfo] = useState<FormInformation>(() => initialFormInfo);

  const formRef = React.useRef<HTMLFormElement | null>(null);

  const { firstname, lastname, email, age, photo, date } = formInfo;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = formRef.current;

    if (!form) {
      return;
    }

    const formData = new FormData(form);
    formData.append("xxx", "111");
    console.log("formData", new FormData(form), formData, form);

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
    console.log("handleChange e", e);
    const { name, value } = e.target;
    setFormInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <form ref={formRef} className="p-3" onSubmit={handleSubmit}>
        {/* firstname */}
        <div>
          <label htmlFor="firstname" className="block text-black">
            First Name
          </label>
          <input type="text" name="firstname" id="firstname" className="block border-gray-400 border-2" placeholder="John" onChange={handleChange} value={firstname} />
        </div>

        {/* lastname */}
        <div>
          <label htmlFor="lastname" className="block text-black">
            Last Name
          </label>
          <input type="text" name="lastname" id="lastname" className="block border-gray-400 border-2" placeholder="Doe" onChange={handleChange} value={lastname} />
        </div>

        {/* email */}
        <div>
          <label htmlFor="email" className="block text-black">
            Email
          </label>
          <input type="email" name="email" id="email" className="block border-gray-400 border-2" placeholder="josh.doe@email.com" onChange={handleChange} value={email} />
        </div>

        {/* age range slider  */}
        <div>
          <label htmlFor="age" className="block text-black">
            Age
          </label>
          <input type="range" name="age" id="age" className="block border-gray-400 border-2" min="0" max="100" onChange={handleChange} value={age} />
        </div>

        {/* photo */}
        <div>
          <label htmlFor="photo" className="block text-black">
            Photo
          </label>
          <input type="file" name="photo" id="photo" className="block border-gray-400 border-2" onChange={handleChange} value={photo} />
        </div>

        {/* date */}
        <div>
          <label htmlFor="date" className="block text-black">
            Date
          </label>
          <input type="date" name="date" id="date" className="block border-gray-400 border-2" onChange={handleChange} value={date} />
        </div>

        {/* submit */}
        <div>
          <button type="submit" className="block bg-blue-500 text-white">
            Send Application
          </button>
        </div>
      </form>

      <pre>
        <code>{JSON.stringify(formInfo, null, 2)}</code>
      </pre>
    </>
  );
};
