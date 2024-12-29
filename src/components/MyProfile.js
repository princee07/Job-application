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
   
    phoneNumber: '',
  
   
    birthDate: '',
    gender: '',
   
    address: '',
    email: '',
    title: ''
  });

  const [education, setEducation] = useState([]);
  
  const [languages, setLanguages] = useState([]);
  
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
             
             
              nationality: personalData.nationality || '',
              birthDate: personalData.birthDate || '',
              gender: personalData.gender || '',
             
              address: userData.address || '',
              email: userData.email || '',
        
            }));
            setEducation(userData.education || []);
           
            setLanguages(userData.languages || []);
           
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
      
        <p><strong>Location:</strong> {personalInfo.location}</p>
        <p><strong>About Me:</strong> {personalInfo.aboutMe}</p>
        <p><strong>Skills:</strong> {personalInfo.skills}</p>
      
        <p><strong>Phone Number:</strong> {personalInfo.phoneNumber}</p>
       
        <p><strong>Nationality:</strong> {personalInfo.nationality}</p>
        <p><strong>Birth Date:</strong> {personalInfo.birthDate}</p>
        <p><strong>Gender:</strong> {personalInfo.gender}</p>
       
      
      </div>

    



    </div>
  );
};

export default withAuthCheck(ViewProfile);
