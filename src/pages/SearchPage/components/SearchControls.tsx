import { Box, Chip, FormControl, Grid2, InputLabel, MenuItem, OutlinedInput } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
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

  const handleBreedChange = (event: SelectChangeEvent<any>) => {
    const { value } = event.target;
    setSelectedBreeds(typeof value === 'string' ? value.split(',') : value);
    setSearchParams({ ...searchParams, breeds: typeof value === 'string' ? value.split(',') : value });
  };

  const handleSortChange = (e: SelectChangeEvent<string>) => {
    setSortOption(e.target.value);
    setSearchParams({ ...searchParams, sort: e.target.value });
  };

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12, sm: 6}}>
        <FormControl sx={{ m: 1, width: '100%' }}>
          <InputLabel id="multiple-chip-label">Breeds</InputLabel>
          <Select
            labelId="multiple-chip-label"
            id="multiple-chip"
            multiple
            value={selectedBreeds}
            onChange={handleBreedChange}
            renderValue={(selected) => (
              <div>
                {selected.map((value) => (
                  <Chip key={value} label={value} sx={{ m: 0.2, height: '100%' }} />
                ))}
              </div>
            )}
          >
            {breeds.map((breed) => (
              <MenuItem key={breed} value={breed}>
                {breed}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <FormControl sx={{ m: 1, width: '100%' }}>
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            id="sort-select"
            value={sortOption}
            label="Sort By"
            onChange={handleSortChange}
          >
            <MenuItem value="name:asc">Name Ascending</MenuItem>
            <MenuItem value="name:desc">Name Descending</MenuItem>
            <MenuItem value="age:asc">Age Ascending</MenuItem>
            <MenuItem value="age:desc">Age Descending</MenuItem>
            <MenuItem value="breed:asc">Breed Ascending</MenuItem>
            <MenuItem value="breed:desc">Breed Descending</MenuItem>
          </Select>
        </FormControl>
      </Grid2>
    </Grid2>
  );
};

export default React.memo(SearchControls);