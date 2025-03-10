import React, { useState, useEffect, useCallback } from 'react';

interface SearchControlsProps {
  breeds: string[];
  searchParams: any;
  setSearchParams: React.Dispatch<React.SetStateAction<any>>;
}

const SearchControls: React.FC<SearchControlsProps> = ({
  breeds,
  searchParams,
  setSearchParams,
}) => {
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>(searchParams.breeds || []);
  const [sortOption, setSortOption] = useState<string>(searchParams.sort || 'name:asc');

  useEffect(() => {
    setSelectedBreeds(searchParams.breeds || []);
    setSortOption(searchParams.sort || 'name:asc');
  }, [searchParams]);

  const handleBreedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedBreeds(selectedOptions);
    setSearchParams({ ...searchParams, breeds: selectedOptions }); // Corrected call
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    setSearchParams({ ...searchParams, sort: e.target.value }); // Corrected call
  };

  return (
    <div>
      <select multiple value={selectedBreeds} onChange={handleBreedChange}>
        {breeds.map((breed) => (
          <option key={breed} value={breed}>
            {breed}
          </option>
        ))}
      </select>

      <select value={sortOption} onChange={handleSortChange}>
        <option value="name:asc">Name Ascending</option>
        <option value="name:desc">Name Descending</option>
        <option value="age:asc">Age Ascending</option>
        <option value="age:desc">Age Descending</option>
        <option value="breed:asc">Breed Ascending</option>
        <option value="breed:desc">Breed Descending</option>
      </select>
    </div>
  );
};

export default React.memo(SearchControls);