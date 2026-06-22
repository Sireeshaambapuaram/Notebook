import React, { useEffect, useState } from "react";
import styles from "../../styles/signup/signup.module.css";
import logo from "/notebook.png";
import { Link, useNavigate } from "react-router-dom";
import { HiEyeOff } from "react-icons/hi";
import { HiEye } from "react-icons/hi";
import axios from "axios";
import { apiRoutes } from "@/utils/apiRoutes";
import { ToastContainer, toast } from "react-toastify";
import Loading from "@/components/Loading/Loading";
// const baseURL = "http://localhost:8000/api/v1/user/signup";
const Signup = () => {
  // 🚀🚀🚀🚀 ---------------- State Start -------------------------

  // ============= show hide password ============
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // =============== store input data ==================
  const [data, setData] = useState({
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  // ====================== Validation ======================
  const [validName, setValidName] = useState(false);
  const [validUsername, setValidUsername] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPhoneNumber, setValidPhoneNumber] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);

  // =============== validation message =============
  const [usernamevalidationMessage, setUsernameValidationMessage] =
    useState("");
  const [emailvalidationMessage, setEmailValidationMessage] = useState("");

  // ================= Loading State ===============
  const [loading, setLoading] = useState(false);

  // 🚀🚀🚀🚀 ---------------- State End -------------------------
  // -------------- navigate --------------
  const navigate = useNavigate();
  // ============== handle input box ================
  const handleInputBox = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const namePattern = /^[A-Za-z.-]+(\s*[A-Za-z.-]+)*$/;
    const nameOk =
      namePattern.test(data.name) &&
      data.name.length >= 2 &&
      data.name.length <= 20;

    const usernamePattern = /^[a-z0-9_.]+$/;
    const usernameOk =
      usernamePattern.test(data.username) &&
      data.username.length >= 2 &&
      data.username.length <= 20;

    const emailPattern =
      /^[A-Za-z0-9._-]+@[A-Za-z0-9_.-]+\.[A-Za-z]{2,4}$/;
    const emailOk = emailPattern.test(data.email.trim());

    const phonenumberPattern = /^\D*(?:\d\D*){06,12}$/;
    const phoneOk =
      phonenumberPattern.test(data.phoneNumber) &&
      data.phoneNumber.length >= 6 &&
      data.phoneNumber.length <= 12;

    const passwordOk = data.password.length >= 8;
    const confirmOk = data.password === data.confirmPassword;

    setValidName(!nameOk);
    setValidUsername(!usernameOk);
    setValidEmail(!emailOk);
    setValidPhoneNumber(!phoneOk);
    setValidPassword(!passwordOk);
    setValidConfirmPassword(!confirmOk);

    if (
      !nameOk ||
      !usernameOk ||
      !emailOk ||
      !phoneOk ||
      !passwordOk ||
      !confirmOk
    ) {
      return;
    }
    handleApiCalling(data);
  };

  // ==================== API Calling =============
  const handleApiCalling = async (sendData) => {
    try {
      setLoading(true);
      
      const response = await axios.post(apiRoutes.signupURI, sendData, {
        // const response = await axios.post(baseURL, sendData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      setLoading(false);
      // const subData = await response.data;
      // console.log(response.data);
      // console.log(response.data.token);

      // dispatch(getData(response.data));
      localStorage.setItem("notebookToken", response.data.token);

      // navigate("/");
      toast.success("Signup Successfully", {
        position: "top-center",
      });
      navigate("/user/notes");
      window.location.reload();
    } catch (error) {
      setLoading(false);
      const msg = error.response?.data?.message ?? "";
      if (msg === "username already exists") {
        setUsernameValidationMessage(msg);
      } else {
        setUsernameValidationMessage("");
      }

      if (msg === "email already exists") {
        setEmailValidationMessage(msg);
      } else {
        setEmailValidationMessage("");
      }

      if (!msg && error.message) {
        toast.error(
          error.message || "Signup failed. Is the API server running?",
          { position: "top-center" }
        );
      }
    }
  };

  // =========== useEffect ============
  useEffect(() => {}, []);
  return (
    <>
      {loading ? <Loading /> : ""}
      <div className={`${styles.main}`}>
        <div className={`${styles.signup_container}`}>
          <div className={`${styles.logo_box}`}>
            <img src={logo} alt="logo" className={`${styles.logo}`} />
          </div>
          <h2 className={`${styles.form_title}`}>Create your Account</h2>
          <form
            action=""
            className={`${styles.signup_form}`}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className={`${styles.div_wrapper}`}>
              {/* ===================== Full Name ======================= */}
              <div className={`${styles.form_input_box}`}>
                <label htmlFor="" className={`${styles.form_data_wrapper}`}>
                  <span className={`${styles.input_title}`}>Full Name</span>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    name="name"
                    onChange={handleInputBox}
                    className={`${styles.input_box} ${
                      validName ? styles.invalid_input : styles.valid_input
                    }`}

                    // minLength="2"
                  />
                </label>
                {validName ? (
                  <span className={`${styles.invalid_user}`}>
                    *Enter Valid Name
                  </span>
                ) : null}
              </div>

              {/* ===================== username ======================= */}
              <div className={`${styles.form_input_box}`}>
                <label htmlFor="" className={`${styles.form_data_wrapper}`}>
                  <span className={`${styles.input_title}`}>Username</span>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    name="username"
                    onChange={handleInputBox}
                    // className={`${styles.input_box}`}
                    className={`${styles.input_box} ${
                      validUsername ? styles.invalid_input : styles.valid_input
                    }`}
                  />
                </label>
                {validUsername ? (
                  <span className={`${styles.invalid_user}`}>
                    *Enter valid username
                  </span>
                ) : usernamevalidationMessage ? (
                  <span className={`${styles.invalid_user}`}>
                    {usernamevalidationMessage}
                  </span>
                ) : null}
              </div>
            </div>

            <div className={`${styles.div_wrapper}`}>
              {/* ===================== Email ======================= */}
              <div className={`${styles.form_input_box}`}>
                <label htmlFor="" className={`${styles.form_data_wrapper}`}>
                  <span className={`${styles.input_title}`}>Email</span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    onChange={handleInputBox}
                    // className={`${styles.input_box}`}
                    className={`${styles.input_box} ${
                      validEmail ? styles.invalid_input : styles.valid_input
                    }`}
                  />
                </label>
                {validEmail ? (
                  <span className={`${styles.invalid_user}`}>
                    *Invalid Email Address
                  </span>
                ) : emailvalidationMessage ? (
                  <span className={`${styles.invalid_user}`}>
                    {emailvalidationMessage}
                  </span>
                ) : null}
              </div>

              {/* ===================== Phone Number ======================= */}
              <div className={`${styles.form_input_box}`}>
                <label htmlFor="" className={`${styles.form_data_wrapper}`}>
                  <span className={`${styles.input_title}`}>Phone</span>
                  <input
                    type="text"
                    placeholder="Enter your phone number"
                    name="phoneNumber"
                    onChange={handleInputBox}
                    // className={`${styles.input_box}`}
                    className={`${styles.input_box} ${
                      validPhoneNumber
                        ? styles.invalid_input
                        : styles.valid_input
                    }`}
                  />
                </label>
                {validPhoneNumber ? (
                  <span className={`${styles.invalid_user}`}>
                    *Enter Valid phone number
                  </span>
                ) : null}
              </div>
            </div>

            <div className={`${styles.div_wrapper}`}>
              {/* ===================== Password ======================= */}
              <div className={`${styles.form_input_box}`}>
                <label htmlFor="" className={`${styles.form_data_wrapper}`}>
                  <span className={`${styles.input_title}`}>Password</span>
                  <div className={`${styles.password_box}`}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      name="password"
                      onChange={handleInputBox}
                      className={`${styles.password_input_box}`}
                    />
                    {showPassword ? (
                      <button
                        className={`${styles.eye_botton}`}
                        onClick={() => setShowPassword(false)}
                      >
                        <HiEyeOff />
                      </button>
                    ) : (
                      <button
                        className={`${styles.eye_botton}`}
                        onClick={() => setShowPassword(true)}
                      >
                        <HiEye />
                      </button>
                    )}
                  </div>
                </label>
                {validPassword ? (
                  <span className={`${styles.invalid_user}`}>
                    *Password must be at least 8 characters
                  </span>
                ) : null}
              </div>

              {/* ===================== Confirm Password ======================= */}
              <div className={`${styles.form_input_box}`}>
                <label htmlFor="" className={`${styles.form_data_wrapper}`}>
                  <span className={`${styles.input_title}`}>
                    Confirm Password
                  </span>
                  {/* <input
                    type="password"
                    placeholder="Confirm your password"
                    className={`${styles.input_box}`}
                  /> */}
                  <div className={`${styles.password_box}`}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      name="confirmPassword"
                      onChange={handleInputBox}
                      className={`${styles.password_input_box}`}
                    />
                    {showConfirmPassword ? (
                      <button
                        className={`${styles.eye_botton}`}
                        onClick={() => setShowConfirmPassword(false)}
                      >
                        <HiEyeOff />
                      </button>
                    ) : (
                      <button
                        className={`${styles.eye_botton}`}
                        onClick={() => setShowConfirmPassword(true)}
                      >
                        <HiEye />
                      </button>
                    )}
                  </div>
                </label>
                {validConfirmPassword ? (
                  <span className={`${styles.invalid_user}`}>
                    *Confirm Password doesn't match, Try again !
                  </span>
                ) : null}
              </div>
            </div>

            <div className={`${styles.div_wrapper}`}>
              <div className={`${styles.signup_box}`}>
                <button
                  className={`${styles.signup_button}`}
                  onClick={handleSubmit}
                >
                  Create an account
                </button>
              </div>
            </div>

            {/* <div className={`${styles.signup_box}`}>
             
            </div> */}
            <div className={`${styles.login}`}>
              <span className={`${styles.login_wrapper}`}>
                Already have an account?{" "}
                <Link to="/user/login" className={`${styles.login}`}>
                  Login here
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Signup;
