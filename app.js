const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/studentDB")
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });

// Student Schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  course: {
    type: String,
    required: true
  },

  grade: {
    type: String,
    required: true
  }
});

// Student Model
const Student = mongoose.model("Student", studentSchema);


// CREATE
app.post("/students", async (req, res, next) => {
  try {
    const student = new Student(req.body);
    const savedStudent = await student.save();

    res.status(201).json(savedStudent);
  } catch (error) {
    next(error);
  }
});


// READ
app.get("/students", async (req, res, next) => {
  try {
    const students = await Student.find();

    res.json(students);
  } catch (error) {
    next(error);
  }
});


// UPDATE
app.put("/students/:id", async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json(student);
  } catch (error) {
    next(error);
  }
});


// DELETE
app.delete("/students/:id", async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json({
      message: "Student deleted successfully"
    });
  } catch (error) {
    next(error);
  }
});


// Error Handling Middleware
app.use((error, req, res, next) => {
  console.error(error.message);

  res.status(500).json({
    message: "Something went wrong",
    error: error.message
  });
});


// Start Server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});