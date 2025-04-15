import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = (buttonName) => {
    setHoveredButton(buttonName);
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  const checkUsernameExists = async (normalizedUsername) => {
    try {
      const response = await axios.get('http://localhost:5154/api/Users');
      const users = response.data;
      return users.some(user => user.username.toLowerCase() === normalizedUsername);
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  const validateForm = async () => {
    if (!username.trim()) {
      setError('Username is required');
      return false;
    }

    if (username.length < 4) {
      setError('Username must be at least 4 characters long');
      return false;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long');
      return false;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!isLogin) {
      const normalizedUsername = username.toLowerCase();
      const usernameExists = await checkUsernameExists(normalizedUsername);
      if (usernameExists) {
          setError('Username already exists');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!await validateForm()) return;

    const normalizedUsername = username.toLowerCase();
    const endpoint = isLogin ? 'login' : 'register';

    try {
      const response = await axios.post(`http://localhost:5154/api/users/${endpoint}`, {
        username: normalizedUsername,
        password
      });

      if (isLogin) {
        const { token } = response.data;
        localStorage.setItem('jwtToken', token);
        navigate('/menu');
      } else {
        setSuccess('Registration successful! You can now login.');
        setIsLogin(true);
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error(`${isLogin ? 'Login' : 'Registration'} error:`, error);
      setError(isLogin ? 'Invalid login credentials' : 'Registration failed');
    }
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
            Rocket Pig
          </h1>
        </div>
        <p style={styles.subtitle}>Launch Your Pig!</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
            />
          )}
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}
          <button 
            type="submit"
            style={{
              ...styles.button,
              ...(hoveredButton === 'submit' && styles.buttonHover)
            }}
            onMouseEnter={() => handleMouseEnter('submit')}
            onMouseLeave={handleMouseLeave}
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        
        <p style={styles.switchText}>
          {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}{' '}
          <span
            style={styles.switchLink}
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setSuccess(null);
            }}
          >
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
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
    maxWidth: '600px',
    width: '90%',
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    marginBottom: '1.5rem',
  },
  input: {
    padding: '1.2rem',
    fontSize: '1.1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: '1px',
  },
  inputFocus: {
    borderColor: '#4a90e2',
    boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.2)',
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
  error: {
    color: '#ff6b6b',
    marginBottom: '1rem',
    textAlign: 'center',
    fontSize: '0.9rem',
    letterSpacing: '1px',
    fontFamily: "'Poppins', sans-serif",
  },
  success: {
    color: '#4ecdc4',
    marginBottom: '1rem',
    textAlign: 'center',
    fontSize: '0.9rem',
    letterSpacing: '1px',
    fontFamily: "'Poppins', sans-serif",
  },
  switchText: {
    textAlign: 'center',
    color: '#a8a8a8',
    fontSize: '0.9rem',
    letterSpacing: '1px',
    fontFamily: "'Poppins', sans-serif",
  },
  switchLink: {
    color: '#4a90e2',
    cursor: 'pointer',
    textDecoration: 'underline',
    transition: 'color 0.3s ease',
    fontFamily: "'Poppins', sans-serif",
  },
};

export default Login;
