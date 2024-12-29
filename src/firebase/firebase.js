// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import getAuth from "firebase/auth"
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBB1OmkGg-237xB1CxEnYLxG9-ZgjpOCyU",
  authDomain: "certificate-verify-6d79f.firebaseapp.com",
  projectId: "certificate-verify-6d79f",
  storageBucket: "certificate-verify-6d79f.appspot.com",
  messagingSenderId: "769153646993",
  appId: "1:769153646993:web:40eda57f13ac5b6106da30",
  measurementId: "G-SB5830XZK9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize auth, firestore, and storage separately
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage }; // Export auth, firestore, and storage

export const getCurrentUserType = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userUid = user.uid;
          console.log("User UID:", userUid);

          // Check if the user exists in the companies collection
          const companyDocRef = doc(firestore, `companies/${userUid}`);
          const companySnapshot = await getDoc(companyDocRef);
          console.log("Company Snapshot:", companySnapshot.exists());

          if (companySnapshot.exists()) {
            resolve('company');
            return;
          }

          // Check if the user exists in the applicants collection
          const applicantDocRef = doc(firestore, `applicants/${userUid}`);
          const applicantSnapshot = await getDoc(applicantDocRef);
          console.log("Applicant Snapshot:", applicantSnapshot.exists());

          if (applicantSnapshot.exists()) {
            resolve('applicant');
            return;
          }

          // If the user is not found in either collection, resolve null
          resolve(null);
        } catch (error) {
          console.error('Error getting user type:', error);
          reject(error);
        }
      } else {
        resolve(null);
      }
    });
  });
};