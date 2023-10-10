import React, { useState } from "react";

export const Form = () => {
  const [formData, setFormData] = useState({
    username: "",
  });

  const { username } = formData;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <form className="p-3" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username" className="block text-black">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            autoComplete="username"
            className="block border-gray-400 border-2"
            placeholder="janesmith"
            onChange={handleChange}
            value={username}
          />
        </div>
      </form>

      <pre>
        <code>{JSON.stringify(formData, null, 2)}</code>
      </pre>
    </>
  );
};
