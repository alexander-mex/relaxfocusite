import React, { useEffect } from 'react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';

const Footer = ({ selectedMode, darkMode, user, showModeSelector }) => {
  useEffect(() => {
    document.getElementById('year').textContent = new Date().getFullYear();
  }, []);

  return (
    <footer className={`footer mt-auto ${darkMode ? 'dark-theme' : ''}`}>
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-center py-3 border-top">
          <div className="col-md-4 d-flex align-items-center">
            <span className="mb-3 mb-md-0 text-body-secondary">
              &copy; <span id="year"></span>
            </span>
          </div>
          
          {user && !showModeSelector && selectedMode && (
            <div className="col-md-4 text-center text-body-secondary">
              Current mode: {selectedMode === 'relax' ? 'Релакс' : 'Зосередженість'}
            </div>
          )}

          <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
            <li className="ms-3">
              <a href="https://instagram.com" className="text-body-secondary">
                <FaInstagram size={24} />
              </a>
            </li>
            <li className="ms-3">
              <a href="https://facebook.com" className="text-body-secondary">
                <FaFacebook size={24} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
