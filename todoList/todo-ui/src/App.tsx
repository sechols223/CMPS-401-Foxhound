import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

interface Task {
  id: number;
  title: string;
  done: boolean;
}

async function fetchTasks(): Promise<Task[]> {
  const response = await fetch('http://localhost:8080/tasks');
  const data = await response.json();
  return data;
}

function App() {
  const [count, setCount] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(()=> {
    fetchTasks().then((data) => setTasks(data));
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Test this bomb ass Vite + React setup please!</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          muh fuckin' count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div>
      {tasks.map((task) => (
        <div key={task.id}>
          <h2>Task: {task.title}</h2>
        </div>
      ))}
    </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
