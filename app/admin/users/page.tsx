// app/admin/users/page.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * UserListPage component to display a paginated user list with search functionality.
 */
const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  /**
   * Fetches user data from the API.
   */
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users', {
        params: {
          searchTerm,
          page: currentPage,
        },
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  /**
   * Handles search term changes.
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  /**
   * Handles pagination change.
   */
  const handlePaginationChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, currentPage]);

  return (
    <div>
      <h1>User List</h1>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.isActive ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages !== null && totalPages > 1 && (
        <div>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePaginationChange(i + 1)}
              disabled={currentPage === i + 1}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserListPage;