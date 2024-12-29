import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import "./login.css";

function Login() {
  const [formType, setFormType] = useState("login");
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    isAdmin: 0,
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [users, setUsers] = useState([]); // To store all user data fetched from Firestore

  // Fetch all users from Firestore on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map((doc) => doc.data());
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Update state for Sign-Up form inputs
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  // Update state for Login form inputs
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  // Handle Sign-Up form submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "users"), signupData);
      alert("Sign-up successful!");
      setSignupData({ name: "", email: "", number: "", password: "", isAdmin: 0 });
    } catch (error) {
      console.error("Error adding document:", error);
      alert("Sign-up failed. Please try again.");
    }
  };

  // Handle Login form submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const userFound = users.find(
      (user) =>
        user.email === loginData.email && user.password === loginData.password
    );

    if (userFound) {
      alert("Login successful!");
    } else {
      alert("Invalid email or password. Please try again.");
    }
    setLoginData({ email: "", password: "" });
  };

  return (
    <div className="container">
      <div className="form-container">
        {formType === "signup" ? (
          <SignUpForm
            signupData={signupData}
            handleSignupChange={handleSignupChange}
            handleSignupSubmit={handleSignupSubmit}
          />
        ) : (
          <LoginForm
            loginData={loginData}
            handleLoginChange={handleLoginChange}
            handleLoginSubmit={handleLoginSubmit}
          />
        )}
        <FormToggle
          formType={formType}
          toggleForm={() => setFormType(formType === "login" ? "signup" : "login")}
        />
      </div>
    </div>
  );
}

// Sign-Up Form Component
const SignUpForm = ({ signupData, handleSignupChange, handleSignupSubmit }) => (
  <>
    <h2>Sign Up</h2>
    <form onSubmit={handleSignupSubmit}>
      <InputField
        label="Name"
        id="name"
        type="text"
        value={signupData.name}
        onChange={handleSignupChange}
        required
      />
      <InputField
        label="Email"
        id="email"
        type="email"
        value={signupData.email}
        onChange={handleSignupChange}
        required
      />
      <InputField
        label="Number"
        id="number"
        type="text"
        value={signupData.number}
        onChange={handleSignupChange}
        required
      />
      <InputField
        label="Password"
        id="password"
        type="password"
        value={signupData.password}
        onChange={handleSignupChange}
        required
      />
      <button type="submit" className="btn">Sign Up</button>
    </form>
  </>
);

// Login Form Component
const LoginForm = ({ loginData, handleLoginChange, handleLoginSubmit }) => (
  <>
    <h2>Login</h2>
    <form onSubmit={handleLoginSubmit}>
      <InputField
        label="Email"
        id="email"
        type="email"
        value={loginData.email}
        onChange={handleLoginChange}
        required
      />
      <InputField
        label="Password"
        id="password"
        type="password"
        value={loginData.password}
        onChange={handleLoginChange}
        required
      />
      <button type="submit" className="btn">Login</button>
    </form>
  </>
);

// Input Field Component
const InputField = ({ label, id, type, value, onChange, required }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}:</label>
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

// Form Toggle Component
const FormToggle = ({ formType, toggleForm }) => (
  <p>
    {formType === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
    <span className="toggle-link" onClick={toggleForm}>
      {formType === "login" ? "Sign Up" : "Login"}
    </span>
  </p>
);

export default Login;
