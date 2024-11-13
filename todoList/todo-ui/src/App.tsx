import { useEffect, useState } from "react";
import "@mantine/core/styles.css";
import { Loader, Flex, MantineProvider } from "@mantine/core";

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
  const [tasks, setTasks] = useState<Task[]>();

  const fetchTasks = async () => {
    const response = await fetch("http://localhost:8080/tasks");
    const data = await response.json();
    setTasks(data);
  };

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
    <MantineProvider forceColorScheme="dark">
      {tasks ? (
        <Flex justify="center">
          <h1>{tasks[0].title}</h1>
        </Flex>
      ) : (
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader />
        </div>
      )}
    </MantineProvider>
  );
}

export default App;
