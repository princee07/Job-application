import React from 'react';
import '../styles/Home.css';
import JobSearch from './JobSearch';
import Cards from './Cards';

const Home = () => {
  return (
    <div className="home">
      <div className="home-header">
      <h1>Naukri Mitra</h1>
        <div className="search-box">
          <JobSearch />
        </div>
      </div>

      <div className="all-jobs-section">
        <h2>Recuiters</h2>
        <div className="cards-container">
          <Cards />
        </div>
      </div>
    </div>
  );
}

export default Home;
