import "./App.css";
import { Route, Routes } from "react-router";
import Welcome from "./pages/Welcome";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
    </Routes>
  );
}

export default App;
