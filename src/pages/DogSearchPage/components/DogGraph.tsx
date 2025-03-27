import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Dog } from '../../../services/fetchapi';
import { Box, Button, CardActions, CardMedia, Container, Divider, Fab, Grid, Grid2, Stack, Typography } from '@mui/material';
import { Favorite, Remove } from '@mui/icons-material';

interface DogGraphProps {
  dogs: Dog[];
  favoriteDogs: Dog[] | null;
  onAddToFavorites: (dogId: Dog) => void;
  onRemoveFromFavorites: (dogId: Dog) => void;
}

const DogGraph: React.FC<DogGraphProps> = ({ dogs, favoriteDogs, onAddToFavorites, onRemoveFromFavorites }) => {
    const [selectedDog, setSelectedDog] = useState<Dog>();

    return (
        <Container className="dogListContainer" maxWidth="xl">
            <Grid2 container direction="row" spacing={2} sx={{
                justifyContent: "flex-start",
                alignItems: "stretch",
            }}>
                <Grid2 size={10.4}>
                    <Grid2 container spacing={1}
                    sx={{
                        height: '100vh',
                        overflowY: 'auto',
                    }}>
                        {dogs.map((dog) => (
                            <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }} key={dog.id}>
                                <Card>
                                    <CardMedia
                                        sx={{ height: 250 }}
                                        image={dog.img}
                                        title={dog.id}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="body1" component="div">
                                            {dog.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Breed: {dog.breed}
                                            <br />
                                            Age: {dog.age}
                                            <br />
                                            Zip Code: {dog.zip_code}
                                        </Typography>
                                    </CardContent>
                                    {!favoriteDogs?.includes(dog) && (
                                        <CardActions>
                                                <Fab color='primary' size='small' aria-label='like' onClick={() => {onAddToFavorites(dog)}}>
                                                    <Favorite/>
                                                </Fab>
                                        </CardActions>
                                    )}
                                    {favoriteDogs?.includes(dog) && (
                                        <CardActions>
                                            <Fab color='warning' size='small' aria-label='remove' onClick={() => onRemoveFromFavorites(dog)}>
                                                <Remove/>
                                            </Fab>
                                        </CardActions>
                                    )}
                                </Card> 
                            </Grid2>
                        ))}
                    </Grid2>
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