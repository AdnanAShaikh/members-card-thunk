import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import "./index.css";
import AllPosts from "./pages/AllPosts";
import Create from "./pages/Create";
import Register from "./pages/Register";
import Auth from "./components/Auth";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <Auth>
              <AllPosts />
            </Auth>
          }
        />
        <Route
          path="/create"
          element={
            <Auth>
              <Create />
            </Auth>
          }
        />

        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
