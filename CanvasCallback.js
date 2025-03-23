import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CanvasCallback() {
  const navigate = useNavigate(); // Used to move between pages

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code"); // Get the code from URL

    if (code) {
      axios
        .post("http://localhost:5000/get-access-token", { code }) // Backend request
        .then((res) => {
          console.log("User logged in!"); // Check if login works
          navigate("/form"); // 🚀 Redirect to the form page!
        })
        .catch((err) => console.error("Error getting token", err));
    }
  }, [navigate]);

  return (
    <div>
      <h2>Logging in...</h2>
      <p>Redirecting you to the form...</p>
    </div>
  );
}

export default CanvasCallback;
