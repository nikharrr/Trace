
import "./App.css";
import { useState } from "react";
import IntroVideo from "./components/IntroVideo";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";


function App() {
  const [showIntro, setShowIntro] = useState(true);

  const handleVideoEnd = () => {
    setShowIntro(false);
  };


  if (showIntro) {
    return <IntroVideo onEnded={handleVideoEnd} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
