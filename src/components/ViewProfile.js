import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import '../styles/ViewProfile.css';

const ViewProfile = () => {
  const { applicantId } = useParams();
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    location: '',
     aboutMe: '',
    skills: '',
     
    phoneNumber: '',
     nationality: '',
    birthDate: '',
    gender: '',
   
    
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
      try {
        const docRef = doc(firestore, 'applicants', applicantId);
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
          
            phoneNumber: personalData.phoneNumber || '',
           
            nationality: personalData.nationality || '',
            birthDate: personalData.birthDate || '',
            gender: personalData.gender || '',
           
            address: userData.address || '',
            email: userData.email || '',
           
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
    };

    fetchUserData();
  }, [applicantId]);

  return (
    <div className="view-profile">
      <h2>Applicant Profile</h2>
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

      <div>
        <h3>Educational Information</h3>
        {education.map((edu, index) => (
          <div key={index}>
            <p><strong>University:</strong> {edu.university}</p>
            <p><strong>Start Date:</strong> {edu.startDate}</p>
            <p><strong>End Date:</strong> {edu.endDate}</p>
            <p><strong>CGPA:</strong> {edu.gpa}</p>
          </div>
        ))}
      </div>

   


      <div>
        <h3>Languages</h3>
        {languages.map((lang, index) => (
          <div key={index}>
            <p><strong>Language:</strong> {lang.language}</p>
            <p><strong>Proficiency:</strong> {lang.proficiency}</p>
          </div>
        ))}
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

export default ViewProfile;
