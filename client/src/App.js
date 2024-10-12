import {Routes, Route } from "react-router-dom";
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from "./pages/Signup";
import AboutUs from "./pages/AboutUs";

const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/about" element={<AboutUs/>}/>
    </Routes>
    </>
      );
};

export default App;
