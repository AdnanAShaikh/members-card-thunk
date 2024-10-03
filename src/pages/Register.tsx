import { Col, Input, Form, Row, Typography, message, Button } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

interface Register {
  username: string;
  password: string;
}

const Register: React.FC = () => {
  const [user, setUser] = useState<Register>({
    username: "hello1",
    password: "",
  });
  const navigate = useNavigate();

  localStorage.removeItem("isLogin");

  const handleSubmit = async () => {
    try {
      if (user.username !== "" && user.password !== "") {
        const res = await axios.put("http://localhost:3000/profile", {
          name: user.username,
          password: user.password,
        });

        if (res.status === 200) {
          message.success("Successfully Registered !");
          setUser({ username: "", password: "" });
          navigate("/");
        } else {
          message.error("Registration Unsuccessful!");
        }
      } else {
        message.error("Fill all details !");
      }
    } catch (error) {
      message.error("Internal Server Error");
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  return (
    <Row className="min-h-screen" style={{ backgroundColor: "#f9f9f9" }}>
      <Col
        xs={0}
        md={12}
        style={{ backgroundColor: "#f9f9f9", position: "relative" }}
      >
        {" "}
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="https://plus.unsplash.com/premium_photo-1668073437337-5734dc7ef812?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHdoaXRlJTIwYWVzdGhldGljfGVufDB8fDB8fHww"
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
      <Col xs={24} md={12} className="flex justify-center items-center px-5 ">
        <div style={{ maxWidth: 400, width: "100%" }}>
          <Title level={1}>Register</Title>
          <Text>Register to open a brand new world!</Text>

          <Form
            name="login"
            layout="vertical"
            className="mt-4"
            onFinish={handleSubmit}
            initialValues={user}
          >
            <Form.Item
              label="Username*"
              name="username"
              rules={[
                { required: true, message: "Please enter your username!" },
              ]}
            >
              <Input
                name="username"
                placeholder="John Doe"
                size="large"
                value={user.username}
                onChange={handleChange}
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
                size="large"
                value={user.password}
                onChange={handleChange}
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
                Register
              </Button>
            </Form.Item>
          </Form>

          <Link to="/">Already a User ? Login</Link>
        </div>
      </Col>
    </Row>
  );
};

export default Register;
