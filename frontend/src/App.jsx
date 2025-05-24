import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Notebook from "./components/Notebook";
import ViewNotes from "./components/ViewNotes";
import "./App.css"; // Import custom CSS

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
          <div className="container">
            <Link className="navbar-brand" to="/">
              Notebook
            </Link>
            <div className="d-flex">
              <Link className="btn btn-outline-primary me-2" to="/">
                View Notes
              </Link>
              <Link className="btn btn-outline-primary" to="/add-notes">
                Add Notes
              </Link>
            </div>
          </div>
        </nav>

        <div className="container mb-5 flex-grow-1">
          <Routes>
            <Route path="/" element={<ViewNotes />} />
            <Route path="/add-notes" element={<Notebook />} />
            <Route
              path="*"
              element={<h2 className="text-center">404: Page Not Found</h2>}
            />
          </Routes>
        </div>

        <footer className="bg-dark text-white text-center py-3 mt-auto">
  <div className="container">
    <p className="mb-1">Website developed by Jikson Mathew</p>
    <p className="mb-1">
      Email: <a href="mailto:jiksonmathew14@gmail.com" className="text-white text-decoration-none">jiksonmathew14@gmail.com</a> | 
      Phone: <a href="tel:9526121657" className="text-white text-decoration-none ms-1">9526121657</a>
    </p>
    <p className="mb-0">© {new Date().getFullYear()} All rights reserved.</p>
  </div>
</footer>
      </div>
    </Router>
  );
}

export default App;
