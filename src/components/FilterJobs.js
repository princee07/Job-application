import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import '../styles/FilterJobs.css';

const FilterJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [userSkills, setUserSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('User logged in:', user);
                fetchUserSkills(user);
            } else {
                console.log('User not logged in.');
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchUserSkills = async (user) => {
        try {
            const docRef = doc(firestore, 'applicants', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                console.log('User data:', userData);

                if (userData.skills) {
                    console.log('User skills:', userData.skills);
                    setUserSkills(userData.skills);
                } else {
                    console.warn('Skills field is missing in user data');
                }
            } else {
                console.warn('No such document!');
            }
        } catch (error) {
            console.error('Error fetching user skills:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchJobs = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, 'jobs'));
            const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log('Jobs data:', jobsData);
            setJobs(jobsData);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const filterJobsBySkills = () => {
        if (userSkills.length === 0) return [];

        const filtered = jobs.filter(job => {
            const requiredSkills = job.skills || [];
            return requiredSkills.some(skill => userSkills.includes(skill));
        });

        console.log('Filtered jobs:', filtered);
        return filtered;
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    const filteredJobs = filterJobsBySkills();

    const handleCardClick = (jobId) => {
        navigate(`/job/${jobId}`);
    };

    return (
        <div className="filter-jobs">
            <h2>Jobs Matching Your Skills</h2>
            <div className="cards-container">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <div key={job.id} className="card" onClick={() => handleCardClick(job.id)}>
                            <img src={job.jobPicture || "https://placehold.co/300x200"} alt="Job Image" className="w-full h-48 object-cover rounded-t-lg" />
                            <div className="content">
                                <div className="header">
                                    <div className="flex items-center">
                                        <img 
                                            src={job.companyLogo || "https://placehold.co/40"} 
                                            alt="Profile Photo" 
                                            className="w-8 h-8 rounded-full mr-2" 
                                        />
                                        <span className="title">{job.companyName || "Company Name"}</span>
                                    </div>
                                    <span className="text-jt">{job.jobType || "Job Type"}</span>
                                </div>
                                <p className="text-lg">{job.jobName || "Job Title"}</p>
                                <p className="text-dep">{job.jobDescription || "Job Description"}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No matching jobs found.</p>
                )}
            </div>
        </div>
    );
};

export default FilterJobs;
