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
    salaryExpectation: '',
    phoneNumber: '',
    nationalId: '',
    nationality: '',
    birthDate: '',
    gender: '',
    birthLocation: '',
    
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
            salaryExpectation: personalData.salaryExpectation || '',
            phoneNumber: personalData.phoneNumber || '',
            nationalId: personalData.nationalId || '',
            nationality: personalData.nationality || '',
            birthDate: personalData.birthDate || '',
            gender: personalData.gender || '',
            birthLocation: personalData.birthLocation || '',
            driversLicense: personalData.driversLicense || '',
            militaryStatus: personalData.militaryStatus || '',
            searchingNewOpportunities: personalData.searchingNewOpportunities || false,
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
        <p><strong>Title:</strong> {personalInfo.title}</p>
        <p><strong>Location:</strong> {personalInfo.location}</p>
        <p><strong>About Me:</strong> {personalInfo.aboutMe}</p>
        <p><strong>Skills:</strong> {personalInfo.skills}</p>
        <p><strong>Salary Expectation:</strong> {personalInfo.salaryExpectation}</p>
        <p><strong>Phone Number:</strong> {personalInfo.phoneNumber}</p>
        <p><strong>National ID:</strong> {personalInfo.nationalId}</p>
        <p><strong>Nationality:</strong> {personalInfo.nationality}</p>
        <p><strong>Birth Date:</strong> {personalInfo.birthDate}</p>
        <p><strong>Gender:</strong> {personalInfo.gender}</p>
        <p><strong>Birth Location:</strong> {personalInfo.birthLocation}</p>
        <p><strong>Driver's License:</strong> {personalInfo.driversLicense}</p>
        <p><strong>Military Status:</strong> {personalInfo.militaryStatus}</p>
        <p><strong>Searching for New Opportunities:</strong> {personalInfo.searchingNewOpportunities ? 'Yes' : 'No'}</p>
        <p><strong>School Internship Match:</strong> {personalInfo.schoolInternshipMatch ? 'Yes' : 'No'}</p>
      </div>

      <div>
        <h3>Educational Information</h3>
        {education.map((edu, index) => (
          <div key={index}>
            <p><strong>University:</strong> {edu.university}</p>
            <p><strong>Start Date:</strong> {edu.startDate}</p>
            <p><strong>End Date:</strong> {edu.endDate}</p>
            <p><strong>GPA:</strong> {edu.gpa}</p>
          </div>
        ))}
      </div>

      <div>
        <h3>Work Experience</h3>
        {workExperience.map((work, index) => (
          <div key={index}>
            <p><strong>Company Name:</strong> {work.companyName}</p>
            <p><strong>Job Title:</strong> {work.jobTitle}</p>
            <p><strong>Start Date:</strong> {work.startDate}</p>
            <p><strong>End Date:</strong> {work.endDate}</p>
            <p><strong>Job Description:</strong> {work.jobDescription}</p>
          </div>
        ))}
      </div>

      <div>
        <h3>Volunteer Experience</h3>
        {volunteerExperience.map((volunteer, index) => (
          <div key={index}>
            <p><strong>Organization:</strong> {volunteer.organization}</p>
            <p><strong>Role:</strong> {volunteer.role}</p>
            <p><strong>Start Date:</strong> {volunteer.startDate}</p>
            <p><strong>End Date:</strong> {volunteer.endDate}</p>
            <p><strong>Description:</strong> {volunteer.description}</p>
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
        <h3>Courses</h3>
        {courses.map((course, index) => (
          <div key={index}>
            <p><strong>Course Name:</strong> {course.courseName}</p>
            <p><strong>Institution:</strong> {course.institution}</p>
            <p><strong>Completion Date:</strong> {course.completionDate}</p>
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
