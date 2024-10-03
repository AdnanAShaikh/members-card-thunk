import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Input,
  Layout,
  message,
  Modal,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Upload,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePostApi,
  fetchAllPosts,
  getPostById,
  updatePostApi,
} from "../redux/postSlice";
import type { AppDispatch, RootState } from "../redux/store";
import { Content, Header } from "antd/es/layout/layout";
import { BarsOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";

interface Post {
  // id: string;
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

const AllPosts: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  // edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [postIdForEdit, setPostIdForEdit] = useState("");
  // //

  // view modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [postIdForView, setPostIdForView] = useState("");
  // //

  // each post data
  const [newData, setNewData] = useState<Post>({
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

  // posts array
  const posts = useSelector((state: RootState) => state.posts.posts);

  // fill the posts array
  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  const handleDelete = (id: string, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    dispatch(deletePostApi(id));
  };

  const handleLogout = () => {
    const value = confirm("Do you want to Logout? ");
    if (value) {
      message.success("Logout Success!");
      localStorage.removeItem("isLogin");
      navigate("/");
    } else {
      message.info("You chose to remain logged in!");
    }
  };

  // view modal actions
  const showModal = (postId: string) => {
    setPostIdForView(postId);
    setIsViewModalOpen(true);
  };

  const handleOkViewModal = () => {
    setIsViewModalOpen(false);
  };

  const handleCancelViewModal = () => {
    setIsViewModalOpen(false);
  };
  //   // // //

  // ********************* */ edit modal **************/
  const showModalEditModal = (event: React.MouseEvent, postId: string) => {
    event.stopPropagation();
    setPostIdForEdit(postId);

    setTimeout(() => {
      setIsEditModalOpen(true);
    }, 50);
  };

  useEffect(() => {
    if (postIdForEdit !== "") {
      dispatch(getPostById(postIdForEdit));
    }
  }, [postIdForEdit]);

  const currentPost = useSelector(
    (state: RootState) => state.posts.currentPost
  );

  useEffect(() => {
    if (currentPost) {
      setNewData(currentPost);
    }
  }, [currentPost]);

  const handleCancelEditModal = () => {
    setIsEditModalOpen(false);
  };

  // ******* edit modal handlers effects end ************ //

  //  ************ on FInish handlers start ******************

  const handleSubmit = async () => {
    try {
      if (newData.phone) {
        const isValidPhone = /^\d+$/.test(newData.phone);
        if (!isValidPhone) {
          return message.error("Check your inputs!");
        }
      }

      if (newData.pincode) {
        const isValidPin = /^\d+$/.test(newData.pincode);
        if (!isValidPin) {
          return message.error("Check your inputs!");
        }
      }

      if (newData.email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailPattern.test(newData.email);
        if (!isValidEmail) {
          return message.error("Check your inputs!");
        }
      }

      await dispatch(
        updatePostApi({
          data: newData,
          id: postIdForEdit,
        })
      );
      message.success("Successfully updated!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating post:", error);
      message.error("Failed to update post.");
    }
  };

  // ************** edit functions *********************

  //******************* */ Handle Change ***************
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Input specific handlers

  const beforeUpload = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      message.success("File uploaded");
      setNewData({ ...newData, image: reader.result as string }); // Set the Base64 string
    };
    reader.onerror = (error) => {
      console.log(error);
      message.error("Failed to convert file to Base64");
    };
    return false; // Prevent automatic upload
  };

  const handleGenderChange = (e: RadioChangeEvent) => {
    const selectedGender = e.target.value;
    setNewData({ ...newData, gender: selectedGender });
    console.log(e.target.value);
  };

  const handleCheckBox = (checkedValues: string | string[]) => {
    setNewData({ ...newData, interests: checkedValues });
    console.log(checkedValues);
  };

  const handleDateChange = (e) => {
    if (e) {
      const date = e.format("DD-MM-YYYY");
      setNewData({ ...newData, dob: date });
      console.log(e.target.value);
    }
  };

  const handleDropDownChange = (e: string) => {
    setNewData({ ...newData, region: e });
  };

  // drop down UI

  const items = [
    {
      key: "1",
      label: (
        <Link to="/create">
          <Button type="text">+ New Member</Button>
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Button onClick={handleLogout} color="danger" variant="solid">
          Logout
        </Button>
      ),
    },
  ];

  const options = [
    { label: "Frontend", value: "Front-End" },
    { label: "Backend", value: "Back-End" },
    { label: "Fullstack", value: "Full-Stack" },
  ];

  //             return
  return (
    <Layout className="bg-white">
      <Header className="bg-gray-100">
        <div className="flex justify-between items-center">
          <a href="/dashboard">
            <p>Members</p>
          </a>
          <div className="">
            <Dropdown menu={{ items }} placement="bottomLeft">
              <Button>
                <BarsOutlined />
              </Button>
            </Dropdown>
          </div>
        </div>
      </Header>
      <Content>
        <h2 className="text-center text-4xl text-black underline font-thin mt-10 ">
          Meet our Team
        </h2>
        <Row gutter={16} justify="center" className="mx-auto ">
          {posts.map((post) => (
            <Col
              xs={24}
              sm={24}
              offset={1}
              md={12}
              lg={6}
              span={4}
              key={post.id}
            >
              <Card
                hoverable
                className="m-8  "
                bordered={false}
                actions={[
                  <EditOutlined
                    key="edit"
                    onClick={(e) => showModalEditModal(e, post.id)}
                  />,
                  <Button type="text" onClick={(e) => handleDelete(post.id, e)}>
                    ✖
                  </Button>,
                ]}
                onClick={() => showModal(post.id)}
                cover={
                  <img
                    alt="Uploaded"
                    src={post.image}
                    style={{ objectFit: "cover", height: "150px" }}
                  />
                }
              >
                <h3>{post.fname + " " + post.lname}</h3>
              </Card>
              {/************      EDIT MODAL      ************** */}
              <Modal
                title={`Edit: ${post.fname} ${post.lname}`}
                open={isEditModalOpen && post.id === postIdForEdit}
                onCancel={handleCancelEditModal}
                onOk={handleSubmit}
              >
                <Form
                  onFinish={handleSubmit}
                  initialValues={{
                    interests: newData.interests,
                    gender: newData.gender,
                  }}
                >
                  <Form.Item
                    name="fname"
                    initialValue={newData.fname}
                    label="First Name"
                  >
                    <Input
                      name="fname"
                      value={newData.fname}
                      onChange={handleChange}
                    />
                  </Form.Item>
                  <Form.Item
                    name="lname"
                    initialValue={newData.lname}
                    label="Last Name"
                  >
                    <Input
                      name="lname"
                      value={newData.lname}
                      onChange={handleChange}
                    />
                  </Form.Item>
                  <Form.Item
                    initialValue={newData.email}
                    label="Email Address"
                    name="email"
                    rules={[
                      {
                        type: "email",
                        message: "The input is not a valid email!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter your Email Address"
                      name="email"
                      value={newData.email}
                      onChange={handleChange}
                    />
                  </Form.Item>
                  <Form.Item label="Gender" name="gender">
                    <Radio.Group
                      value={newData.gender}
                      onChange={handleGenderChange}
                    >
                      <Radio value="Male">Male</Radio>
                      <Radio value="Female">Female</Radio>
                      <Radio value="Other">Other</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item label="Date of Birth" name="dob">
                    <DatePicker
                      style={{ width: "100%" }}
                      format="DD/MM/YYYY"
                      value={newData.dob}
                      onChange={handleDateChange}
                      placeholder="Enter your date of birth"
                    />
                  </Form.Item>

                  <Form.Item label="Your Interests" name="interests">
                    <Checkbox.Group
                      options={options}
                      onChange={handleCheckBox}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Phone Number (include country code)"
                    name="phone"
                    initialValue={newData.phone}
                    rules={[
                      {
                        pattern: /^[0-9]+$/,
                        message:
                          "Please enter a valid phone number (digits only)!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="+91XXXXXXXXXX"
                      name="phone"
                      value={newData.phone}
                      onChange={handleChange}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Address"
                    name="address"
                    initialValue={newData.address}
                  >
                    <Input.TextArea
                      name="address"
                      placeholder="Enter your address"
                      rows={4}
                      value={newData.address}
                      onChange={handleChange}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Pin Code"
                    name="pinCode"
                    initialValue={newData.pincode}
                  >
                    <Input
                      placeholder="Enter your area’s Pin Code"
                      name="pincode"
                      value={newData.pincode}
                      onChange={handleChange}
                    />
                  </Form.Item>

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
                      <Button icon={<UploadOutlined />}>
                        Upload Profile Image
                      </Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item
                    label="Choose Your Region"
                    name="region"
                    initialValue={newData.region}
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
                </Form>
              </Modal>
              {/* ************edit modal ends************ */}

              {/****************** VIEW MODAL ****************** */}
              <Modal
                title={post.fname + " " + post.lname}
                open={isViewModalOpen && post.id === postIdForView}
                onOk={handleOkViewModal}
                onCancel={handleCancelViewModal}
              >
                <div className="container w-full p-3 flex flex-col gap-1">
                  <img src={post.image} className="w-full" />
                  <p className=" mt-5">
                    <b>Email</b>: {post.email}
                  </p>
                  <p>
                    <b> Date of Birth</b>: {post.dob}
                  </p>
                  <p>
                    <b>Gender</b>: {post.gender}
                  </p>
                  <p>
                    <b>Address</b>: {post.address}
                  </p>
                  <p>
                    <b>Pincode</b>: {post.pincode}
                  </p>
                  <p>
                    <b>Interested in</b>: {post.interests.map((e) => e + " ")}
                  </p>
                  <p>
                    <b>Phone </b>:{post.phone}
                  </p>
                  <p>
                    <b>Region</b>: {post.region}
                  </p>
                </div>
              </Modal>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default AllPosts;
