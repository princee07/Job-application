import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, firestore } from '../firebase/firebase';
import '../styles/CompanyProfile.css'; 
import withAuthCheck from './withAuthCheck'; 

const ViewCompanyProfile = () => {
  const navigate = useNavigate(); 
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    city: '',
   
    email: '',
    founded: '',
    employees: '',
    website: '',
   
   
    media: [],
    coverPhoto: '',
    logo: ''
  });
  const [jobs, setJobs] = useState([]);  // State to hold jobs data

  useEffect(() => {
    const fetchCompanyData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(firestore, 'companies', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const companyData = docSnap.data();
            setCompanyInfo({
              name: companyData.companyName || '',
              city: companyData.city || '',
             
              email: companyData.email || '',
              location: companyData.location || '',
              founded: companyData.founded || '',
              employees: companyData.employees || '',
              website: companyData.website || '',
            
              media: companyData.media || [],
              coverPhoto: companyData.coverPhoto || '',
              logo: companyData.logo || ''
            });

            // Fetch jobs for the company
            const jobsRef = collection(firestore, 'jobs');
            const q = query(jobsRef, where('companyID', '==', user.uid));
            const querySnapshot = await getDocs(q);
            const jobsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setJobs(jobsList);
          }
        } catch (error) {
          console.error('Error fetching company data: ', error);
        }
      }
    };

    fetchCompanyData();
  }, []);

  const handleEditProfile = () => {
    navigate('/edit-company-profile');
  };

  const handleShowApplicants = (jobId) => {
    navigate(`/show-applicants/${jobId}`);
  };

  return (
    <div className="view-profile">
      <div className="cover-photo" style={{ backgroundImage: `url(${companyInfo.coverPhoto})` }}></div>
      <div className="company-info-container">
        <img src={companyInfo.logo} alt="Company Logo" className="company-logo" />
        <div className="company-details">
          <h2>{companyInfo.name}</h2>
          <p>{companyInfo.tagline}</p>
        </div>
        <button className="edit-profile-button" onClick={handleEditProfile}>Edit Profile</button>
      </div>
      <div>
        <h3>Company Information</h3>
        <p><strong>City:</strong> {companyInfo.city}</p>
        
        <p><strong>Email:</strong> {companyInfo.email}</p>
        <p><strong>Year Founded:</strong> {companyInfo.founded}</p>
        <p><strong>Number of Employees:</strong> {companyInfo.employees}</p>
        <p><strong>Website:</strong> <a href={companyInfo.website} target="_blank" rel="noopener noreferrer">{companyInfo.website}</a></p>
      
      </div>
      <div>
        <h3>Jobs Posted by {companyInfo.name}</h3>
        {jobs.length > 0 ? (
          <ul>
            {jobs.map((job, index) => (
              <li key={index} className='job-bubble'>
                <h4>{job.jobName}</h4>

                <p><strong>Department:</strong> {job.department}</p>
                <p className='text-dep'><strong>Description:</strong> {job.jobDescription}</p>
                <p><strong>Location:</strong> {job.location}</p>

                <p><strong>Job Type:</strong> {job.jobType}</p>
                
                <p><strong>Qualifications:</strong> {job.qualifications ? job.qualifications.join(', ') : 'N/A'}</p>
                <button className="view-job-button" onClick={() => handleShowApplicants(job.id)}>Show Applicants</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No jobs posted yet.</p>
        )}
      </div>
    </div>
  );
};

export default withAuthCheck(ViewCompanyProfile);
