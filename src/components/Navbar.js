import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUserType, auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import logo from "../assets/logo.png"; 



const Navbar = () => {
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const type = await getCurrentUserType();
        setUserType(type);
      } catch (error) {
        console.error("Failed to fetch user type:", error);
      }
    };

    fetchUserType();
  }, []);

  const handleLogout = async () => {
    try {
       await signOut(auth);
           console.log("User signed out");
      setUserType(null);
          navigate("/"); 
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
        <img src={logo} alt="Logo" className="navbar-logo-image" />
        </Link>
      </div>
           <ul className="navbar-menu">
        <li>
          <Link to="/companies">Companies</Link>
        </li>
        {userType !== "company" && (
          <li>
            <Link to="/matched-jobs">Matched Jobs</Link>
          </li>
        )}
        {userType === "company" && (
           <>
            <li>
              <Link to="/is-paylas">Post Job</Link>
            </li>
              <li>
              <Link to="/company-profile">Company Profile</Link>
            </li>
          </>
        )}
        {userType === "applicant" && (
          <>
            <li>
       <Link to="/external-companies">External Companies</Link>
            </li>
            <li>
              <Link to="/applied-jobs">Applied Jobs</Link>
            </li>
          </>
        )}
        {userType === "applicant" && (
          <li>
            <Link to="/my-profile">Profile</Link>
          </li>
        )}
      </ul>
      <div className="navbar-buttons">
        {userType === "company" ? (
          <>
            <Link to="/company-profile">
              <button className="btn green">Company Dashboard</button>
            </Link>
            <button className="btn red" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : userType === "applicant" ? (
          <>
            <Link to="/my-profile">
              <button className="btn blue">Applicant Dashboard</button>
            </Link>
            <button className="btn red" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/sign-in">
              <button className="btn blue">Sign In</button>
            </Link>
            <Link to="/sign-in-companies">
              <button className="btn red">For Companies</button>
            </Link>
          </>
        )}
     
      </div>
    </nav>
  );
};

export default Navbar;
