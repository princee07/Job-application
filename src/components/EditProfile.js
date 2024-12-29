import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc } from 'firebase/firestore'; // yeh firestore ke functions hain
import { auth, firestore } from '../firebase/firebase'; // yeh firebase ke modules hain
import { ToastContainer, toast } from 'react-toastify'; // notification ke liye use karte hain
import Select from 'react-select'; // yeh dropdown select ke liye
import 'react-toastify/dist/ReactToastify.css';
import '../styles/MyProfile.css'; 

const MyProfile = () => {
  // State ka use yahan kiya gaya hai personal info ke liye
  const [personalInfo, setPersonalInfo] = useState({
    name: '', 
    location: '', 
    aboutMe: '', 
    skills: [], 
    phoneNumber: '', 
    nationality: '', 
    birthDate: '', 
    gender: '',
    address: '', 
    email: '', 
  });

  // Yeh error handle karne ke liye hai
  const [phoneNumberError, setPhoneNumberError] = useState('');

  // Skills ke options jo dropdown me dikhengi
  const skillsOptions = [
    { value: 'Java', label: 'Java' },
    { value: 'Python', label: 'Python' },
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'HTML', label: 'HTML' },
    { value: 'CSS', label: 'CSS' },
    { value: 'React', label: 'React' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'C++', label: 'C++' },
    { value: 'Kotlin', label: 'Kotlin' },
  ];

  const navigate = useNavigate(); 

  useEffect(() => {
    // Yeh function database se user data fetch kar raha hai
    const fetchUserData = async () => {
      const user = auth.currentUser; // firebase ka user
      if (user) {
        try {
          const docRef = doc(firestore, 'applicants', user.uid); // database me user ka document
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            const personalInfo = userData.personalInfo || {};

            setPersonalInfo({
              name: userData.fullName || '',
              location: personalInfo.location || '',
              aboutMe: personalInfo.aboutMe || '',
              skills: personalInfo.skills || [],
              phoneNumber: personalInfo.phoneNumber || '',
              nationality: personalInfo.nationality || '',
              birthDate: personalInfo.birthDate || '',
              gender: personalInfo.gender || '',
              address: userData.address || '',
              email: userData.email || '',
            });
          }
        } catch (error) {
          console.error('Error fetching user data: ', error); // agar error aata hai to yeh chalega
          toast.error(error.message); // error message dikhaenge
        }
      }
    };

    fetchUserData(); 
  }, []);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phoneNumber') {
      // Phone number validation kar raha hai
      if (!/^\d*$/.test(value)) {
        setPhoneNumberError('Enter only digits'); // sirf digits dalne ka error
      } else {
        setPhoneNumberError(''); // error ko reset kar diya
      }
    }

    setPersonalInfo({ ...personalInfo, [name]: value }); // state update kar di
  };

  // Skills dropdown me jo select hoga wo handle karega
  const handleSkillsChange = (selectedOptions) => {
    setPersonalInfo({ ...personalInfo, skills: selectedOptions.map(option => option.value) });
  };

  // Profile save karne ka function
  const handleSaveProfile = async (e) => {
    e.preventDefault(); // form ko submit hone se roka
    const user = auth.currentUser;
    if (user) {
      try {
        const docRef = doc(firestore, 'applicants', user.uid); 
        await updateDoc(docRef, { personalInfo }); 
        toast.success('Profile updated successfully!'); 
        navigate('/my-profile'); 
      } catch (error) {
        console.error('Error updating profile: ', error);
        toast.error(error.message); 
      }
    } else {
      toast.error('No user is logged in'); 
    }
  };

  return (
    <div className="my-profile">
      <ToastContainer />
      <h2>My Profile</h2> 
      <form onSubmit={handleSaveProfile}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={personalInfo.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={personalInfo.location}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>About Me</label>
          <textarea
            name="aboutMe"
            value={personalInfo.aboutMe}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Skills</label>
          <Select
            isMulti
            options={skillsOptions}
            value={skillsOptions.filter(option =>
              personalInfo.skills.includes(option.value)
            )}
            onChange={handleSkillsChange}
          />
        </div>
        <div>
          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={personalInfo.phoneNumber}
            onChange={handleInputChange}
          />
              {phoneNumberError && <p className="error">{phoneNumberError}</p>} 
        </div>
        <div>
          <label>Nationality</label>
          <input
            type="text"
            name="nationality"
            value={personalInfo.nationality}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Birth Date</label>
          <input
            type="date"
            name="birthDate"
            value={personalInfo.birthDate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Gender</label>
          <select
            name="gender"
            value={personalInfo.gender}
            onChange={handleInputChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={personalInfo.address}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={personalInfo.email} readOnly />
        </div>
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default MyProfile; 
