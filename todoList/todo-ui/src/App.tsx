import { useEffect, useState } from "react";
import "@mantine/core/styles.css";
import {
  Loader,
  Button,
  MantineProvider,
  Table,
  Text,
  TextInput,
  Modal,
  Space,
} from "@mantine/core";
import { ModalsProvider, openConfirmModal } from "@mantine/modals";
import { useForm } from "@mantine/form";

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
  const [editRow, setEditRow] = useState(false);
  const [editTaskId, setEditTaskId] = useState(0);

  const [incompleteTasks, setIncompleteTasks] = useState<Task[]>();
  const [completeTasks, setCompleteTasks] = useState<Task[]>();

  const editButton = (id: number) => {
    setEditTaskId(id);
    setEditRow(!editRow);
  };

  const mantineForm = useForm<TaskDto>({
    initialValues: {
      title: "",
      done: false,
    },
  });

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
    //setTasks(data);
    setIncompleteTasks(data.filter((task: Task) => !task.done));
    setCompleteTasks(data.filter((task: Task) => task.done));
  };

  const editTask = async (task: TaskDto) => {
    const response = await fetch(`http://localhost:8080/tasks/${editTaskId}`, {
      method: "PATCH",
      body: JSON.stringify(task),
    });
    if (response.ok) {
      setEditRow(!editRow);
      await fetchTasks();
    }
  };

  const toggleComplete = async (task: Task) => {
    task.done = !task.done;
    const response = await fetch(`http://localhost:8080/tasks/${task.ID}`, {
      method: "PATCH",
      body: JSON.stringify(task),
    });
    if (response.ok) {
      await fetchTasks();
    }
  };

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
      <>
        {incompleteTasks ? (
          <ModalsProvider>
            <Button onClick={() => createTask({ title: "test", done: false })}>
              Create (remove later)
            </Button>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div style={{ width: "45%" }}>
                <Table striped withColumnBorders withTableBorder>
                  <Table.Tbody>
                    {incompleteTasks?.map((task) => {
                      return (
                        <Table.Tr key={task.ID}>
                          <Table.Td>
                            <Button
                              color="green"
                              onClick={() => toggleComplete(task)}
                            >
                              Complete
                            </Button>
                          </Table.Td>

                          <Table.Td>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              {task.title}
                              <Button onClick={() => editButton(task.ID)}>
                                Edit
                              </Button>
                            </div>
                          </Table.Td>

                          <Table.Td>
                            <Button
                              onClick={() => openDeleteModal(task.ID)}
                              color="red"
                            >
                              Delete
                            </Button>
                          </Table.Td>

                          <Modal
                            opened={editRow}
                            onClose={() => {
                              setEditRow(!editRow);
                            }}
                            title="Edit Task"
                            centered
                          >
                            <form onSubmit={mantineForm.onSubmit(editTask)}>
                              <div>
                                <TextInput
                                  {...mantineForm.getInputProps("title")}
                                  placeholder={task.title}
                                  label="task"
                                  withAsterisk
                                />
                              </div>
                              <Space h={18} />
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Button
                                  onClick={() => setEditRow(!editRow)}
                                  variant="outline"
                                >
                                  Cancel
                                </Button>
                                <Button type="submit">Submit</Button>
                              </div>
                            </form>
                          </Modal>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </div>
              <div style={{ width: "45%" }}>
                <Table withColumnBorders withTableBorder striped width={200}>
                  <Table.Tbody>
                    {completeTasks?.map((task) => {
                      return (
                        <Table.Tr key={task.ID}>
                          <Table.Td>
                            <Button onClick={() => toggleComplete(task)}>
                              Return
                            </Button>
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
                  </Table.Tbody>
                </Table>
              </div>
            </div>
          </ModalsProvider>
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
      </>
    </MantineProvider>
  );
}

export default App;
