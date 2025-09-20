import { useState, useRef, useEffect } from "react";
import styles from "./App.module.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {db} from "./Firebase.jsx";
import { doc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore"; 

function App() {
  let [inputValue, setinputValue] = useState("");
  let [tasks, settasks] = useState([]);
  let [editIndex, setEditIndex] = useState(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "Tasks"));
      const todosArray = [];

      querySnapshot.forEach((doc) => {
        todosArray.push({ id: doc.id, ...doc.data() });
      });

      settasks(todosArray);
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

  let add = async() => {
    const capitalizedTask = capitalizeFirstLetter(inputValue.trim());

    // if(editIndex!==null) {
    //   const updatedTasks = [...tasks];
      
    //   updatedTasks[editIndex] = capitalizedTask;
    //   settasks(updatedTasks);
    //   setEditIndex(null)
    // } else {
    // settasks([...tasks,capitalizedTask]);
    // }

    // setinputValue("");

    // let dynamicID = Math.round(Math.random()*511546).toString();

    // let saveData = await setDoc(doc(db, "Tasks", dynamicID), {task: capitalizedTask, id: dynamicID});
    // console.log(saveData);

    if(editIndex!==null) {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex].task = capitalizedTask;
    
      settasks(updatedTasks);
      setEditIndex(null);
    
      await setDoc(doc(db, "Tasks", updatedTasks[editIndex].id), {
        task: capitalizedTask,
        id: updatedTasks[editIndex].id
      });
      setinputValue("");
    } else {
      let dynamicID = Math.round(Math.random()*511546).toString();
    
      const newTask = { task: capitalizedTask, id: dynamicID };
    
      settasks([...tasks, newTask]);
    
      await setDoc(doc(db, "Tasks", dynamicID), newTask);
      setinputValue("");
    }
    
    
  }

  let del = async (i) => {
    const taskToDelete = tasks[i];
    const updatedTasks = tasks.filter((_, index) => index !== i);
    settasks(updatedTasks);
    await deleteDoc(doc(db, "Tasks", taskToDelete.id));
  }
  

  useEffect(() => {
    if (editIndex !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editIndex]);

  let update = (i) => {
    setinputValue(tasks[i].task); 
    setEditIndex(i);
  }
  

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
            }
          }}
        />
        <Button
          variant="contained"
          onClick={add}
          className={styles.addBtn}
         
        >
          +
        </Button>
      </Box>

      <Box>
        <ul className={styles.list}>
        {tasks.map((e, i) => (
  <li key={e.id} className={styles.li}>
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
