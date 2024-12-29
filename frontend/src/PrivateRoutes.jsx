import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { AuthContext } from "./context/AuthContext";
const PrivateRoutes = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (!authContext.isUserAuth) return navigate("/welcome");
  }, [authContext.isUserAuth]);
  return <Outlet />;
};

export default PrivateRoutes;
