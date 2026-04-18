
import "./App.css";
import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AppLayout from "./layouts/AppLayout";
import IntroVideo from "./components/IntroVideo";

function App() {
  const [showIntro, setShowIntro] = useState(
    () => sessionStorage.getItem("intro_seen") !== "true"
  );

  const handleIntroEnd = () => {
    sessionStorage.setItem("intro_seen", "true");
    setShowIntro(false);
  };

  if (showIntro) {
    return <IntroVideo onEnded={handleIntroEnd} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
         
        <Route element={<AppLayout />}>
           <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/profile" element={<Profile />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
