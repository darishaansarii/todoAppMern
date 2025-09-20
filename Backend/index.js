import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {Todo} from "./model/todoSchema.js"

const PORT = 4000;
const app = express();
app.use(cors());
app.use(express.json());

const Mongodb_Uri = "mongodb+srv://admin:admin@cluster0.qapekgq.mongodb.net/";

mongoose
  .connect(Mongodb_Uri)
  .then(() => console.log("Mongodb connected..."))
  .catch((err) => console.log(err));

app.get("/todos", async (req, res)=> {
    const todos = await Todo.find();
    res.json({
        todos: todos
    });
})

app.post("/todos", async (req,res)=>{
    const {task} = req.body;
    const newTodo = new Todo({task});

    await newTodo.save();

    res.json({
        message: "Task added successfully...",
        task: newTodo.task
    })
});

app.put("/todos/:id", async (req, res) => {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTodo);
  });
  
  app.delete("/todos/:id", async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted" });
  });

app.get("/", (req, res) => {
  res.json({
    message: "Server start...",
    status: true,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
