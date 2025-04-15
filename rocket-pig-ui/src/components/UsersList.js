import React from 'react';

function UserList({ users }) {
  return (
    <div>
      <h2>Users</h2>
      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <strong>ID:</strong> {user.id} — <strong>Username:</strong> {user.username}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users available.</p>
      )}
    </div>
  );
}

export default UserList;
