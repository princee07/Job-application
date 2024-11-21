import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import '../styles/Cards.css';
import Searchbar from './Searchbar';

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'jobs'));
        const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setJobs(jobsData);

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
        setCompanies(companiesMap);
      } catch (error) {
        console.error("Error fetching jobs or companies:", error);
      }
    };

    fetchJobs();
  }, []);

  const handleCardClick = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  const filteredJobs = searchTerm
    ? jobs.filter(job => {
        const jobName = job.jobName?.toLowerCase() || '';
        const jobDescription = job.jobDescription?.toLowerCase() || '';
        const companyName = companies[job.companyID]?.companyName?.toLowerCase() || '';

        const searchTermLower = searchTerm.toLowerCase();
        return jobName.includes(searchTermLower) || jobDescription.includes(searchTermLower) || companyName.includes(searchTermLower);
      })
    : [];

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <Searchbar onSearch={handleSearch} />
      <div className="cards-container">
        {filteredJobs.length > 0 &&
          filteredJobs.map((job) => (
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
          ))
        }
      </div>
    </div>
  );
};

export default JobSearch;
