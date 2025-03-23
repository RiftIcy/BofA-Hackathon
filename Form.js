import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

function FormPage() {
  const navigate = useNavigate();
  const [course, setCourse] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", course);
    navigate("/gps"); // ✅ Redirect to the Map page after submitting
  };

  return (
    <div className="App">
      <h1>Enter Course Details</h1>
      <form onSubmit={handleSubmit}>
        <label>Course Name:</label>
        <input
          type="text"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          placeholder="Enter Course Name"
        />
        <button type="submit">Find Location</button>
      </form>
    </div>
  );
}

export default FormPage;
