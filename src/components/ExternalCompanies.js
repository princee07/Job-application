import React, { useState, useEffect } from 'react';
import '../styles/ExternalCompanies.css'; // Adjust the path if needed
import Searchbar from './Searchbar'; // Import the Searchbar component

const ExternalCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // Fetch data from externalCompanies.json
        const response = await fetch('/externalCompanies.json');
        const data = await response.json();
        setCompanies(data);
        setFilteredCompanies(data); // Initially show all companies
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const results = companies.filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanies(results);
  }, [searchTerm, companies]);

  return (
    <div className="external-companies-page">
      <Searchbar onSearch={setSearchTerm} /> {/* Pass setSearchTerm as prop */}
      <div className="external-cards-container">
        {filteredCompanies.map(company => (
          <div className="external-card" key={company.id}>
            <div className="external-card-content">
              <div className="external-card-header">
                <div className="external-card-title">{company.name}</div>
              </div>
              <div className="external-card-body">
                <p><strong>Location:</strong> {company.location}</p>
                <p><strong>Title:</strong> {company.title}</p>
                <p>{company.description}</p>
              </div>
            
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExternalCompanies;
