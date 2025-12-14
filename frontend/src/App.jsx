import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import RiesgoList from "./components/RiesgoList";
import RiesgoForm from "./components/RiesgoForm";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/riesgos" element={<RiesgoList />} />
          <Route path="/nuevo" element={<RiesgoForm />} />
          <Route path="/editar/:id" element={<RiesgoForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
