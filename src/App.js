import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Product from './components/Productfetch/product'; // Ensure the path is correct
import './App.css';
import AddProduct from "./components/AddProduct/AddProduct";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Product />} />
          <Route path="/add-product" element={<AddProduct />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
