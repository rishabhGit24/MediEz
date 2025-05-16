import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import PatientPortal from "./Components/RecentlyVisitedDoctors"; // New component for patient portal
import Details from "./Pages/Details";
import Home from "./Pages/Home";
import LoginPage from "./Pages/Login";
import Recorder from "./Pages/Recorder";
import RegisterPatient from "./Pages/RegisterPatient";
import Report from "./Pages/Report";
import { useAuthContext } from "./utils/authContext";

const App = () => {
  const { authUser } = useAuthContext();
  useEffect(() => {
    const cleanup = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("recordedAudio");
      localStorage.removeItem("pid");
    };

    window.addEventListener("beforeunload", cleanup);

    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, []);
  console.log("auth", authUser);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={authUser ? <Home /> : <LoginPage />} />
        <Route
          path="/patient"
          element={authUser ? <Details /> : <LoginPage />}
        />
        <Route
          path="/registerPatient"
          element={authUser ? <RegisterPatient /> : <LoginPage />}
        />
        <Route
          path="/record"
          element={authUser ? <Recorder /> : <LoginPage />}
        />
        <Route path="/report" element={authUser ? <Report /> : <LoginPage />} />

        <Route
          path="/patientportal"
          element={authUser ? <PatientPortal /> : <LoginPage />}
        />

        {/* New route for patient portal */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
