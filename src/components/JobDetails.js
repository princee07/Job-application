import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';  // Import getAuth from Firebase Authentication
import { firestore } from '../firebase/firebase';
import '../styles/JobDetails.css';
import { ToastContainer, toast } from 'react-toastify';

const JobDetails = () => {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [company, setCompany] = useState(null);
    const auth = getAuth();  // Initialize auth

    useEffect(() => {
        const fetchJob = async () => {
            const jobDoc = await getDoc(doc(firestore, 'jobs', jobId));
            if (jobDoc.exists()) {
                setJob(jobDoc.data());
            } else {
                console.log("No such document!");
            }
        };

        fetchJob();
    }, [jobId]);

    useEffect(() => {
        if (job && job.companyID) {
            const fetchCompany = async () => {
                const companyDoc = await getDoc(doc(firestore, 'companies', job.companyID));
                if (companyDoc.exists()) {
                    setCompany(companyDoc.data());
                } else {
                    console.log("No such company document!");
                }
            };

            fetchCompany();
        }
    }, [job]);

    const handleApplyNow = async () => {
        const user = auth.currentUser;
        if (!user) {
            console.log("No user is signed in");
            return;
        }

        const applicantID = user.uid;
        const jobRef = doc(firestore, 'jobs', jobId);

        try {
            await updateDoc(jobRef, {
                appliedApplications: arrayUnion(applicantID)
            });
            toast.success("Application successful!");
        } catch (error) {
            console.error("Error applying for job: ", error);
        }
    };

    if (!job || !company) {
        return <div>Loading...</div>;
    }

    const skills = Array.isArray(job.skills) ? job.skills : (job.skills || "").split(',').map(skill => skill.trim());

    return (
        <div className="job-details-container">
            <div className="job-header">
                <img src={company.logo || "https://placehold.co/100"} alt="Company Logo" className="company-logo" />
                <div>
                    <h1 className="company-name">{company.companyName || "Company Name"}</h1>
                    <h2 className="job-name">{job.jobName || "Job Name"}</h2>
                </div>
                <button className="apply-button-header" onClick={handleApplyNow}>Apply</button>
            </div>
            <div className="job-body">
                <div className="job-description">
                    <img src={job.jobPicture || "https://placehold.co/300x200"} alt="Job" className="job-picture" />
                    <h3>Job Description</h3>
                    <p>{job.jobDescription || "Job description details..."}</p>
                    <h3>About Company</h3>
                    <p>{company.aboutCompany || "About the company details..."}</p>
                </div>
                <div className="job-details">
                    <h3>Details</h3>
                    <hr />
                    <p><strong>Department</strong><br />{job.department || "Job Department"}</p>
                    <hr />
                    <p><strong>Job Type</strong><br />{job.jobType || "e.g. Intern"}</p>
                    <hr />
                    <p><strong>Release Date</strong><br />{job.applicationReleaseDate || "??-??-2024"}</p>
                    <hr />
                    <p><strong>Deadline Date</strong><br />{job.applicationDeadline || "??-??-2024"}</p>
                    <hr />
                    <p><strong>Salary</strong><br />{job.salary || "$"}</p>
                    <hr />
                    <p><strong>Location</strong><br />{job.location || "e.g. Locations"}</p>
                    <hr />
                    <p><strong>Required Skills</strong></p>
                    <div className="qualifications-container">
                        {skills.map((skill, index) => (
                            <span key={index} className="qualification-bubble">{skill}</span>
                        ))}
                    </div>
                    <button className="apply-button" onClick={handleApplyNow}>Apply Now</button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default JobDetails;
