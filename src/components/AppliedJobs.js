import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { firestore } from '../firebase/firebase';
import '../styles/AppliedJobs.css';

const AppliedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            if (!user) {
                console.log("No user is signed in");
                return;
            }

            const q = query(collection(firestore, 'jobs'), where('appliedApplications', 'array-contains', user.uid));
            const querySnapshot = await getDocs(q);

            const jobsList = await Promise.all(querySnapshot.docs.map(async (jobDoc) => {
                const jobData = jobDoc.data();
                const companyDoc = await getDoc(doc(firestore, 'companies', jobData.companyID));
                const companyData = companyDoc.exists() ? companyDoc.data() : { companyName: 'Company Name' };

                return {
                    id: jobDoc.id,
                    ...jobData,
                    companyName: companyData.companyName
                };
            }));

            setJobs(jobsList);
        };

        fetchAppliedJobs();
    }, [user]);

    if (!user) {
        return <div>Please log in to view your applied jobs.</div>;
    }

    if (jobs.length === 0) {
        return <div>You have not applied for any jobs yet.</div>;
    }

    return (
        <div className="applied-jobs-container">
            <h1>Applied Jobs</h1>
            {jobs.map(job => (
                <div key={job.id} className="job-card">
                    <h2>{job.jobName || "Job Name"}</h2>
                    <p><strong>Company:</strong> {job.companyName || "Company Name"}</p>
                    <p><strong>Department:</strong> {job.department || "Department"}</p>
                    <p><strong>Location:</strong> {job.location || "Location"}</p>
                    <Link to={`/job/${job.id}`}>
                        <button className="view-job-button">View Job</button>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default AppliedJobs;
