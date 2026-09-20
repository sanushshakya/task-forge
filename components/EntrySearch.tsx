// components/EntrySearch.tsx

import React, { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

interface EntrySearchProps {
  onSearch: (query: string) => void;
}

const EntrySearch: React.FC<EntrySearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 300),
    [onSearch]
  );

  // Handle input change and trigger debounced search
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search entries..."
        value={searchQuery}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default EntrySearch;