import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 className="text-3xl font-bold underline">Tailwind is added!</h1>

      <h2>
        <a href="https://christmas-form.netlify.app/">https://christmas-form.netlify.app/</a>
      </h2>

      <h3>Vite + React + Typescript</h3>

      <div>
        <button className="border" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
}

export default App;
