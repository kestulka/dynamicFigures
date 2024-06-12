import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import Square from "./components/Square";
import FloorPlanEditor from "./components/FloorPlanEditor";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <button>
            <Link to="/square">Square</Link>
          </button>
          <button>
            <Link to="/figure-drawer">Figure Drawer</Link>
          </button>
        </nav>
        <Routes>
          <Route path="/square" element={<Square />} />
          <Route path="/figure-drawer" element={<FloorPlanEditor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
