// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Mongoose Schema
const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  course: String,
});

const Student = mongoose.model("Student", studentSchema);

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/register", async (req, res) => {
  const { name, email, course } = req.body;
  await Student.create({ name, email, course });
  res.redirect("/students");
});

app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.render("students", { students });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
