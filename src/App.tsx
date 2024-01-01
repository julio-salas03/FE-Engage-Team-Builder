import { createSignal } from "solid-js";

function App() {
  const [count, setCount] = createSignal(0);

  return (
    <>
      <p>count: {count()}</p>
      <button
        class="px-50 bg-blue-500 text-red-500"
        onclick={() => setCount((prev) => prev + 1)}
      >
        update
      </button>
    </>
  );
}

export default App;
