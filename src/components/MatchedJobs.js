import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import '../styles/MatchedJobs.css';

const MatchedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [companies, setCompanies] = useState({});
    const [matchedJobs, setMatchedJobs] = useState([]);
    const [applicantSkills, setApplicantSkills] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplicantSkills = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const applicantDoc = await getDoc(doc(firestore, 'applicants', user.uid));
                    if (applicantDoc.exists()) {
                        const personalInfo = applicantDoc.data().personalInfo || {};
                        setApplicantSkills(personalInfo.skills || []);
                    }
                } catch (error) {
                    console.error('Error fetching applicant skills: ', error);
                }
            }
        };

        const fetchJobsAndCompanies = async () => {
            try {
                const jobsSnapshot = await getDocs(collection(firestore, 'jobs'));
                const jobsData = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                const companyIds = [...new Set(jobsData.map(job => job.companyID).filter(companyID => companyID))];
                const companyData = await Promise.all(
                    companyIds.map(async (companyID) => {
                        if (companyID) {
                            const companyDoc = await getDoc(doc(firestore, 'companies', companyID));
                            return companyDoc.exists() ? { id: companyID, ...companyDoc.data() } : null;
                        }
                        return null;
                    })
                );
                const companiesMap = companyData.reduce((acc, company) => {
                    if (company) acc[company.id] = company;
                    return acc;
                }, {});

                setJobs(jobsData);
                setCompanies(companiesMap);
            } catch (error) {
                console.error("Error fetching jobs or companies:", error);
            }
        };

        fetchApplicantSkills();
        fetchJobsAndCompanies();
    }, []);

    useEffect(() => {
        if (jobs.length > 0 && applicantSkills.length > 0) {
            const matched = jobs.filter(job => {
                const jobSkills = job.skills || [];
                return jobSkills.some(skill => applicantSkills.includes(skill));
            });
            setMatchedJobs(matched);
        }
    }, [jobs, applicantSkills]);

    const handleCardClick = (jobId) => {
        navigate(`/job/${jobId}`);
    };

    return (
        <div className="matched-jobs-container">
            <h2>Matched Jobs</h2>
            <div className="cards-container">
                {matchedJobs.map((job) => (
                    <div key={job.id} className="card" onClick={() => handleCardClick(job.id)}>
                        <img src={job.jobPicture || "https://placehold.co/300x200"} alt="Job Image" className="w-full h-48 object-cover rounded-t-lg" />
                        <div className="content">
                            <div className="header">
                                <div className="flex items-center">
                                    <img 
                                        src={companies[job.companyID]?.logo || "https://placehold.co/40"} 
                                        alt="Profile Photo" 
                                        className="w-8 h-8 rounded-full mr-2" 
                                    />
                                    <span className="title">{companies[job.companyID]?.companyName || "Company Name"}</span>
                                </div>
                                <span className="text-jt">{job.jobType || "Job Type"}</span>
                            </div>
                            <p className="text-lg">{job.jobName || "Job Title"}</p>
                            <p className="text-dep">{job.jobDescription || "Job Description"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MatchedJobs;
