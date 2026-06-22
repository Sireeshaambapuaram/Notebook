import { useEffect, useState } from "react";
import "./App.css";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Signup from "./pages/Signup/Signup";
import Navbar from "./common/Navbar/Navbar";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import UserProfile from "./pages/UserProfile/UserProfile";
import EditProfile from "./pages/EditProfile/EditProfile";
import UserProfileSettings from "./pages/UsreProfileSettings/UserProfileSettings";
import UserNotes from "./pages/UserNotes/UserNotes";
import TodoList from "./pages/TodoList/TodoList";
import About from "./pages/About/About";
import ContactUs from "./pages/ContactUs/ContactUs";
import CreateUpdateNotes from "./components/CreateUpdateNotes/CreateUpdateNotes";
import "react-toastify/dist/ReactToastify.css";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
// const login = localStorage.getItem("notebookToken");
function App() {
  const [auth, setAuth] = useState(() =>
    localStorage.getItem("notebookToken")
  );
  const navigate = useNavigate();
  useEffect(() => {
    const login = localStorage.getItem("notebookToken");

    if (login) {
      setAuth(login);
    } else {
      setAuth(null);
      const path = window.location.pathname;
      const publicPaths = ["/user/login", "/user/signup", "/user/forgot_password"];
      if (!publicPaths.includes(path)) {
        navigate("/user/login");
      }
    }
  }, [navigate]);
  return (
    <>
      {/* <BrowserRouter> */}
      <Navbar />
      <Routes>
        {auth ? (
          <>
            <Route
              path="/"
              element={<Navigate to="/user/notes" replace />}
            />

            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/edit_profile" element={<EditProfile />} />
            <Route path="/user/settings" element={<UserProfileSettings />} />

            <Route path="/user/notes" element={<UserNotes />} />
            <Route path="/user/create_notes" element={<CreateUpdateNotes />} />
            <Route path="/user/todo_list" element={<TodoList />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact_us" element={<ContactUs />} />
            <Route
              path="/user/update_notes/:notes_id"
              element={<CreateUpdateNotes />}
            />
            <Route path="/user/forgot_password" element={<ForgotPassword />} />

            <Route path="*" element={<ErrorPage />} />
          </>
        ) : (
          <>
            <Route
              path="/user/forgot_password"
              element={<ForgotPassword />}
            />
            <Route path="/user/page_not_found" element={<ErrorPage />} />
            <Route path="/" element={<Navigate to="/user/login" replace />} />
            <Route path="/user/signup" element={<Signup />} />
            <Route path="/user/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/user/login" replace />} />
          </>
        )}
      </Routes>
      {/* </BrowserRouter> */}
    </>
  );
}

export default App;
