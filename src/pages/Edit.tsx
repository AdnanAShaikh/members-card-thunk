/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePostApi } from "../redux/postSlice";
import type { AppDispatch, RootState } from "../redux/store";

const Edit: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getPostById(id));
    }
  }, [dispatch, id]);

  const post = useSelector((state: RootState) => state.posts.currentPost);

  const [newData, setNewData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (post) {
      setNewData({ title: post.title, description: post.description });
    }
  }, [post]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!newData.title || !newData.description) {
        return alert("Fill all fields");
      }
      await dispatch(
        updatePostApi({
          data: newData,
          id: id,
        })
      );
      message.success("Successfully updated!");

      navigate(`/view/${id}`);
    } catch (error) {
      console.error("Error updating post:", error);
      message.error("Failed to update post.");
    }
  };

  return (
    <div className="container min-h-screen text-gray-300 flex justify-center items-center bg-blue-950">
      <div className="w-full max-w-2xl h-auto flex flex-col gap-6 p-6 bg-white rounded-xl overflow-auto">
        <div className="w-full p-4 bg-blue-950 text-center rounded-md">
          <h1 className="text-gray-200 text-3xl">Edit Post</h1>
        </div>

        <Form onFinish={handleSubmit} layout="vertical">
          <Form.Item label="Title">
            <Input name="title" value={newData.title} onChange={handleChange} />
          </Form.Item>
          <Form.Item label="Description">
            <Input.TextArea
              name="description"
              value={newData.description}
              autoSize={{ minRows: 4, maxRows: 8 }}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="text"
              className="w-1/3 mr-10"
              onClick={() => navigate(`/view/${id}`)}
            >
              Back
            </Button>
            <Button type="primary" htmlType="submit" className="w-1/3">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Edit;
