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
  const navigate = useNavigate();

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
      setError('Korisničko ime nije uneseno');
      return false;
    }

    if (username.length < 4) {
      setError('Ime mora imati barem 4 znaka');
      return false;
    }

    if (password.length < 4) {
      setError('Lozinka mora imati barem 4 znaka');
      return false;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Lozinke se ne podudaraju');
      return false;
    }

    if (!isLogin) {
      const normalizedUsername = username.toLowerCase();
      const usernameExists = await checkUsernameExists(normalizedUsername);
      if (usernameExists) {
        setError('Korisničko ime već postoji');
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
        navigate('/users');
      } else {
        setSuccess('Registracija uspješna! Možete se prijaviti.');
        setIsLogin(true);
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error(`${isLogin ? 'Login' : 'Registration'} error:`, error);
      setError(isLogin ? 'Neispravni podaci za prijavu' : 'Registracija nije uspjela');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>{isLogin ? 'Prijava' : 'Registracija'}</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Korisničko ime"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Lozinka"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Potvrdi lozinku"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
            />
          )}
          <button type="submit" style={styles.button}>
            {isLogin ? 'Prijavi se' : 'Registriraj se'}
          </button>
        </form>
        <p style={styles.switchText}>
          {isLogin ? 'Nemate račun?' : 'Već imate račun?'}{' '}
          <span
            style={styles.switchLink}
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setSuccess(null);
            }}
          >
            {isLogin ? 'Registriraj se' : 'Prijavi se'}
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
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  inputFocus: {
    borderColor: '#007bff',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  error: {
    color: '#dc3545',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  success: {
    color: '#28a745',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  switchText: {
    textAlign: 'center',
    marginTop: '1rem',
    color: '#666',
  },
  switchLink: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default Login;
