import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";

import Home from "../pages/Home";
import LatestNews from "../pages/LatestNews";
import VerifyNews from "../pages/VerifyNews";
import Login from "../pages/Login";

function AppRoutes() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/latest-news" element={<LatestNews />} />
        <Route path="/verify-news" element={<VerifyNews />} />
        <Route path="/login" element={<Login />} />
      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;