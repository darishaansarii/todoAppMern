import { useState, useRef, useEffect } from "react";
import styles from "./App.module.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const API_URL = "https://todo-app-mern-sigma.vercel.app/todos";

function App() {
  let [inputValue, setinputValue] = useState("");
  let [tasks, settasks] = useState([]);
  let [editIndex, setEditIndex] = useState(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        settasks(data.todos || []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchData();
  }, []);

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  let handleChange = (e) => {
    setinputValue(e.target.value);
  };

  let add = async () => {
    const capitalizedTask = capitalizeFirstLetter(inputValue.trim());
    if (!capitalizedTask) return;

    if (editIndex !== null) {
      const taskToUpdate = tasks[editIndex];

      try {
        const res = await fetch(`${API_URL}/${taskToUpdate._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task: capitalizedTask }),
        });
        const updatedTask = await res.json();

        const updatedTasks = [...tasks];
        updatedTasks[editIndex] = updatedTask;
        settasks(updatedTasks);
        setEditIndex(null);
        setinputValue("");
      } catch (err) {
        console.error("Error updating task:", err);
      }
    } else {
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task: capitalizedTask }),
        });
        const newTask = await res.json();

        settasks([...tasks, newTask]);
        setinputValue("");
      } catch (err) {
        console.error("Error adding task:", err);
      }
    }
  };

  let del = async (i) => {
    const taskToDelete = tasks[i];
    try {
      await fetch(`${API_URL}/${taskToDelete._id}`, {
        method: "DELETE",
      });
      const updatedTasks = tasks.filter((_, index) => index !== i);
      settasks(updatedTasks);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  useEffect(() => {
    if (editIndex !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editIndex]);

  let update = (i) => {
    setinputValue(tasks[i].task);
    setEditIndex(i);
  };

  return (
    <>
      <Box className={styles.container}>
        <h1 className={styles.h1}>Todo App</h1>
        <Box className={styles.box}>
          <TextField
            autoComplete="off"
            className={styles.inputField}
            inputRef={editInputRef}
            value={inputValue}
            label="Task"
            variant="outlined"
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                add();
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
              },
              "& .MuiOutlinedInput-input": {
                backgroundColor: "white",
              },
            }}
          />
          <Button variant="contained" onClick={add} className={styles.addBtn}>
            +
          </Button>
        </Box>

        <Box>
          <ul className={styles.list}>
            {tasks.map((e, i) => (
              <li key={e._id} className={styles.li}>
                {e.task}
                <Box className={styles.iconContainer}>
                  <Button
                    variant="contained"
                    onClick={() => del(i)}
                    className={styles.delBtn}
                  >
                    <DeleteIcon style={{ fontSize: "1rem" }} />
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => update(i)}
                    className={styles.updateIcon}
                  >
                    <EditIcon style={{ fontSize: "1rem" }} />
                  </Button>
                </Box>
              </li>
            ))}
          </ul>
        </Box>
      </Box>
    </>
  );
}

export default App;
