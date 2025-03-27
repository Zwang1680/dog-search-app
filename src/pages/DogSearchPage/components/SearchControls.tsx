import { Box, Button, Chip, Divider, FormControl, Grid2, InputLabel, List, ListItem, ListItemButton, ListItemText, MenuItem, OutlinedInput, Paper, TextField, Typography } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchAPI, Location } from '../../../services/fetchapi';
import useDebounce from './useDebounce';

interface SearchControlsProps {
  breeds: string[];
  searchParams: any;
  setSearchParams: React.Dispatch<React.SetStateAction<any>>;
  selectedLocations: Location[]; 
  onLocationsChange: (locations: Location[]) => void; 
}

const SearchControls: React.FC<SearchControlsProps> = ({
  breeds,
  searchParams,
  setSearchParams,
  selectedLocations,
  onLocationsChange, 
}) => {
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>(searchParams.breeds || []);
  const [sortOption, setSortOption] = useState<string>(searchParams.sort || 'name:asc');
  const [locationSearch, setLocationSearch] = useState<any>({ zip_codes: [], city: '', states: [] });
  const [locationResults, setLocationResults] = useState<Location[]>([]);
  const debouncedLocationSearch = useDebounce(locationSearch, 500);
  const [citySearch, setCitySearch] = useState<string>('');
  const [stateSearch, setStateSearch] = useState<string>('');
  const [zipCodeSearch, setZipCodeSearch] = useState<string>('');
  

  const stateOptions = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  ];

  const handleLocationSearchFunction = useCallback(async () => {
    try {
      console.log(debouncedLocationSearch);
      const results = await fetchAPI.searchLocations(debouncedLocationSearch);
      console.log(results);
      setLocationResults(results.results);
    } catch (error) {
      console.error('Error searching locations:', error);
    }
  }, [debouncedLocationSearch]);

  useEffect(() => {
    setSelectedBreeds(searchParams.breeds || []);
    setSortOption(searchParams.sort || 'name:asc');
    handleLocationSearchFunction(); // Call the search function on mount and when debouncedLocationSearch changes
  }, [searchParams, debouncedLocationSearch, handleLocationSearchFunction]);

  const handleBreedChange = (event: SelectChangeEvent<any>) => {
    const { value } = event.target;
    setSelectedBreeds(typeof value === 'string' ? value.split(',') : value);
    setSearchParams({ ...searchParams, breeds: typeof value === 'string' ? value.split(',') : value });
  };

  const handleSortChange = (e: SelectChangeEvent<string>) => {
    setSortOption(e.target.value);
    setSearchParams({ ...searchParams, sort: e.target.value });
  };

  const handleCitySearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCitySearch(event.target.value);
    setLocationSearch({ ...locationSearch, city: event.target.value });
  };

  const handleStateSearchChange = (event: SelectChangeEvent<string>) => {
    setStateSearch(event.target.value);
    setLocationSearch({ ...locationSearch, states: [event.target.value] });
  };

  const handleZipCodeSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setZipCodeSearch(event.target.value);
    setLocationSearch({ ...locationSearch, zip_codes: [event.target.value] });
  };

  const handleLocationSelect = (location: Location) => {
    if (!selectedLocations.some((loc) => loc.zip_code === location.zip_code)) {
      const updatedLocations = [...selectedLocations, location];
      onLocationsChange(updatedLocations);
    }
  };

  const handleLocationRemove = (zipCode: string) => {
    const updatedLocations = selectedLocations.filter((loc) => loc.zip_code !== zipCode);
    onLocationsChange(updatedLocations);
  };

  return (
    <Paper style={{ padding: '20px', width: '600px', maxWidth: '90vw' }}>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 12}}>
          <Typography variant="h6" gutterBottom>Filter Dogs</Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel id="multiple-chip-label">Breeds</InputLabel>
            <Select
              labelId="multiple-chip-label"
              id="multiple-chip"
              multiple
              value={selectedBreeds}
              onChange={handleBreedChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {breeds.map((breed) => (
                <MenuItem key={breed} value={breed}>
                  {breed}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
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
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Location Search</Typography>
          <Grid2 container spacing={1} alignItems="center">
            <Grid2 size={{ xs: 6 }}>
              <TextField label="City" fullWidth value={citySearch} onChange={handleCitySearchChange}/>
            </Grid2>
            <Grid2 size={{ xs: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="state-select-label">State</InputLabel>
                <Select
                  labelId="state-select-label"
                  id="state-select"
                  value={stateSearch}
                  label="State"
                  onChange={handleStateSearchChange}
                >
                  {stateOptions.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 4 }}>
              <TextField label="Zip Code" fullWidth value={zipCodeSearch} onChange={handleZipCodeSearchChange} />
            </Grid2>
          </Grid2>
          {locationResults.length > 0 && (
            <Box sx={{ height: '200px', overflow: 'auto' }}>
              <List>
                {locationResults.map((location) => (
                  <ListItemButton key={location.zip_code} onClick={() => handleLocationSelect(location)}>
                    <ListItemText primary={`${location.city}, ${location.state} (${location.zip_code})`}  />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          )}
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 12 }}>
          <Box sx={{ height: '200px', overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>Selected Locations</Typography>
            <List>
              {selectedLocations.map((location) => (
                <ListItem key={location.zip_code}>
                  <ListItemText primary={`${location.city}, ${location.state} (${location.zip_code})`} />
                  <Button size="small" onClick={() => handleLocationRemove(location.zip_code)}>Remove</Button>
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid2>
      </Grid2>
    </Paper>
  );
};

export default React.memo(SearchControls);