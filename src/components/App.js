import React, { useState } from "react";
import "../styles/App.css";
import Navbar from "./Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ApplicantAuth from "./ApplicantAuth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./Home";
import Companies from "./Companies";
import Jobs from "./Jobs";
import Footer from "./Footer";
import CompanyAuth from "./CompanyAuth";
import CreateJob from "./CreateJob";
import MyProfile from "./MyProfile";
import EditProfile from "./EditProfile";
import RegisteredCompanies from "./RegisteredCompanies";
import ViewCompanyProfile from "./ViewCompanyProfile";
import ViewProfile from "./ViewProfile";

import JobDetails from "./JobDetails";
import CompanyProfile from "./CompanyProfile";
import EditCompanyProfile from "./EditCompanyProfile";
import ExternalCompanies from "./ExternalCompanies";

import AppliedJobs from "./AppliedJobs";
import MatchedJobs from "./MatchedJobs";

import ShowApplicants from "./ShowApplicants";
import FilterJobs from "./FilterJobs"; // Import the new component

function App() {
  const [refreshKey, setRefreshKey] = useState(0); // Add key state

  const refreshNavbar = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Update key to force re-render
  };

  return (
    <Router>
      <div className="App">
        <Navbar key={refreshKey} />
        <ToastContainer />
        <Routes>
          {/* Ana sayfa bileşeni veya diğer bileşenler buraya eklenebilir */}
          <Route path="/" element={<Home />} />
          <Route path="/sirketler" element={<Companies />} />
          <Route path="/ilanlar" element={<Jobs />} />
          <Route path="/sign-in" element={<ApplicantAuth refreshNavbar={refreshNavbar}/>} />
          <Route path="/sign-in-companies" element={<CompanyAuth refreshNavbar={refreshNavbar} />} />
          <Route path="/external-companies" element={<ExternalCompanies />} />
          <Route path="/companies" element={<RegisteredCompanies />} />
          <Route path="/is-paylas" element={<CreateJob />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/job/:jobId" element={<JobDetails/>} />
          <Route path="/company-profile" element={<CompanyProfile />} />
          <Route path="/company/:companyId" element={<ViewCompanyProfile />} />
          <Route path="/edit-company-profile" element={<EditCompanyProfile />} />
          <Route path="/applied-jobs" element={<AppliedJobs />} />
          <Route path="/matched-jobs" element={<MatchedJobs />} />
          <Route path="/show-applicants/:jobId" element={<ShowApplicants />} />
          <Route path="/view-profile/:applicantId" element={<ViewProfile />} />
          <Route path="/filtered-jobs" element={<FilterJobs />} /> {/* Add the new route */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
