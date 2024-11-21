import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUserType, auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";

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
      navigate("/"); // Navigate to home page after logout
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Nokri Mitra</Link>
      </div>
      <ul className="navbar-menu">
        <li>
          <Link to="/companies">Companies</Link>
        </li>
       
        {userType === "company" && (
          <>
            <li>
              <Link to="/is-paylas">İş Paylaş</Link>
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
            <Link to="/my-profile">My Profile</Link>
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
              <button className="btn blue">Bio</button>
            </Link>
            <button className="btn red" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/aday-kayit">
              <button className="btn blue">Sign In</button>
            </Link>
            <Link to="/sirket-kayit">
              <button className="btn red">For Companies</button>
            </Link>
          </>
        )}
       
      </div>
    </nav>
  );
};

export default Navbar;
