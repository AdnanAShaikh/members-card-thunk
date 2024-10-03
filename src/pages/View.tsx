/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../redux/store";
import { useEffect, useState } from "react";
import { getPostById } from "../redux/postSlice";

const View: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const post = useSelector((state: RootState) => state.posts.currentPost);
  console.log("post:", post);
  console.log(id);

  useEffect(() => {
    if (id) {
      dispatch(getPostById(id));
    }
  }, [dispatch, id]);

  const [data, setData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (post) {
      setData({ title: post.title, description: post.description });
    }
  }, [post]);

  return (
    <div className="container min-h-screen text-gray-300 flex justify-center bg-blue-950">
      <div className="w-1/2 h-96 flex flex-col gap-6 p-6 translate-y-10 bg-white rounded-xl">
        <div className="w-full p-4 bg-blue-950 text-center rounded-md flex items-center justify-between">
          <h1 className="text-gray-200 text-3xl">{data?.title}</h1>
          <div>
            <Button
              type="link"
              className="mr-4"
              onClick={() => navigate("/dashboard")}
              icon={<ArrowLeftOutlined />}
              style={{ fontSize: "16px" }}
            ></Button>
            <Link to={`/edit/${id}`}>
              <button className="bg-gray-200 rounded-sm px-1 text-blue-950">
                Edit
              </button>
            </Link>
          </div>
        </div>
        <div className="text-blue-950 px-1">
          <p>{data?.description}</p>
        </div>
      </div>
    </div>
  );
};

export default View;
