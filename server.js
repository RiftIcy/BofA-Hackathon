const express = require("express");
const cors = require("cors");
const { Class, schedules, saveSchedules } = require("./schedule");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/add-class", (req, res) => {
  const { className, building, startTime, days, reminder, reminderTime } = req.body;

  if (!className || !building || !startTime || !Array.isArray(days)) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newClass = new Class(className, building, startTime, days, reminder, reminderTime);
  schedules.push(newClass);
  saveSchedules();

  res.status(201).json({ message: "Class added!" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

console.log("Saving new class:", newClass);
