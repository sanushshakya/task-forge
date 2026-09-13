// app/admin/users/page.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Import necessary hooks and components for pagination and filtering
import usePagination from '@/hooks/usePagination';
import useFilter from '@/hooks/useFilter';

// Import custom hooks to interact with the API
import useFetchUsers from '@/api/hooks/useFetchUsers';

// Component for displaying the user list in a table
const UserListPage = () => {
  const router = useRouter();
  const { page, perPage } = usePagination(); // Custom hook for handling pagination logic
  const [searchTerm, setSearchTerm] = useState(''); // State to hold the search term

  // Fetch users with pagination and filtering based on search term
  const { data: users, isLoading, isError, error } = useFetchUsers(page, perPage, searchTerm);

  useEffect(() => {
    if (isError) {
      console.error('Failed to fetch users:', error);
    }
  }, [error]);

  // Handle changes in pagination or search term
  const handlePaginationChange = (newPage: number, newPerPage: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage.toString(), perPage: newPerPage.toString() },
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h1>User List</h1>
      <input
        type="text"
        placeholder="Search by email..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Team ID</th>
            <th>Is Admin</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.teamId || 'None'}</td>
              <td>{user.isAdmin ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {error.message}</p>}
      {/* Pagination controls */}
      <div>
        <button
          disabled={page === 1}
          onClick={() => handlePaginationChange(page - 1, perPage)}
        >
          Previous
        </button>
        <span>{`${page} of ${Math.ceil((users?.length || 0) / perPage)}`}</span>
        <button
          disabled={page >= Math.ceil((users?.length || 0) / perPage)}
          onClick={() => handlePaginationChange(page + 1, perPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserListPage;
```

This file includes a React component for displaying a paginated list of users with an optional search filter. It uses custom hooks for pagination and filtering, as well as a hook to fetch user data from the API. The component handles changes in pagination and search term to update the displayed data accordingly.