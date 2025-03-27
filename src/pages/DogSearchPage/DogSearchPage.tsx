import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dog, fetchAPI, Location } from '../../services/fetchapi';
import SearchControls from './components/SearchControls';
import useDebounce from './components/useDebounce';
import DogGraph from './components/DogGraph';
import './DogSearchPage.css'
import { AppBar, Box, Button, Container, createTheme, Grid2, Modal, Paper, TablePagination, ThemeProvider, Toolbar, Typography } from '@mui/material';
import { Pets, Send } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DogSearchPage: React.FC = () => {
    const [breeds, setBreeds] = useState<string[]>([]);
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [page, setPage] = useState(0);
    const [numDogsPerPage, setNumDogsPerPage] = useState(15);
    const [totalDogs, setTotalDogs] = useState(1);
    const [searchParams, setSearchParams] = useState<any>({ sort: 'name:asc' });
    const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
    const nav = useNavigate();
    const isFetching = useRef(false);

    const numDogOptions = [15, 30, 50, 100]

    const debouncedSearchParams = useDebounce(searchParams, 500);

    const fetchDebounceDogs = useCallback(async () => {
        if (isFetching.current) return;
        isFetching.current = true;
        let cursor = page * numDogsPerPage;
        try {
            const result = await fetchAPI.searchDogs({
                ...debouncedSearchParams,
                from: cursor,
                size: numDogsPerPage,
            });
            const dogData: Dog[] = await fetchAPI.getDogsByIds(result.resultIds);
            setDogs(dogData);
            setTotalDogs(result.total);
        } catch (err) {
            console.error('Error during dog search:', err);
        } finally {
            isFetching.current = false;
        }
    }, [debouncedSearchParams, page, numDogsPerPage, isFetching]);
    
    useEffect(() => {
        fetchDebounceDogs();
    }, [fetchDebounceDogs]);

    useEffect(() => {
        fetchDebounceDogs();
    }, [fetchDebounceDogs, page]);

    useEffect(() => {
        setPage(0);
    }, [debouncedSearchParams, selectedLocations]);

    const handleAddToFavorites = (favDog: Dog) => {
        if (!favoriteDogs.includes(favDog)) {
            setFavoriteDogs([...favoriteDogs, favDog]);
        }
    };
    
    const handleRemoveFromFavorites = (favDog: Dog) => {
        setFavoriteDogs(favoriteDogs.filter((dog) => dog.id !== favDog.id));
    };

    const handleSendFavorites = () => {
        console.log(favoriteDogs)
        const match = fetchAPI.sendFavorites(favoriteDogs).catch(console.error);
        console.log(match);
        setFavoriteDogs([]);
    };

    const handleLocationsChange = (locations: Location[]) => {
        setSelectedLocations(locations);
        setSearchParams({ ...searchParams, zipCodes: locations.map((loc) => loc.zip_code) });
    };

    useEffect(() => {
        fetchAPI.getBreeds().then(setBreeds);
    }, [])

    const handleChangeDogsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        setNumDogsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        setSearchParams({ ...searchParams, size: numDogsPerPage});
    };

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        nav('/');
      };
    

    const darkTheme = createTheme({
        palette: {
          mode: 'dark',
          primary: {
            main: '#cc00cc',
          },
        },
    });
    

    return (
    <ThemeProvider theme={darkTheme}>
    <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar sx={{ justifyContent: 'space-between' }} disableGutters>
                    <Pets/>
                    <Typography
                    variant='h6'
                    noWrap
                    component='a'
                    sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        margin: 1,
                    }}>
                        Dog Search
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: 'flex' }}>
                        <Button
                            variant="contained"
                            endIcon={<Send/>} 
                            onClick={handleSendFavorites}
                        >
                            Match
                        </Button>
                    </Box>
                    <Button sx={{margin: 1}} key='Filters' onClick={() => setIsModalOpen(true)}>
                        Filters
                    </Button>
                    <Button variant="outlined" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </Container>
        </AppBar>
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12, md: 12}}>
        <Paper elevation={3} style={{ padding: '20px' }}>
            <DogGraph
            dogs={dogs}
            favoriteDogs={favoriteDogs}
            onAddToFavorites={handleAddToFavorites}
            onRemoveFromFavorites={handleRemoveFromFavorites}
            />
            {totalDogs > 1 && (
                <Box display="flex" justifyContent="center" mt={3}>
                    <TablePagination
                    component='div'
                    count={totalDogs}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={numDogsPerPage}
                    onRowsPerPageChange={handleChangeDogsPerPage}
                    labelRowsPerPage='Dogs per page:'
                    rowsPerPageOptions={numDogOptions}
                    />
                </Box>
            )}
        </Paper>
      </Grid2>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Paper style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px' }}>
          <SearchControls
            breeds={breeds}
            searchParams={searchParams}
            setSearchParams={(partialParams) => {
              setSearchParams((prevSearchParams: {}) => ({
                ...prevSearchParams,
                ...partialParams,
              }));
            }}
            selectedLocations={selectedLocations}
            onLocationsChange={handleLocationsChange}
          />
        </Paper>
      </Modal>
    </Grid2>
    </ThemeProvider>
    )
};

export default DogSearchPage