import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';

const Scoreboard = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [isTitleHovered, setIsTitleHovered] = useState(false);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch('http://localhost:5154/api/Scores');
        const data = await response.json();
        const sortedScores = data.sort((a, b) => b.distance - a.distance);
        setScores(sortedScores);
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };

    fetchScores();
  }, []);

  const formatDate = (isoUtcString) => {
    return DateTime.fromISO(isoUtcString, { zone: 'utc' })
      .setZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
      .toFormat('dd.MM.yyyy HH:mm');
  };

  return (
    <div style={styles.container}>
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
            High Scores
          </h1>
        </div>

        <div style={styles.scoreboard}>
          <div style={styles.scoreHeader}>
            <span style={styles.headerRank}>Rank</span>
            <span style={styles.headerUsername}>Player</span>
            <span style={styles.headerScore}>Distance</span>
            <span style={styles.headerDate}>Date</span>
          </div>
          <div style={styles.scoreList}>
            {scores.map((score, index) => (
              <div key={score.id} style={styles.scoreItem}>
                <span style={styles.rank}>{index + 1}.</span>
                <span style={styles.username}>{score.username}</span>
                <span style={styles.score}>{score.distance}</span>
                <span style={styles.date}>{formatDate(score.date)}</span>
              </div>
            ))}
          </div>
        </div>

        <button 
          style={styles.backButton}
          onClick={() => navigate('/menu')}
        >
          Back to Menu
        </button>
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
  },
  content: {
    textAlign: 'center',
    padding: '2rem',
    borderRadius: '15px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    maxWidth: '800px',
    width: '90%',
  },
  titleContainer: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '2rem',
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
  scoreboard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    padding: '1.5rem',
    marginBottom: '2rem',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  scoreHeader: {
    display: 'grid',
    gridTemplateColumns: '60px 1fr 120px 150px',
    gap: '1rem',
    padding: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '1rem',
    fontWeight: '600',
  },
  headerRank: { color: '#ff6b6b' },
  headerUsername: { color: '#fff' },
  headerScore: { color: '#4ecdc4' },
  headerDate: { color: '#a8a8a8' },
  scoreList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    maxHeight: '60vh',
    overflowY: 'auto',
    paddingRight: '0.5rem',
  },
  scoreItem: {
    display: 'grid',
    gridTemplateColumns: '60px 1fr 120px 150px',
    gap: '1rem',
    alignItems: 'center',
    padding: '1rem',
    borderRadius: '5px',
    background: 'rgba(255, 255, 255, 0.05)',
    transition: 'all 0.3s ease',
  },
  scoreItemHover: {
    background: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateX(5px)',
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
  backButton: {
    padding: '1rem 2rem',
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
    fontWeight: '600',
  },
};

export default Scoreboard; 