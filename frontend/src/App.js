import React from 'react';
import Home from './Pages/Home/Home.js';
import Navbar from './Components/Navbar/Navbar.js';
import Footer from './Components/Footer/Footer.js';
import './App.css';

function App() {
  return (
    <div className="App">
    <Navbar />
    <Home />
    <Footer />
  </div>

  );
}

export default App;
