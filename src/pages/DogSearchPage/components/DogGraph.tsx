import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Dog } from '../../../services/fetchapi';
import { Box, Button, CardActions, CardMedia, Container, Dialog, Divider, Drawer, Fab, Grid2, ImageList, ImageListItem, ImageListItemBar, Modal, Typography } from '@mui/material';
import { ArrowForwardIos, Favorite, Remove } from '@mui/icons-material';

interface DogGraphProps {
  dogs: Dog[];
  favoriteDogs: Dog[];
  onAddToFavorites: (dogId: Dog) => void;
  onRemoveFromFavorites: (dogId: Dog) => void;
}

const DogGraph: React.FC<DogGraphProps> = ({ dogs, favoriteDogs, onAddToFavorites, onRemoveFromFavorites }) => {
    const [isFavVisible, setIsFavVisible] = useState<boolean>(false);
    const [selectedDog, setSelectedDog] = useState<Dog>();
    const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setIsFavVisible(newOpen);
    };

    const openDogInfo = (dog: Dog) => () => {
        setSelectedDog(dog);
        setIsInfoOpen(true);
    }

    const createDogCard = (dog: Dog) => {
        return (
            <ImageListItem key={dog.id}>
            <img
                src={dog.img}
                alt={dog.name}
                loading="lazy"
                onClick={openDogInfo(dog)}
            />
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
            </ImageListItem>
        );
    } 

    return (
        <Container className="dogListContainer" maxWidth="xl">
            <Grid2 container direction="column" spacing={2} sx={{
                justifyContent: "flex-start",
                alignItems: "stretch",
            }}>
                <Grid2 size={{ xs:12, md: 1}}>
                    <Button onClick={toggleDrawer(true)}>
                        <ArrowForwardIos/>
                    </Button>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 11}}>
                    <ImageList sx={{ width: '100%', height: '100%'}} cols={5}>
                        {dogs.map((dog) => (
                            createDogCard(dog)
                        ))}
                    </ImageList>
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
                            <ImageListItem key={dog.id}>
                                <img
                                    src={dog.img}
                                    alt={dog.name}
                                    loading="lazy"
                                />
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
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Box>
            </Drawer>
            <Dialog open={isInfoOpen} onClose={() => setIsInfoOpen(false)}>
                {
                    selectedDog ? (
                        <Card sx={{ display: 'flex'}}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flex: '1 0 auto'}}>
                                <Typography variant='subtitle1' component='div' sx={{color: 'text.secondary'}}>
                                        {selectedDog.name}
                                    </Typography>
                                    <Typography variant='subtitle1' component='div' sx={{color: 'text.secondary'}}>
                                        Age: {selectedDog.age}
                                    </Typography>
                                    <Typography variant='subtitle1' component='div' sx={{color: 'text.secondary'}}>
                                        Breed: {selectedDog.breed}
                                    </Typography>
                                    <Typography variant='subtitle1' component='div' sx={{color: 'text.secondary'}}>
                                        Zip Code: {selectedDog.zip_code}
                                    </Typography>
                                </CardContent>
                            </Box>
                            <CardMedia
                                component="img"
                                sx={{ width: '400px'}}
                                image={selectedDog.img}
                                alt={selectedDog.id}
                            />
                        </Card>
                    ) : (
                        <Box></Box>
                    )
                }
            </Dialog>
        </Container>
    );
};

export default DogGraph;