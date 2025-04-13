import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5154/api/users') // zamijeni port ako koristiš drugi
      .then(response => {
        console.log("Povezano s backendom!", response.data);
        setUsers(response.data);
      })
      .catch(error => {
        console.error("Greška u povezivanju s backendom!", error);
      });
  }, []);

  return (
    <div>
      <h1>Users List</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username}</li>  // Prikazivanje korisničkog imena
        ))}
      </ul>
    </div>
  );
}

export default App;
