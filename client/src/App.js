import {Routes, Route } from "react-router-dom";
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from "./pages/Signup";
import AboutUs from "./pages/AboutUs";
import Footer from "./pages/Footer";

const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/about" element={<AboutUs/>}/>

    </Routes>
    <Footer/>
    </div>
      );
};

export default App;
