import { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

interface RequireAdminProps {
  children: React.ReactNode;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || currentUser.role !== "Admin") {
      navigate("/home"); 
    }
  }, [currentUser, navigate]);

  return <>{currentUser?.role === "Admin" && children}</>;
};

export default RequireAdmin;
