import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import UserList from './components/UsersList';
import Logout from './components/Logout'; // Dodano
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const isLoggedIn = !!localStorage.getItem('jwtToken'); // Provjera postoji li token

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isLoggedIn) return;

      try {
        const response = await axios.get('http://localhost:5154/api/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });
        console.log("Users fetched:", response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [isLoggedIn]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/users"
          element={
            isLoggedIn ? (
              <div>
                <Logout />
                <UserList users={users} />
              </div>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
