import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase/firebase';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/MyProfile.css';
import withAuthCheck from './withAuthCheck'; 

const MyProfile = ({ refreshNavbar }) => {
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    location: '',
    aboutMe: '',
    skills: [],
    salaryExpectation: '',
    phoneNumber: '',
    nationalId: '',
    nationality: '',
    birthDate: '',
    gender: '',
    birthLocation: '',
    driversLicense: [], 
    deferralDate: '',
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
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [salaryExpectationError, setSalaryExpectationError] = useState('');
  const [nationalIdError, setNationalIdError] = useState('');


  const skillsOptions = [
    { value: 'Java', label: 'Java' },
    { value: 'Python', label: 'Python' },
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'HTML', label: 'HTML' },
    { value: 'CSS', label: 'CSS' },
    { value: 'React', label: 'React' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'C++', label: 'C++' },
    { value: 'C#', label: 'C#' },
    { value: 'Go', label: 'Go' },
    { value: 'Swift', label: 'Swift' },
    { value: 'Kotlin', label: 'Kotlin' },
    { value: 'PHP', label: 'PHP' },
    { value: 'Ruby on Rails', label: 'Ruby on Rails' },
    { value: 'Vue.js', label: 'Vue.js' },
    { value: 'Angular', label: 'Angular' },
    { value: 'Bootstrap', label: 'Bootstrap' },
    { value: 'Tailwind CSS', label: 'Tailwind CSS' },
    { value: 'SASS', label: 'SASS' },
    { value: 'LESS', label: 'LESS' },
    { value: 'MySQL', label: 'MySQL' },
    { value: 'PostgreSQL', label: 'PostgreSQL' },
    { value: 'SQLite', label: 'SQLite' },
    { value: 'Oracle Database', label: 'Oracle Database' },
    { value: 'Microsoft SQL Server', label: 'Microsoft SQL Server' },
    { value: 'NoSQL Databases (e.g., Cassandra, CouchDB)', label: 'NoSQL Databases' },
    { value: 'AWS', label: 'AWS' },
    { value: 'Microsoft Azure', label: 'Microsoft Azure' },
    { value: 'Google Cloud Platform (GCP)', label: 'Google Cloud Platform' },
    { value: 'Heroku', label: 'Heroku' },
    { value: 'Git', label: 'Git' },
    { value: 'GitHub', label: 'GitHub' },
    { value: 'Jenkins', label: 'Jenkins' },
    { value: 'Docker', label: 'Docker' },
    { value: 'Kubernetes', label: 'Kubernetes' },
    { value: 'Jest', label: 'Jest' },
    { value: 'Mocha', label: 'Mocha' },
    { value: 'Cypress', label:  'Cypress' },
    { value: 'Selenium', label: 'Selenium' },
    { value: 'Python (Scikit-learn, TensorFlow, PyTorch)', label: 'Python (Data Science)' },
    { value: 'R', label: 'R' },
    { value: 'Spark', label: 'Spark' },
    { value: 'Linux', label: 'Linux' },
    { value: 'API Development', label: 'API Development' },
    { value: 'Microservices', label: 'Microservices' },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(firestore, 'applicants', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            const personalInfo = userData.personalInfo || {};
  
            setPersonalInfo((prevInfo) => ({
              ...prevInfo,
              name: userData.fullName || '',
              location: personalInfo.location || '',
              aboutMe: personalInfo.aboutMe || '',
              skills: personalInfo.skills || [],
              salaryExpectation: personalInfo.salaryExpectation || '',
              phoneNumber: personalInfo.phoneNumber || '',
              nationalId: personalInfo.nationalId || '',
              nationality: personalInfo.nationality || '',
              birthDate: personalInfo.birthDate || '',
              gender: personalInfo.gender || '',
              birthLocation: personalInfo.birthLocation || '',
              driversLicense: personalInfo.driversLicense || [],
              deferralDate: personalInfo.deferralDate || '',
              militaryStatus: personalInfo.militaryStatus || '',
              searchingNewOpportunities: personalInfo.searchingNewOpportunities || false,
              schoolInternshipMatch: personalInfo.schoolInternshipMatch || false,
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
          toast.error(error.message);
        }
      }
    };
  
    fetchUserData();
  }, []);
  

  const handleInputChange = (e) => {
    const { name, value, type, checked, options } = e.target;
    
    if (name === 'phoneNumber') {
      if (!/^\d+$/.test(value)) {
        setPhoneNumberError('Enter only digits');
      } else {
        setPhoneNumberError('');
      }
    }
    
    if (name === 'nationalId') {
      if (value.length !== 11) {
        setNationalIdError('National ID must be exactly 11 digits long');
      } else {
        setNationalIdError('');
      }
    }
    
    if (name === 'salaryExpectation') {
      if (!/^\d+$/.test(value)) {
        setSalaryExpectationError('Enter only digits');
      } else {
        setSalaryExpectationError('');
      }
    }
    
    if (type === 'checkbox') {
      setPersonalInfo({ ...personalInfo, [name]: checked });
    } else if (type === 'select-multiple') {
      const selectedOptions = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setPersonalInfo({ ...personalInfo, [name]: selectedOptions });
    } else {
      setPersonalInfo({ ...personalInfo, [name]: value });
    }
  };
  
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        const docRef = doc(firestore, 'applicants', user.uid);
        await updateDoc(docRef, {
          personalInfo,
          education,
          workExperience,
          volunteerExperience,
          languages,
          courses,
          certifications
        });
        toast.success('Profile updated successfully!');
        navigate('/my-profile');
      } catch (error) {
        console.error('Error updating profile: ', error);
        toast.error(error.message);
      }
    } else {
      toast.error('No user is logged in');
    }
  }
  const handleRemoveItem = (list, setList, index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleSkillsChange = (selectedOptions) => {
    setPersonalInfo({ ...personalInfo, skills: selectedOptions.map(option => option.value) });
  };

  return (
    <div className="my-profile">
      <h2>My Profile</h2>
      <form onSubmit={handleSaveProfile}>
        <h3>Personal Information</h3>
        <label>
          Name
          <input type="text" name="name" value={personalInfo.name} onChange={handleInputChange} required />
        </label>
        <label>
        Email
        <input type="email" name="email" value={personalInfo.email} onChange={handleInputChange} required />
      </label>
      <label>
        Address
        <input type="address" name="address" value={personalInfo.address} onChange={handleInputChange} required />
      </label>
      <label>
        Title
        <input type="text" name="title" value={personalInfo.title} onChange={handleInputChange} required />
      </label>
        <label>
          Location
          <input type="text" name="location" value={personalInfo.location} onChange={handleInputChange} required />
        </label>
        <label>
          About Me
          <textarea name="aboutMe" value={personalInfo.aboutMe} onChange={handleInputChange} required />
        </label>
        <label>
          Skills
          <Select
            name="skills"
            value={skillsOptions.filter(option => personalInfo.skills.includes(option.value))}
            onChange={handleSkillsChange}
            options={skillsOptions}
            isMulti
            required
          />
        </label>
        <label>
          Salary Expectation
          <input type="number" name="salaryExpectation" value={personalInfo.salaryExpectation} onChange={handleInputChange} required />
        </label>
        {salaryExpectationError && <p className="error">{salaryExpectationError}</p>}
        <label>
          Phone Number
          <input type="text" name="phoneNumber" maxLength="10" onChange={handleInputChange} onKeyPress={(e) => {
          if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
          }
          }}/>
        </label>
        {phoneNumberError && <p className="error">{phoneNumberError}</p>}
        <label>
          National ID
          <input type="text" name="nationalId"  maxLength="11"  onChange={handleInputChange}  onKeyPress={(e) => {
          if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
          }
        }}/>
        </label>
        {nationalIdError && <p className="error">{nationalIdError}</p>}
        <label>
          Nationality
          <input type="text" name="nationality" value={personalInfo.nationality} onChange={handleInputChange} required />
        </label>
        <label>
          Birth Date
          <input type="date" name="birthDate" value={personalInfo.birthDate} onChange={handleInputChange} required />
        </label>
        <label>
          Gender
        <select name="gender" value={personalInfo.gender} onChange={handleInputChange} required>
          <option value=""> Seçiniz </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        </label>
        <label>
          Birth Location
          <input type="text" name="birthLocation" value={personalInfo.birthLocation} onChange={handleInputChange} required />
        </label>
        <label>
          Driver's License
          <select name="driversLicense" value={personalInfo.driversLicense} onChange={handleInputChange} multiple required>
            <option value="M">M</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="A">A</option>
            <option value="B1">B1</option>
            <option value="B">B</option>
            <option value="BE">BE</option>
            <option value="C1">C1</option>
            <option value="C1E">C1E</option>
            <option value="C">C</option>
            <option value="CE">CE</option>
            <option value="D1">D1</option>
            <option value="D1E">D1E</option>
            <option value="D">D</option>
            <option value="DE">DE</option>
            <option value="F">F</option>
          </select>
        </label>
        <label>
          Military Status
          <select name="militaryStatus" value={personalInfo.militaryStatus} onChange={handleInputChange} required>
            <option value="">Select</option>
            <option value="Yapıldı">Yapıldı</option>
            <option value="Muaf">Muaf</option>
            <option value="Tecilli">Tecilli</option>
          </select>
        </label>
        {personalInfo.militaryStatus === 'Tecilli' && (
          <label>
            Deferral Date
            <input type="date" name="deferralDate" value={personalInfo.deferralDate} onChange={handleInputChange} required />
          </label>
        )}
        <label>
          Searching for New Opportunities
          <input type="checkbox" name="searchingNewOpportunities" checked={personalInfo.searchingNewOpportunities} onChange={handleInputChange} />
        </label>
        <label>
          School Internship Match
          <input type="checkbox" name="schoolInternshipMatch" checked={personalInfo.schoolInternshipMatch} onChange={handleInputChange} />
        </label>
        <h3>Educational Information</h3>
        <button type="button" onClick={() => setEducation([...education, { university: '', startDate: '', endDate: '', gpa: '' }])}>Add Education</button>
        {education.map((edu, index) => (
          <div key={index}>
            <label>
              University
              <input type="text" value={edu.university} onChange={(e) => {
                const newEducation = [...education];
                newEducation[index].university = e.target.value;
                setEducation(newEducation);
              }} required />
            </label>
            <label>
              Start Date
              <input type="date" value={edu.startDate} onChange={(e) => {
                const newEducation = [...education];
                newEducation[index].startDate = e.target.value;
                setEducation(newEducation);
              }} required />
            </label>
            <label>
              End Date
              <input type="date" value={edu.endDate} onChange={(e) => {
                const newEducation = [...education];
                newEducation[index].endDate = e.target.value;
                setEducation(newEducation);
              }} required />
            </label>
            <label>
              GPA
              <input type="number" value={edu.gpa} onChange={(e) => {
                const newEducation = [...education];
                newEducation[index].gpa = e.target.value;
                setEducation(newEducation);
              }} required />
            </label>
            <button type="button" onClick={() => handleRemoveItem(education, setEducation, index)}>Remove</button>
          </div>
        ))}
        <h3>Work Experience</h3>
        <button type="button" onClick={() => setWorkExperience([...workExperience, { companyName: '', jobTitle: '', startDate: '', endDate: '', jobDescription: '' }])}>Add Work Experience</button>
        {workExperience.map((work, index) => (
          <div key={index}>
            <label>
              Company Name
              <input type="text" value={work.companyName} onChange={(e) => {
                const newWorkExperience = [...workExperience];
                newWorkExperience[index].companyName = e.target.value;
                setWorkExperience(newWorkExperience);
              }} required />
            </label>
            <label>
              Job Title
              <input type="text" value={work.jobTitle} onChange={(e) => {
                const newWorkExperience = [...workExperience];
                newWorkExperience[index].jobTitle = e.target.value;
                setWorkExperience(newWorkExperience);
              }} required />
            </label>
            <label>
              Start Date
              <input type="date" value={work.startDate} onChange={(e) => {
                const newWorkExperience = [...workExperience];
                newWorkExperience[index].startDate = e.target.value;
                setWorkExperience(newWorkExperience);
              }} required />
            </label>
            <label>
              End Date
              <input type="date" value={work.endDate} onChange={(e) => {
                const newWorkExperience = [...workExperience];
                newWorkExperience[index].endDate = e.target.value;
                setWorkExperience(newWorkExperience);
              }} required />
            </label>
            <label>
              Job Description
              <textarea value={work.jobDescription} onChange={(e) => {
                const newWorkExperience = [...workExperience];
                newWorkExperience[index].jobDescription = e.target.value;
                setWorkExperience(newWorkExperience);
              }} required />
            </label>
            <button type="button" onClick={() => handleRemoveItem(workExperience, setWorkExperience, index)}>Remove</button>
          </div>
        ))}
        <h3>Volunteer Experience</h3>
        <button type="button" onClick={() => setVolunteerExperience([...volunteerExperience, { organization: '', role: '', startDate: '', endDate: '', description: '' }])}>Add Volunteer Experience</button>
        {volunteerExperience.map((volunteer, index) => (
          <div key={index}>
            <label>
              Organization
              <input type="text" value={volunteer.organization} onChange={(e) => {
                const newVolunteerExperience = [...volunteerExperience];
                newVolunteerExperience[index].organization = e.target.value;
                setVolunteerExperience(newVolunteerExperience);
              }} required />
            </label>
            <label>
              Role
              <input type="text" value={volunteer.role} onChange={(e) => {
                const newVolunteerExperience = [...volunteerExperience];
                newVolunteerExperience[index].role = e.target.value;
                setVolunteerExperience(newVolunteerExperience);
              }} required />
            </label>
            <label>
              Start Date
              <input type="date" value={volunteer.startDate} onChange={(e) => {
                const newVolunteerExperience = [...volunteerExperience];
                newVolunteerExperience[index].startDate = e.target.value;
                setVolunteerExperience(newVolunteerExperience);
              }} required />
            </label>
            <label>
              End Date
              <input type="date" value={volunteer.endDate} onChange={(e) => {
                const newVolunteerExperience = [...volunteerExperience];
                newVolunteerExperience[index].endDate = e.target.value;
                setVolunteerExperience(newVolunteerExperience);
              }} required />
            </label>
            <label>
              Description
              <textarea value={volunteer.description} onChange={(e) => {
                const newVolunteerExperience = [...volunteerExperience];
                newVolunteerExperience[index].description = e.target.value;
                setVolunteerExperience(newVolunteerExperience);
              }} required />
            </label>
            <button type="button" onClick={() => handleRemoveItem(volunteerExperience, setVolunteerExperience, index)}>Remove</button>
          </div>
        ))}
        <h3>Languages</h3>
        <button type="button" onClick={() => setLanguages([...languages, { language: '', proficiency: '' }])}>Add Language</button>
        {languages.map((lang, index) => (
          <div key={index}>
            <label>
              Language
              <input type="text" value={lang.language} onChange={(e) => {
                const newLanguages = [...languages];
                newLanguages[index].language = e.target.value;
                setLanguages(newLanguages);
              }} required />
            </label>
            <label>
              Proficiency
              <input type="text" value={lang.proficiency} onChange={(e) => {
                const newLanguages = [...languages];
                newLanguages[index].proficiency = e.target.value;
                setLanguages(newLanguages);
              }} required />
            </label>
            <button type="button" onClick={() => handleRemoveItem(languages, setLanguages, index)}>Remove</button>
          </div>
        ))}
        <h3>Courses</h3>
        <button type="button" onClick={() => setCourses([...courses, { courseName: '', institution: '', completionDate: '' }])}>Add Course</button>
        {courses.map((course, index) => (
          <div key={index}>
            <label>
              Course Name
              <input type="text" value={course.courseName} onChange={(e) => {
                const newCourses = [...courses];
                newCourses[index].courseName = e.target.value;
                setCourses(newCourses);
              }} />
            </label>
            <label>
              Institution
              <input type="text" value={course.institution} onChange={(e) => {
                const newCourses = [...courses];
                newCourses[index].institution = e.target.value;
                setCourses(newCourses);
              }} />
            </label>
            <label>
              Completion Date
              <input type="date" value={course.completionDate} onChange={(e) => {
                const newCourses = [...courses];
                newCourses[index].completionDate = e.target.value;
                setCourses(newCourses);
              }} />
            </label>
            <button type="button" onClick={() => handleRemoveItem(courses, setCourses, index)}>Remove</button>
          </div>
        ))}
        <h3>Certifications</h3>
        <button type="button" onClick={() => setCertifications([...certifications, { certificationName: '', institution: '', issuanceDate: '' }])}>Add Certification</button>
        {certifications.map((certification, index) => (
          <div key={index}>
            <label>
              Certification Name
              <input type="text" value={certification.certificationName} onChange={(e) => {
                const newCertifications = [...certifications];
                newCertifications[index].certificationName = e.target.value;
                setCertifications(newCertifications);
              }} />
            </label>
            <label>
              Institution
              <input type="text" value={certification.institution} onChange={(e) => {
                const newCertifications = [...certifications];
                newCertifications[index].institution = e.target.value;
                setCertifications(newCertifications);
              }} />
            </label>
            <label>
              Issuance Date
              <input type="date" value={certification.issuanceDate} onChange={(e) => {
                const newCertifications = [...certifications];
                newCertifications[index].issuanceDate = e.target.value;
                setCertifications(newCertifications);
              }} />
            </label>
            <button type="button" onClick={() => handleRemoveItem(certifications, setCertifications, index)}>Remove</button>
          </div>
        ))}
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default withAuthCheck(MyProfile);
