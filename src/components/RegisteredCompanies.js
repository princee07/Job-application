import React, { useState, useEffect } from 'react';
import '../styles/ExternalCompanies.css';
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { useNavigate } from 'react-router-dom';

const RegisteredCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "companies"));
        const companiesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCompanies(companiesData);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  const handleCompanyClick = (companyId) => {
    navigate(`/company/${companyId}`);
  };

  return (
    <div className="external-companies-page">
      <h1>Registered Companies</h1>
      <div className="external-cards-container">
        {companies.map(company => (
          <div
            className="external-card"
            key={company.id}
            onClick={() => handleCompanyClick(company.id)}
          >
            <div className="external-card-header">
              <div className="external-card-title">{company.companyName}</div>
            </div>
            <div className="external-card-body">
              <p><strong>City:</strong> {company.city}</p>
             
              <p><strong>Email:</strong> {company.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegisteredCompanies;
