import React from 'react';
import sunIcon from '../assets/sun.png';
import moonIcon from '../assets/moon.png';
import '../styles/theme.css';

const ThemeToggle = ({ darkMode, setDarkMode }) => {
  const handleToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.className = newMode ? 'dark-theme' : '';
    localStorage.setItem('darkMode', newMode ? 'true' : 'false');
  };

  return (
    <button
      id="theme-toggle"
      className={darkMode ? 'dark-theme' : ''}
      onClick={handleToggle}
      aria-label="Toggle theme"
    >
      <span className="toggle-ball">
        <span className="icon sun">
          <img src={sunIcon} alt="Sun" className="icon-img" />
        </span>
        <span className="icon moon">
          <img src={moonIcon} alt="Moon" className="icon-img" />
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;