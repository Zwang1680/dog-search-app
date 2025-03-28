import { Box, CardActions, CardContent, CardMedia, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, Fab, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import { Dog, fetchAPI, Location } from "../../../services/fetchapi";
import useDebounce from "./useDebounce";
import { Favorite, LocationOn, Remove } from "@mui/icons-material";
import 'mapbox-gl/dist/mapbox-gl.css';

interface DogInfoProps {
    selectedDog: Dog;
    isInfoOpen: boolean;
    handleClose: () => void;
    isMatchDog: boolean;
    favoriteDogs: Dog[];
    onAddToFavorites: (dogId: Dog) => void;
    onRemoveFromFavorites: (dogId: Dog) => void;
}

const DogInfo: React.FC<DogInfoProps> = ({selectedDog, isInfoOpen, handleClose, isMatchDog, favoriteDogs, onAddToFavorites, onRemoveFromFavorites}) => {
    const apiMaps = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

    const resetLocation: Location = {zip_code: '', longitude: 0, latitude: 0, city: '', state: '', county: ''};

    const [selectedDogLocation, setSelectedDogLocation] = useState<Location>(resetLocation);
    const [viewState, setViewState] = React.useState({
        longitude: -100,
        latitude: 40,
        zoom: 5
    });
    const debouncedDog = useDebounce(selectedDog, 250);

    const getSelectedDogLocation = useCallback(async () => {
        if (!debouncedDog) return
        try {
            const result : Location[] = await fetchAPI.getLocationsByZipCodes([debouncedDog?.zip_code]);
            if (result.length > 0){
                setSelectedDogLocation(result[0]);
                setViewState({ ...viewState, longitude: result[0].longitude, latitude: result[0].latitude })
            }
        } catch (err) {
            console.error('Error during dog search:', err);
        }
    }, [debouncedDog, viewState]);

    useEffect(() => {
        getSelectedDogLocation();
    }, [getSelectedDogLocation]);


    return (
        <Dialog open={isInfoOpen} onClose={handleClose} maxWidth="lg">
            {isMatchDog && (
                <DialogTitle>You Matched!</DialogTitle>
            )}
            {
                selectedDog.id !== '' && selectedDogLocation !== null ? (
                        <DialogContent sx={{display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flex: '1 0 auto'}}>
                                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                                        <Box sx={{display: 'flex', flexDirection: 'column'}}>
                                            <Typography variant='h5' component='div' sx={{color: 'text.primary'}}>
                                                {selectedDog.name}
                                            </Typography>
                                            <Typography variant='body2' component='div' sx={{color: 'text.secondary'}}>
                                                Age: {selectedDog.age}
                                            </Typography>
                                            <Typography variant='body2' component='div' sx={{color: 'text.secondary'}}>
                                                Breed: {selectedDog.breed}
                                            </Typography>
                                        </Box>
                                        {
                                            !favoriteDogs?.includes(selectedDog) && !isMatchDog ? (
                                            <CardActions sx={{marginLeft: 8}}>
                                                <Fab color='primary' size='large' aria-label='like' onClick={() => {onAddToFavorites(selectedDog)}}>
                                                    <Favorite/>
                                                </Fab>
                                                </CardActions>
                                            ) : !isMatchDog ? (
                                                <CardActions sx={{marginLeft: 8}}>
                                                    <Fab color='warning' size='large' aria-label='remove' onClick={() => onRemoveFromFavorites(selectedDog)}>
                                                        <Remove/>
                                                    </Fab>
                                                </CardActions>
                                        ) : (
                                            <Box/>
                                        )
                                    }
                                    </Box>
                                    <Divider sx={{ margin: 2}}/>
                                    <Box>
                                        {selectedDogLocation.longitude !== 0 && selectedDogLocation.latitude !== 0 && (
                                            <Map
                                                {... viewState}
                                                mapboxAccessToken={apiMaps}
                                                scrollZoom={true}
                                                style={{width: 300, height: 300}}
                                                mapStyle='mapbox://styles/mapbox/streets-v9'
                                            >
                                                <Marker longitude={viewState.longitude} latitude={viewState.latitude} anchor='bottom'>
                                                    <LocationOn/>
                                                </Marker>
                                            </Map> 
                                        )}
                                        <Typography variant='body2' component='div' sx={{color: 'text.secondary'}}>
                                            {`${selectedDogLocation.city}, ${selectedDogLocation.state} ${selectedDogLocation.zip_code}`}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Box>
                            <CardMedia
                                component="img"
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
    );
}
export default DogInfo