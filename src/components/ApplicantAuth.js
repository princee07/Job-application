import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, query, where, collection, getDocs } from 'firebase/firestore';
import { auth, firestore } from '../firebase/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/CompanyAuth.css';

const ApplicantAuth = ({ refreshNavbar }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [title, setTitle] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(firestore, 'applicants', user.uid), {
        fullName,
        email,
        address,
        title,
        userType: 'applicant'  // Specify user type
      });

      toast.success('Registered successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error registering applicant: ', error);
      toast.error(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
          // Check if the user exists in the applicant collection
    const applicantQuery = query(collection(firestore, 'applicants'), where('email', '==', email));
    const applicantSnapshot = await getDocs(applicantQuery);

    if (applicantSnapshot.empty) {
      // If the user does not exist in the applicant collection, show an error message
      toast.error('Invalid email or password');
      return;
    }
      await signInWithEmailAndPassword(auth, email, password);
      refreshNavbar(); // Refresh the navbar to update the user type
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error logging in: ', error);
      toast.error(error.message);
    }
  };

  return (
    <div className="company-auth">
      <h2>{isLogin ? 'Applicant Login' : 'Register Applicant'}</h2>
      <form onSubmit={isLogin ? handleLogin : handleRegister} className="auth-form">
        {!isLogin && (
          <>
            <label>
              Full Name
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </label>
          </>
        )}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {!isLogin && (
          <>
            <label>
              Confirm Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            <label>
              Address
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>
            <label>
              Title
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
          </>
        )}
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
        {isLogin ? 'Switch to Register' : 'Switch to Login'}
      </button>
    </div>
  );
};

export default ApplicantAuth;
