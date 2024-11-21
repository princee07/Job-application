import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase/firebase';
import '../styles/ViewProfile.css'; 
import withAuthCheck from './withAuthCheck'; 

const ViewProfile = () => {
  const navigate = useNavigate(); 
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    location: '',
    aboutMe: '',
    skills: '',
    salaryExpectation: '',
    phoneNumber: '',
    nationalId: '',
    nationality: '',
    birthDate: '',
    gender: '',
    birthLocation: '',
    driversLicense: '',
    militaryStatus: '',
    searchingNewOpportunities: false,
    schoolInternshipMatch: false,
    address: '',
    email: '',
    title: ''
  });

  const [education, setEducation] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [volunteerExperience, setVolunteerExperience] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(firestore, 'applicants', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            const personalData = userData.personalInfo || {};

            setPersonalInfo((prevInfo) => ({
              ...prevInfo,
              name: userData.fullName || '',
              location: personalData.location || '',
              aboutMe: personalData.aboutMe || '',
              skills: personalData.skills || '',
              salaryExpectation: personalData.salaryExpectation || '',
              phoneNumber: personalData.phoneNumber || '',
              nationalId: personalData.nationalId || '',
              nationality: personalData.nationality || '',
              birthDate: personalData.birthDate || '',
              gender: personalData.gender || '',
              birthLocation: personalData.birthLocation || '',
              driversLicense: personalData.driversLicense || '',
            
              schoolInternshipMatch: personalData.schoolInternshipMatch || false,
              address: userData.address || '',
              email: userData.email || '',
              title: userData.title || ''
            }));
            setEducation(userData.education || []);
            setWorkExperience(userData.workExperience || []);
            setVolunteerExperience(userData.volunteerExperience || []);
            setLanguages(userData.languages || []);
            setCourses(userData.courses || []);
            setCertifications(userData.certifications || []);
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <div className="view-profile">
      <h2>My Profile</h2>
      
      <button className="edit-profile-button" onClick={handleEditProfile}>Edit Profile</button>
      <div>
        <h3>Personal Information</h3>
        <p><strong>Name:</strong> {personalInfo.name}</p>
        <p><strong>Email:</strong> {personalInfo.email}</p>
        <p><strong>Address:</strong> {personalInfo.address}</p>
       
        <p><strong>Skills:</strong> {personalInfo.skills}</p>
       
        <p><strong>Birth Date:</strong> {personalInfo.birthDate}</p>
        <p><strong>Gender:</strong> {personalInfo.gender}</p>
        
       
       
      </div>

     
     

     
    
     
      <div>
        <h3>Certifications</h3>
        {certifications.map((certification, index) => (
          <div key={index}>
            <p><strong>Certification Name:</strong> {certification.name}</p>
            <p><strong>Issuing Organization:</strong> {certification.issuingOrganization}</p>
            <p><strong>Issue Date:</strong> {certification.issueDate}</p>
            <p><strong>Expiration Date:</strong> {certification.expirationDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuthCheck(ViewProfile);
