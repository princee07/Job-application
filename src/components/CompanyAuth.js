import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  setDoc,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
import { auth, firestore } from "../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/CompanyAuth.css";

const CompanyAuth = ({ refreshNavbar }) => {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(firestore, "companies", user.uid), {
        companyName,
        email,
        city,
        district,
        userType: "company", // Specify user type
      });

      toast.success("Registered successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error registering company: ", error);
      toast.error(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Check if the user exists in the companies collection
      const companyQuery = query(
        collection(firestore, "companies"),
        where("email", "==", email)
      );
      const companySnapshot = await getDocs(companyQuery);

      if (companySnapshot.empty) {
        // If the user does not exist in the companies collection, show an error message
        toast.error("Invalid company email or password");
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      refreshNavbar(); // Refresh the navbar to update the user type
      toast.success("Logged in successfully!");
      // Retrieve user data to determine user type
      navigate("/company-profile");
    } catch (error) {
      console.error("Error logging in: ", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="company-auth">
      <h2>{isLogin ? "Company Login" : "Register Company"}</h2>
      <form
        onSubmit={isLogin ? handleLogin : handleRegister}
        className="auth-form"
      >
        {!isLogin && (
          <>
            <label>
              Company Name
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </label>
          </>
        )}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {!isLogin && (
          <>
            <label>
              Confirm Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            <label>
              City
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </label>
        
          </>
        )}
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
        {isLogin ? "Switch to Register" : "Switch to Login"}
      </button>
    </div>
  );
};

export default CompanyAuth;
