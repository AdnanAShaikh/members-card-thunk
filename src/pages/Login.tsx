import { useEffect, useState } from "react";

import { message, Button, Row, Col, Form, Input } from "antd";
import { Typography } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
const { Title, Text } = Typography;

interface Login {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [user, setUser] = useState<Login>({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("isLogin");
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prevInputs) => ({
      ...prevInputs,
      [e.target.name]: e.target.value,
    }));
  };

  // =======================
  //         Submit
  // =======================
  const handleSubmit = async () => {
    try {
      if (!user.username || !user.password) {
        return message.error("Fill all details!");
      }
      const res = await axios.get("http://localhost:3000/profile");
      const data = res.data;
      if (
        res.status === 200 &&
        data.name === user.username &&
        data.password === user.password
      ) {
        message.success("Login Success!");
        localStorage.setItem("isLogin", "true");
        setUser({ username: "", password: "" });
        navigate("/dashboard");
      } else {
        message.error("No Such User !");
      }
    } catch (error) {
      message.error("Internal Server Error !");

      setUser({ username: "", password: "" });

      return console.log(error);
    }
  };

  return (
    <Row className="min-h-screen" style={{ backgroundColor: "#f9f9f9" }}>
      <Col xs={24} md={12} className="flex justify-center items-center px-5 ">
        <div style={{ maxWidth: 400, width: "100%" }}>
          <Title level={1}>Login</Title>
          <Text>See your growth and get consulting support!</Text>

          <Form
            name="login"
            layout="vertical"
            className="mt-4"
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Username*"
              name="username"
              rules={[{ required: true, message: "Please enter your email!" }]}
            >
              <Input
                name="username"
                placeholder="John Doe"
                value={user.username}
                onChange={handleChange}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Password*"
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password
                name="password"
                placeholder="Password"
                value={user.password}
                onChange={handleChange}
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                style={{ borderRadius: "8px" }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          <Link to="/register">Not a User? Register</Link>
        </div>
      </Col>

      <Col
        xs={0}
        md={12}
        style={{ backgroundColor: "#f9f9f9", position: "relative" }}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1621255619930-739359991b1b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHdoaXRlJTIwYWVzdGhldGljfGVufDB8fDB8fHww"
            alt="Login Illustration"
            style={{
              maxWidth: "55%",
              height: "auto",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
        </div>
      </Col>
    </Row>
  );
};

export default Login;
