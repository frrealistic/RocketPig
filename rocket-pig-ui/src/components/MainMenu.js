// src/components/MainMenu.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';


const MainMenu = () => {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const [scores, setScores] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch('http://localhost:5154/api/Scores');
        const data = await response.json();
        // Sort scores by distance in descending order
        const sortedScores = data.sort((a, b) => b.distance - a.distance);
        setScores(sortedScores);
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    fetchScores();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatDate = (isoUtcString) => {
    return DateTime.fromISO(isoUtcString, { zone: 'utc' })
      .setZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
      .toFormat('dd.MM.yyyy HH:mm');
  };
  
  const handleMouseEnter = (buttonName) => {
    setHoveredButton(buttonName);
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  return (
    <div style={styles.container}>
      {windowWidth > 1200 && (
        <div style={styles.sideScoreboard}>
          <h2 style={styles.scoreboardTitle}>Top 5 Players</h2>
          <div style={styles.scoreList}>
            {scores
              .slice(0, 5)
              .map((score, index) => (
              <div key={score.id} style={styles.scoreItem}>
                <span style={styles.rank}>{index + 1}.</span>
                <span style={styles.username}>{score.username}</span>
                <span style={styles.score}>{score.distance}</span>
                <span style={styles.date}>{formatDate(score.date)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={styles.content}>
        <div 
          style={styles.titleContainer}
          onMouseEnter={() => setIsTitleHovered(true)}
          onMouseLeave={() => setIsTitleHovered(false)}
        >
          <h1 style={{
            ...styles.title,
            transform: isTitleHovered ? 'rotate(-5deg) scale(1.05)' : 'rotate(-2deg)',
            textShadow: isTitleHovered ? 
              '6px 6px 0px #ff6b6b, 12px 12px 0px #4ecdc4' : 
              '4px 4px 0px #ff6b6b, 8px 8px 0px #4ecdc4'
          }}>
            Rocket Pig
          </h1>
        </div>
        <p style={styles.subtitle}>Launch Your Pig!</p>
        
        <div style={styles.mainContent}>
          <div style={styles.buttonContainer}>
            <button 
              style={{
                ...styles.button,
                ...(hoveredButton === 'play' && styles.buttonHover)
              }}
              onClick={() => navigate('/play')}
              onMouseEnter={() => handleMouseEnter('play')}
              onMouseLeave={handleMouseLeave}
            >
              Play Now
            </button>
            
            <button 
              style={{
                ...styles.button,
                ...(hoveredButton === 'shop' && styles.buttonHover)
              }}
              onClick={() => navigate('/shop')}
              onMouseEnter={() => handleMouseEnter('shop')}
              onMouseLeave={handleMouseLeave}
            >
              Pig Shop
            </button>
            
            <button 
              style={{
                ...styles.button,
                ...(hoveredButton === 'scores' && styles.buttonHover)
              }}
              onClick={() => navigate('/scoreboard')}
              onMouseEnter={() => handleMouseEnter('scores')}
              onMouseLeave={handleMouseLeave}
            >
              High Scores
            </button>
            
            <button 
              style={{
                ...styles.button,
                ...(hoveredButton === 'settings' && styles.buttonHover)
              }}
              onClick={() => navigate('/settings')}
              onMouseEnter={() => handleMouseEnter('settings')}
              onMouseLeave={handleMouseLeave}
            >
              Settings
            </button>
            
            <button 
              style={{
                ...styles.button,
                backgroundColor: '#dc3545',
                ...(hoveredButton === 'logout' && styles.buttonHover)
              }}
              onClick={() => {
                localStorage.removeItem('jwtToken');
                navigate('/');
              }}
              onMouseEnter={() => handleMouseEnter('logout')}
              onMouseLeave={handleMouseLeave}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: '#fff',
    fontFamily: "'Poppins', sans-serif",
    position: 'relative',
  },
  sideScoreboard: {
    position: 'absolute',
    right: '2rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    padding: '1.5rem',
    width: '300px',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  content: {
    textAlign: 'center',
    padding: '2rem',
    borderRadius: '15px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    maxWidth: '600px',
    width: '90%',
  },
  mainContent: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleContainer: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '6rem',
    marginBottom: '0.5rem',
    fontFamily: "'Luckiest Guy', cursive",
    color: '#fff',
    textShadow: '4px 4px 0px #ff6b6b, 8px 8px 0px #4ecdc4',
    transform: 'rotate(-2deg)',
    letterSpacing: '2px',
    lineHeight: '1.2',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'inline-block',
  },
  subtitle: {
    fontSize: '1.2rem',
    marginBottom: '2.5rem',
    color: '#a8a8a8',
    letterSpacing: '1px',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: '300',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    minWidth: '300px',
  },
  button: {
    padding: '1.2rem 2rem',
    fontSize: '1.1rem',
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: "'Poppins', sans-serif",
    textTransform: 'uppercase',
    letterSpacing: '2px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    fontWeight: '600',
  },
  buttonHover: {
    transform: 'translateY(-3px) scale(1.02)',
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#357abd',
  },
  scoreboardTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#fff',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: '600',
  },
  scoreList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  scoreItem: {
    display: 'grid',
    gridTemplateColumns: 'auto auto 1fr auto',
    gap: '1rem',
    alignItems: 'center',
    padding: '0.5rem',
    borderRadius: '5px',
    background: 'rgba(255, 255, 255, 0.05)',
  },
  rank: {
    color: '#ff6b6b',
    fontWeight: '600',
    minWidth: '2rem',
  },
  username: {
    color: '#fff',
    fontWeight: '500',
  },
  score: {
    color: '#4ecdc4',
    fontWeight: '600',
  },
  date: {
    color: '#a8a8a8',
    fontSize: '0.8rem',
  },
};

export default MainMenu;
