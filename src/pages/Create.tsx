import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Steps,
  Upload,
} from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPostApi } from "../redux/postSlice";
import type { AppDispatch } from "../redux/store";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Step } = Steps;

interface Data {
  fname: string;
  lname: string;
  gender: string;
  dob: string;
  interests: string | string[];
  email: string;
  phone: string;
  address: string;
  pincode: string;
  image: string;
  region: string;
}

const Create: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const [data, setData] = useState<Data>({
    fname: "",
    lname: "",
    gender: "",
    dob: "",
    interests: [],
    email: "",
    phone: "",
    address: "",
    pincode: "",
    image: "",
    region: "",
  });

  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    console.log(e.target.value);
  };
  const handleGenderChange = (e: RadioChangeEvent) => {
    const selectedGender = e.target.value;
    setData({ ...data, gender: selectedGender });
    console.log(e.target.value);
  };

  const handleCheckBox = (checkedValues: string) => {
    setData({ ...data, interests: checkedValues });
    console.log(checkedValues);
  };

  const handleDateChange = (e) => {
    if (e) {
      const date = e.format("DD-MM-YYYY");
      setData({ ...data, dob: date });
      console.log(e.target.value);
    }
  };

  const handleDropDownChange = (e: string) => {
    setData({ ...data, region: e });
  };

  console.log(data);

  // ************ Form onFinish handlers ********

  const isValidPhone = /^\d+$/.test(data.phone);
  const isValidPin = /^\d+$/.test(data.pincode);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailPattern.test(data.email);

  const onFinishFailed = async (errorInfo: any) => {
    message.error("Please fill out all Details !");
    console.log("Failed:", errorInfo);
  };

  const onFinish = async () => {
    try {
      const {
        fname,
        lname,
        gender,
        dob,
        interests,
        email,
        phone,
        address,
        pincode,
        region,
        image,
      } = data;

      if (
        !fname ||
        !lname ||
        !gender ||
        !dob ||
        !interests.length ||
        !isValidEmail ||
        !isValidPhone ||
        !address ||
        !isValidPin ||
        !region ||
        !image
      ) {
        message.error("Please Check your Inputs!");
        return;
      }
      const resultAction = await dispatch(createPostApi(data));
      if (createPostApi.fulfilled.match(resultAction)) {
        message.success("Form successfully created!");
        navigate("/dashboard");
      } else {
        return console.error("Failed to create post:", resultAction.payload);
      }
    } catch (err) {
      return console.error("Error dispatching createPostApi:", err);
    }
  };

  // ************* onFinish handlers over *******

  // **************File handlers**************

  const beforeUpload = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      message.success("File uploaded");
      setData({ ...data, image: reader.result as string }); // Set the Base64 string
    };
    reader.onerror = (error) => {
      console.log(error);
      message.error("Failed to convert file to Base64");
    };
    return false; // Prevent automatic upload
  };

  // ****************** FIle handlers over ***************

  //
  const options = [
    { label: "Frontend", value: "Front-End" },
    { label: "Backend", value: "Back-End" },
    { label: "Fullstack", value: "Full-Stack" },
  ];

  const steps = [
    {
      title: "General Details",
      content: (
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="First Name"
              name="fname"
              rules={[
                { required: true, message: "Please enter your first name!" },
              ]}
            >
              <Input
                placeholder="Enter your first name"
                name="fname"
                value={data.fname}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Last Name"
              name="lname"
              rules={[
                { required: true, message: "Please enter your last name!" },
              ]}
            >
              <Input
                placeholder="Enter your last name"
                name="lname"
                value={data.lname}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[
                { required: true, message: "Please select your gender!" },
              ]}
            >
              <Radio.Group value={data.gender} onChange={handleGenderChange}>
                <Radio value="Male">Male</Radio>
                <Radio value="Female">Female</Radio>
                <Radio value="Other">Other</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Date of Birth"
              name="dob"
              rules={[
                { required: true, message: "Please enter your date of birth!" },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                onChange={handleDateChange}
                placeholder="Enter your date of birth"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Your Interests"
              name="interests"
              rules={[
                {
                  required: true,
                  message: "Please select at least one interest!",
                },
              ]}
            >
              <Checkbox.Group options={options} onChange={handleCheckBox} />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      title: "Contact Details",
      content: (
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Please enter your email address!" },
                { type: "email", message: "The input is not a valid email!" },
              ]}
            >
              <Input
                placeholder="Enter your Email Address"
                name="email"
                value={data.email}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Phone Number (include country code)"
              name="phone"
              rules={[
                { required: true, message: "Please enter your phone number!" },
                {
                  pattern: /^[0-9]+$/,
                  message: "Please enter a valid phone number (digits only)!",
                },
              ]}
            >
              <Input
                placeholder="+91XXXXXXXXXX"
                name="phone"
                value={data.phone}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Address"
              name="address"
              rules={[
                { required: true, message: "Please enter your address!" },
              ]}
            >
              <Input.TextArea
                name="address"
                placeholder="Enter your address"
                rows={4}
                value={data.address}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Pin Code"
              name="pinCode"
              rules={[
                {
                  required: true,
                  message: "Please enter your area’s Pin Code!",
                },
              ]}
            >
              <Input
                placeholder="Enter your area’s Pin Code"
                name="pincode"
                value={data.pincode}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      title: "Finishing Up...",
      content: (
        <Row>
          <Col xs={24} md={12}>
            <Form.Item
              label="Profile Image"
              name="profileImage"
              valuePropName="fileList"
              getValueFromEvent={({ fileList }) => fileList}
              rules={[
                {
                  required: true,
                  message: "Please upload your profile image!",
                },
              ]}
            >
              <Upload
                beforeUpload={beforeUpload}
                maxCount={1}
                listType="picture"
                showUploadList={true}
              >
                <Button icon={<UploadOutlined />}>Upload Profile Image</Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Choose Your Region"
              name="region"
              rules={[
                { required: true, message: "Please select your region!" },
              ]}
            >
              <Select
                placeholder="Select your region"
                onChange={handleDropDownChange}
              >
                <Option value="Southern">Southern </Option>
                <Option value="Northern">Northern </Option>
                <Option value="Eastern">Eastern </Option>
                <Option value="Western">Western </Option>
                <Option value="Middle">Middle </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      title: "Confirmation",
      content: (
        <div style={{ textAlign: "center" }}>
          <h3>Review your details before submitting</h3>
          <p>Make sure all the information is correct.</p>
        </div>
      ),
    },
  ];

  // ********** return() ***************

  return (
    <div className="container p-4 sm:p-10 lg:px-44 md:mx-auto ">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold">
        Form Details
      </h1>
      <Form
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Steps current={current} className="w-full">
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>

        <div className="mt-10 ">{steps[current].content}</div>

        <div className="mt-10">
          {" "}
          {current > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
              Previous
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          )}
          {current < steps.length - 1 && current !== 0 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === 0 && (
            <div className="flex gap-5">
              <Button
                type="text"
                onClick={() => {
                  navigate("/dashboard");
                }}
              >
                Back
              </Button>
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            </div>
          )}
        </div>
      </Form>
    </div>
  );
};

export default Create;
