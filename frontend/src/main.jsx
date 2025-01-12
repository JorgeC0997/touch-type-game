import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { ExerciseContextProvider } from "./context/ExerciseContext.jsx";
import { AccountContextProvider } from "./context/AccountContext.jsx";
import { ModalContextProvider } from "./context/ModalContext.jsx";
import { ScoreContextProvider } from "./context/ScoreContext.jsx";
import { UserContextProvider } from "./context/UserContext.jsx";
import { NotificationContextProvider } from "./context/NotificationContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <NotificationContextProvider>
      <UserContextProvider>
        <AuthContextProvider>
          <AccountContextProvider>
            <ScoreContextProvider>
              <ExerciseContextProvider>
                <ModalContextProvider>
                  <App />
                </ModalContextProvider>
              </ExerciseContextProvider>
            </ScoreContextProvider>
          </AccountContextProvider>
        </AuthContextProvider>
      </UserContextProvider>
    </NotificationContextProvider>
  </BrowserRouter>
);
