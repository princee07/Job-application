import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, where, updateDoc, arrayRemove } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import '../styles/ShowApplicants.css';

const ShowApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [jobName, setJobName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const jobDocRef = doc(firestore, 'jobs', jobId);
        const jobDoc = await getDoc(jobDocRef);

        if (jobDoc.exists()) {
          const jobData = jobDoc.data();
          setJobName(jobData.jobName || ''); // Set the job name
          const applicantIds = jobData.appliedApplications;

          if (applicantIds && applicantIds.length > 0) {
            const applicantsCollectionRef = collection(firestore, 'applicants');
            const q = query(applicantsCollectionRef, where('__name__', 'in', applicantIds));
            const querySnapshot = await getDocs(q);
            const applicantsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setApplicants(applicantsList);
          } else {
            setApplicants([]);
          }
        } else {
          console.error('Job document does not exist');
        }
      } catch (error) {
        console.error('Error fetching applicants: ', error);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const handleApplicantClick = (applicantId) => {
    navigate(`/view-profile/${applicantId}`);
  };

  return (
    <div className="show-applicants">
      <h3>Applicants for {jobName}</h3>
      {applicants.length > 0 ? (
        <ul>
          {applicants.map((applicant) => (
            <li key={applicant.id}>
              <p><strong>Name:</strong> {applicant.fullName}</p>
              <p><strong>Email:</strong> {applicant.email}</p>
              <p><strong>Resume:</strong> <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer">View Resume</a></p>
              <button onClick={() => handleApplicantClick(applicant.id)}>View Profile</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No applicants found.</p>
      )}
    </div>
  );
};

export default ShowApplicants;
