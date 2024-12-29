import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, firestore, storage } from '../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/MyProfile.css';
import withAuthCheck from './withAuthCheck'; 

const MyCompanyProfile = ({ refreshNavbar }) => {
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    logo: '',
    coverPhoto: '',
    city: '',
   
    email: '',
    founded: '',
    employees: '',
    website: '',
  
  });
  const [logoFile, setLogoFile] = useState(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);

  const navigate = useNavigate();

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
              logo: companyData.logo || '',
              coverPhoto: companyData.coverPhoto || '',
              city: companyData.city || '',
             
              email: companyData.email || '',
              founded: companyData.founded || '',
              employees: companyData.employees || '',
              website: companyData.website || '',
             
            });
          }
        } catch (error) {
          console.error('Error fetching company data: ', error);
          toast.error(error.message);
        }
      }
    };

    fetchCompanyData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('socialMedia')) {
      const socialMediaKey = name.split('.')[1];
      setCompanyInfo((prevInfo) => ({
        ...prevInfo,
        socialMedia: {
          ...prevInfo.socialMedia,
          [socialMediaKey]: value
        }
      }));
    } else {
      setCompanyInfo({ ...companyInfo, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'logoFile') {
      setLogoFile(files[0]);
    } else if (name === 'coverPhotoFile') {
      setCoverPhotoFile(files[0]);
    }
  };
  const uploadFile = async (file, filePath) => {
    const fileRef = ref(storage, filePath);
    await uploadBytes(fileRef, file);
    const fileURL = await getDownloadURL(fileRef);
    return fileURL;
  };
  

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        if (logoFile) {
          const logoPath = `companies/${user.uid}/logo`;
          const logoURL = await uploadFile(logoFile, logoPath);
          companyInfo.logo = logoURL;
        }
        if (coverPhotoFile) {
          const coverPhotoPath = `companies/${user.uid}/coverPhoto`;
          const coverPhotoURL = await uploadFile(coverPhotoFile, coverPhotoPath);
          companyInfo.coverPhoto = coverPhotoURL;
        }
        const docRef = doc(firestore, 'companies', user.uid);
        await updateDoc(docRef, companyInfo);
        toast.success('Company profile updated successfully!');
        navigate('/company-profile');
      } catch (error) {
        console.error('Error updating company profile: ', error);
        toast.error(error.message);
      }
    } else {
      toast.error('No user is logged in');
    }
  }

  return (
    <div className="my-profile">
      <ToastContainer />
      <h2>My Company Profile</h2>
      <form onSubmit={handleSaveProfile}>
        <h3>Company Information</h3>
        <label>
          Name
          <input type="text" name="name" value={companyInfo.name} onChange={handleInputChange} required />
        </label>
        <label>
          City
          <input type="text" name="city" value={companyInfo.city} onChange={handleInputChange} required />
        </label>
      
        <label>
          Email
          <input type="email" name="email" value={companyInfo.email} onChange={handleInputChange} required />
        </label>
        <label>
          Founded
          <input type="date" name="founded" value={companyInfo.founded} onChange={handleInputChange} required />
        </label>
        <label>
          Logo
          <input type="file" name="logoFile" onChange={handleFileChange} />
        </label>
        <label>
          Cover Photo
          <input type="file" name="coverPhotoFile" onChange={handleFileChange} />
        </label>
        <label>
          Number of Employees
          <input type="number" name="employees" value={companyInfo.employees} onChange={handleInputChange} required />
        </label>
        <label>
          Website
          <input type="text" name="website" value={companyInfo.website} onChange={handleInputChange} required />
        </label>
      
      
      
        <button type="submit">Save Company Profile</button>
      </form>
    </div>
  );
};

export default withAuthCheck(MyCompanyProfile);
