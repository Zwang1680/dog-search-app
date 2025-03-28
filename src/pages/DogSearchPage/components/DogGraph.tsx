import React, { useState } from 'react';
import { Dog } from '../../../services/fetchapi';
import { Box, Button, CardActions, Container, Divider, Drawer, Fab, Grid2, ImageList, ImageListItem, ImageListItemBar, Typography } from '@mui/material';
import { ArrowForwardIos, Favorite, Remove } from '@mui/icons-material';
import 'mapbox-gl/dist/mapbox-gl.css';
import './DogGraph.css'
import DogInfo from './DogInfo';

interface DogGraphProps {
  dogs: Dog[];
  favoriteDogs: Dog[];
  onAddToFavorites: (dogId: Dog) => void;
  onRemoveFromFavorites: (dogId: Dog) => void;
}

export const resetDog: Dog = {id: '', name: '', breed: '', img: '', age: 0, zip_code: ''}

const DogGraph: React.FC<DogGraphProps> = ({ dogs, favoriteDogs, onAddToFavorites, onRemoveFromFavorites }) => {

    const [isFavVisible, setIsFavVisible] = useState<boolean>(false);
    const [selectedDog, setSelectedDog] = useState<Dog>(resetDog);
    const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);

    const handleClose = () => {
        setIsInfoOpen(false);
        setSelectedDog(resetDog);
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
                className='clickable-img'
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
            <DogInfo
                selectedDog={selectedDog}
                isInfoOpen={isInfoOpen}
                handleClose={handleClose}
                isMatchDog={false}
                favoriteDogs={favoriteDogs}
                onAddToFavorites={onAddToFavorites}
                onRemoveFromFavorites={onRemoveFromFavorites}
            />
        </Container>
    );
};

export default DogGraph;