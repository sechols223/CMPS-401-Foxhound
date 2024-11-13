import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

interface Task {
  ID: number;
  title: string;
  done: boolean;
}

interface TaskDto {
  title: string;
  done: boolean;
}

function App() {
  const [count, setCount] = useState(0);
  const [tasks, setTasks] = useState<Task[]>();

  const fetchTasks = async () => {
    const response = await fetch("http://localhost:8080/tasks");
    const data = await response.json();
    setTasks(data);
  };

  async function fetchTask(id: number): Promise<Task> {
    const response = await fetch(`http://localhost:8080/tasks/${id}`);
    const data = await response.json();
    return data;
  }

  async function editTask(id: number, task: TaskDto) {
    const response = await fetch(`http://localhost:8080/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(task),
    });
    if (response.ok) {
      await fetchTasks();
    }
  }

  const createTask = async (task: TaskDto) => {
    const response = await fetch("http://localhost:8080/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    });
    if (response.ok) {
      await fetchTasks();
    }
  };

  const deleteTask = async (id: number) => {
    const response = await fetch(`http://localhost:8080/tasks/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      await fetchTasks();
    }
  };

  useEffect(() => {
    fetchTasks();
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
        <button
          onClick={() => createTask({ title: "this worked", done: false })}
        >
          muh fuckin' count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div>
        {tasks ? (
          tasks.map((task) => {
            return (
              <div key={task.ID}>
                <h2>
                  Task: {task.ID} {task.title}
                </h2>
              </div>
            );
          })
        ) : (
          <></>
        )}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
