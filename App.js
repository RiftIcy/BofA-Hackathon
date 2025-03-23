import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import ScheduleForm from "./ScheduleForm";
import Home from "./Home";
import GPSMap from "./GPSMap"; // ✅ Import GPS Map page

const APIkey = "9342~WUmPCFTzWRnC9PvFm44BUGKR7M3UYUABQBXCnyUPftC4K6Z7ewku2QKXmuNC6VfU"
const CLIENT_ID = "YOUR_CANVAS_CLIENT_ID";
const REDIRECT_URI = "http://localhost:3000/callback";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />  {/* Home Page */}
        <Route path="/form" element={<ScheduleForm />} />  {/* Form Page */}
        <Route path="/map" element={<GPSMap />} />  {/* Map Page */}
      </Routes>
    </Router>
  );
}

export default App;
