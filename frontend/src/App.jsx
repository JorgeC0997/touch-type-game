import { useContext } from "react";
import { Route, Routes } from "react-router";
import Welcome from "./pages/Welcome";
import NavBar from "./components/navbar/NavBar";
import Register from "./pages/Register";
import PrivateRoutes from "./PrivateRoutes";
import PracticeRoom from "./pages/PracticeRoom";
import Home from "./pages/Home";
import Modal from "./components/ui/Modal";
import { ModalContext } from "./context/ModalContext";

function App() {
  const modalContext = useContext(ModalContext);
  return (
    <div className="relative">
      <NavBar />
      {modalContext.isActive && <Modal>{modalContext.getContent()}</Modal>}
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="room/:roomId" element={<PracticeRoom />} />
          </Route>
        </Route>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
