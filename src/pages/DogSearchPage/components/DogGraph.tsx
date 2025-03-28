import React, { useCallback, useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Dog, fetchAPI, Location } from '../../../services/fetchapi';
import { Box, Button, CardActions, CardMedia, CircularProgress, Container, Dialog, DialogContent, DialogTitle, Divider, Drawer, Fab, Grid2, ImageList, ImageListItem, ImageListItemBar, Modal, Typography } from '@mui/material';
import { ArrowForwardIos, FastRewind, Favorite, Remove } from '@mui/icons-material';
import useDebounce from './useDebounce';
import MapView from 'react-native-maps';
import { GoogleMap, Marker } from 'react-google-maps';
import { Map } from 'mapbox-gl';

interface DogGraphProps {
  dogs: Dog[];
  favoriteDogs: Dog[];
  onAddToFavorites: (dogId: Dog) => void;
  onRemoveFromFavorites: (dogId: Dog) => void;
}

const DogGraph: React.FC<DogGraphProps> = ({ dogs, favoriteDogs, onAddToFavorites, onRemoveFromFavorites }) => {
    const resetDog: Dog = {id: '', name: '', breed: '', img: '', age: 0, zip_code: ''}
    const resetLocation: Location = {zip_code: '', longitude: 0, latitude: 0, city: '', state: '', county: ''};

    const [isFavVisible, setIsFavVisible] = useState<boolean>(false);
    const [selectedDog, setSelectedDog] = useState<Dog>(resetDog);
    const [selectedDogLocation, setSelectedDogLocation] = useState<Location>(resetLocation);
    const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);

    const debouncedDog = useDebounce(selectedDog, 500);

    const getSelectedDogLocation = useCallback(async () => {
        if (!debouncedDog) return
        try {
            const result : Location[] = await fetchAPI.getLocationsByZipCodes([debouncedDog?.zip_code]);
            if (result.length > 0){
                setSelectedDogLocation(result[0]);
            }
        } catch (err) {
            console.error('Error during dog search:', err);
        }
    }, [debouncedDog]);

    useEffect(() => {
        getSelectedDogLocation();
    }, [getSelectedDogLocation]);

    const handleClose = () => {
        setIsInfoOpen(false);
        setSelectedDog(resetDog);
        setSelectedDogLocation(resetLocation);
    };


    const toggleDrawer = (newOpen: boolean) => () => {
        setIsFavVisible(newOpen);
    };

    const openDogInfo = (dog: Dog) => () => {
        setSelectedDog(dog);
        setIsInfoOpen(true);
    }

    const createDogCard = (dog: Dog, isFav: boolean) => {
        return (
            <ImageListItem key={dog.id}>
            <img
                src={dog.img}
                alt={dog.name}
                loading="lazy"
                onClick={openDogInfo(dog)}
            />
            { isFav ? (
                <ImageListItemBar
                title={dog.name}
                subtitle={dog.breed}
                position="bottom"
                actionIcon={(
                        <CardActions>
                            <Fab color='warning' size='small' aria-label='remove' onClick={() => onRemoveFromFavorites(dog)}>
                                <Remove/>
                            </Fab>
                        </CardActions>
                )}
            />
            ) : (
            <ImageListItemBar
                title={dog.name}
                subtitle={dog.breed}
                position="below"
                actionIcon={
                    !favoriteDogs?.includes(dog) ? (
                        <CardActions>
                                <Fab color='primary' size='small' aria-label='like' onClick={() => {onAddToFavorites(dog)}}>
                                    <Favorite/>
                                </Fab>
                        </CardActions>
                    ) : (
                        <CardActions>
                            <Fab color='warning' size='small' aria-label='remove' onClick={() => onRemoveFromFavorites(dog)}>
                                <Remove/>
                            </Fab>
                        </CardActions>
                    )}
                    />
                )
            }
            </ImageListItem>
        );
    } 

    return (
        <Container maxWidth='xl'>
            <Grid2 container direction='column' spacing={2} sx={{
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Grid2 size={12}>
                    <Box sx={{width: '100%', display:'flex', justifyContent:'flex-start'}}>
                        <Button onClick={toggleDrawer(true)}>
                            <Typography variant="body2">
                                Show Liked Dogs
                            </Typography>
                            <ArrowForwardIos/>
                        </Button>
                    </Box>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 11}} style={{ height: '100%' }}>
                    {dogs.length > 0 ? (
                    <ImageList sx={{ width: '100%', height: '100%'}} cols={5}>
                        {dogs.map((dog) => (
                            createDogCard(dog, false)
                        ))}
                    </ImageList>
                    ) : (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center', 
                            height: '100%', 
                            width: '100%' }}>
                            <Typography variant='h4'>No dogs match filter</Typography>
                        </Box>
                    )}
                </Grid2>
            </Grid2>
            <Drawer anchor='left' open={isFavVisible} onClose={toggleDrawer(false)}>
                <Box sx={{width: '200px'}}>
                    <Typography variant="body2" sx={{
                        textAlign: "center", 
                        margin: 2,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none'
                    }}>
                        Liked
                    </Typography>
                    <Divider/>
                    <ImageList sx={{ width: '100%', padding: 1}} variant="quilted" cols={1} rowHeight={200}>
                        {favoriteDogs.map((dog) => (
                            createDogCard(dog, true)
                        ))}
                    </ImageList>
                </Box>
            </Drawer>
            <Dialog open={isInfoOpen} onClose={handleClose}>
                <DialogTitle>More Info</DialogTitle>
                {
                    selectedDog.id !== '' ? (
                            <DialogContent sx={{display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ flex: '1 0 auto'}}>
                                        <Typography variant='body2' component='div' sx={{color: 'text.secondary'}}>
                                            {selectedDog.name}
                                        </Typography>
                                        <Typography variant='body2' component='div' sx={{color: 'text.secondary'}}>
                                            Age: {selectedDog.age}
                                        </Typography>
                                        <Typography variant='body2' component='div' sx={{color: 'text.secondary'}}>
                                            Breed: {selectedDog.breed}
                                        </Typography>
                                        {
                                            selectedDogLocation !== null ? (
                                                <Box>
                                                    <Typography variant='body2' component='div' sx={{color: 'text.secondary'}}>
                                                        Location: {`${selectedDogLocation.city}, ${selectedDogLocation.state} ${selectedDogLocation.zip_code}`}
                                                    </Typography>
                                                    <Map
                                                </Box>
                                            ) : (
                                                <Typography variant='body2' component='div' sx={{color: 'text.secondary'}}>
                                                    Zip Code: {selectedDog.zip_code}
                                                </Typography>
                                            )
                                        }
                                    </CardContent>
                                </Box>
                                <CardMedia
                                    component="img"
                                    sx={{ width: '200px'}}
                                    image={selectedDog.img}
                                    alt={selectedDog.id}
                                />
                            </DialogContent>
                    ) : (
                        <DialogContent>
                            <CircularProgress />
                        </DialogContent>
                    )
                }
            </Dialog>
        </Container>
    );
};

export default DogGraph;