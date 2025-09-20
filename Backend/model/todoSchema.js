import mongoose from "mongoose";

 const todoSchema = new mongoose.Schema( {
    task: {
        type: String,
        required: true
      }
      ,
      completed: {
        type: Boolean,
        default: false
      }
});

export const Todo = mongoose.model("Todo", todoSchema);
