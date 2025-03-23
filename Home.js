import { useNavigate } from "react-router-dom";
import React from "react";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="App">
        <h1 className="text-4xl font-bold text-blue-500">Tailwind is Working!</h1>
      <h1>Welcome to MapMyClass</h1>
      <h2>Navigate Your Campus</h2>
      <button className="button" onClick={() => navigate("/form")}>
        Get Started
      </button>
    </div>
    
  );
}

export default Home;
