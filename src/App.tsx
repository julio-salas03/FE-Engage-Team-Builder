import { createSignal } from 'solid-js'

function App() {
  const [count, setCount] = createSignal(0)

  return (
    <>
      <p>count: {count()}</p>
      <button onclick={() => setCount((prev) => prev + 1)}>update</button>
    </>
  )
}

export default App
