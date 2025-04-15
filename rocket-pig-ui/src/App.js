import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './components/Login';
import UsersList from './components/UsersList';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


function App() {
 /* Ovo sam zakomentirao prije nego sam poceo raditi sa routingom, commit na gitu naziv "Prije routinga"
 const [users, setUsers] = useState([]);   //users - Array koji sadrži dohvacene korisnike, setUsers je funkcija sa kojom se azuriraju usersi

  useEffect(() => {
    axios.get('http://localhost:5154/api/users')
      .then(response => {
        console.log("Povezano s backendom!", response.data);
        setUsers(response.data); //response se pohranjuje u Users
      })
      .catch(error => {
        console.error("Greška u povezivanju s backendom!", error);
      });
  }, []);
*/

  //UI dio ispod
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Korisnici</h1>
      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <strong>ID:</strong> {user.id} — <strong>Korisničko ime:</strong> {user.username}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nema dostupnih korisnika.</p>
      )}
    </div>
  );
}

export default App; //exportas da bi koristio negdje drugdje, npr index.js
