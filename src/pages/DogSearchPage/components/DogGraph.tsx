import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Dog } from '../../../services/fetchapi';
import { Box, Button, CardActions, CardMedia, Container, Divider, Fab, Grid2, ImageList, ImageListItem, ImageListItemBar, Typography } from '@mui/material';
import { Favorite, Remove } from '@mui/icons-material';

interface DogGraphProps {
  dogs: Dog[];
  favoriteDogs: Dog[] | null;
  onAddToFavorites: (dogId: Dog) => void;
  onRemoveFromFavorites: (dogId: Dog) => void;
}

const DogGraph: React.FC<DogGraphProps> = ({ dogs, favoriteDogs, onAddToFavorites, onRemoveFromFavorites }) => {
    return (
        <Container className="dogListContainer" maxWidth="xl">
            <Grid2 container direction="row" spacing={2} sx={{
                justifyContent: "flex-start",
                alignItems: "stretch",
            }}>
                <Grid2 size={10.4}>
                    <ImageList sx={{ width: '100%', height: '100%'}} cols={5}>
                        {dogs.map((dog) => (
                            <ImageListItem key={dog.id}>
                                <img
                                    src={dog.img}
                                    alt={dog.name}
                                    loading="lazy"
                                />
                                <ImageListItemBar
                                    title={dog.name}
                                    subtitle={dog.breed}
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
                                        )
                                    }
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Grid2>
                <Divider orientation="vertical" flexItem />
                <Grid2 size={1.4}>
                    <Typography sx={{textAlign: "center"}} variant="body2" >Favorite Dogs</Typography>
                    <Box
                        sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100vh',
                        overflowY: 'auto',
                    }}
                    >
                        {favoriteDogs?.map((dog) => (
                            <Card 
                            key={dog.id} 
                            sx={{ 
                                padding: 2, 
                                marginBottom: 1, 
                                flexShrink: 0 
                            }}>
                                <CardMedia
                                    sx={{ height: 140 }}
                                    image={dog.img}
                                    title={dog.id}
                                />
                                <CardContent>
                                    <Typography variant="body2">
                                        {dog.name}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button onClick={() => onRemoveFromFavorites(dog)}>Remove</Button>
                                </CardActions>
                            </Card>
                        ))}
                    </Box>
                </Grid2>
            </Grid2>
        </Container>
    );
};

export default DogGraph;