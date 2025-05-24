import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Notebook from "./components/Notebook";
import ViewNotes from "./components/ViewNotes";

function App() {
  return (
    <Router>
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

      <Routes>
        <Route path="/" element={<ViewNotes />} />
        <Route path="/add-notes" element={<Notebook />} />
        <Route
          path="*"
          element={<h2 className="text-center">404: Page Not Found</h2>}
        />
      </Routes>
    </Router>
  );
}

export default App;
