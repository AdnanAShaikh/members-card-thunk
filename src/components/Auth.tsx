import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { ReactNode, useEffect } from "react";

interface Auth {
  children: ReactNode;
}

const Auth: React.FC<Auth> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLogin = !!localStorage.getItem("isLogin");

    if (!isLogin) {
      message.error("Log in please!");
      navigate("/"); // Redirect the user
    }
  }, [navigate]);

  const isLogin = !!localStorage.getItem("isLogin");

  if (isLogin) {
    return children;
  }

  return null;
};

export default Auth;
