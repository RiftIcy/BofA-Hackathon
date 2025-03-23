import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { useNavigate } from "react-router-dom";

function ScheduleForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    className: "",
    building: "",
    startTime: "",
    days: [],
    reminder: false,
    reminderTime: 5,
  });

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "days") {
      const updatedDays = checked
        ? [...formData.days, value]
        : formData.days.filter((day) => day !== value);
      setFormData({ ...formData, days: updatedDays });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (name === "reminderTime") {
      setFormData({ ...formData, [name]: parseInt(value) }); // Ensure it's a number
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/add-class", formData);
      alert("✅ Class added successfully!");
      console.log(response.data);

      // Redirect to Map page after successful submission
      navigate("/map");
    } catch (error) {
      console.error("❌ Submission error:", error);
      alert("❌ Failed to add class. Please try again.");
    }
  };

  return (
    <div className="App">
      <h1>Enter Course Details</h1>
      <form onSubmit={handleSubmit}>
        <label>Course Name:</label>
        <input
          type="text"
          name="className"
          value={formData.className}
          onChange={handleChange}
          required
        />

        <label>Building:</label>
        <input
          type="text"
          name="building"
          value={formData.building}
          onChange={handleChange}
          required
        />

        <label>Start Time (e.g. 10:00 AM):</label>
        <input
          type="text"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
        />

        <label>Days:</label>
        <div className="checkbox-group">
          {weekdays.map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                name="days"
                value={day}
                checked={formData.days.includes(day)}
                onChange={handleChange}
              />
              {day}
            </label>
          ))}
        </div>

        <label>
          <input
            type="checkbox"
            name="reminder"
            checked={formData.reminder}
            onChange={handleChange}
          />
          Enable Reminder
        </label>

        {formData.reminder && (
          <>
            <label>Reminder Time (minutes before):</label>
            <select
              name="reminderTime"
              value={formData.reminderTime}
              onChange={handleChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={60}>60 (1 hour)</option>
            </select>
          </>
        )}

        <br />
        <button type="submit">Save Class</button>
      </form>
    </div>
  );
}

export default ScheduleForm;
