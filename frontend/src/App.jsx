import { Route, Routes } from "react-router";
import Welcome from "./pages/Welcome";
import NavBar from "./components/navbar/NavBar";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Welcome />} />
      </Routes>
    </>
  );
}

export default App;
