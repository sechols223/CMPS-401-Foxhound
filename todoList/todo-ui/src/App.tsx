import { useEffect, useState } from "react";
import "@mantine/core/styles.css";
import {
  Loader,
  Button,
  MantineProvider,
  Table,
  Container,
  Text,
} from "@mantine/core";
import { ModalsProvider, openConfirmModal } from "@mantine/modals";

interface Task {
  ID: number; //having this as id does not work gorm is defining it as ID and it will not recognize it for some reason
  title: string;
  done: boolean;
}

interface TaskDto {
  title: string;
  done: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>();

  const openDeleteModal = (taskId: number) => {
    openConfirmModal({
      title: "Delete Task?",
      children: (
        <Text size="sm">Are you sure you want to delete this task?</Text>
      ),
      labels: { cancel: "Cancel", confirm: "Delete" },
      confirmProps: { color: "red" },
      cancelProps: { color: "blue", variant: "outline" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => deleteTask(taskId),
    });
  };

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
        <Container>
          <ModalsProvider>
            <Button onClick={() => createTask({ title: "test", done: false })}>
              Create (remove later)
            </Button>
            <Table striped withColumnBorders withTableBorder>
              {tasks.map((task) => {
                return (
                  <Table.Tr key={task.ID}>
                    <Table.Td>
                      <Button color="green">Complete</Button>
                    </Table.Td>
                    <Table.Td>{task.title}</Table.Td>
                    <Table.Td>
                      <Button
                        onClick={() => openDeleteModal(task.ID)}
                        color="red"
                      >
                        Delete
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table>
          </ModalsProvider>
        </Container>
      ) : (
        <div
          style={{
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
