import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Dog } from '../../../services/fetchapi';
import { Button, CardActions, CardMedia, Container, Grid, Grid2, Stack, Typography } from '@mui/material';

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
                <Grid2 size={11}>
                    <Grid2 container spacing={2}>
                        {dogs.map((dog) => (
                            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={dog.id}>
                                <Card>
                                    <CardMedia
                                        sx={{ height: 200 }}
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
                                                <Button onClick={() => {onAddToFavorites(dog)}}>Favorite</Button>
                                        </CardActions>
                                    )}
                                    {favoriteDogs?.includes(dog) && (
                                        <CardActions>
                                            <Button onClick={() => onRemoveFromFavorites(dog)}>Remove</Button>
                                        </CardActions>
                                    )}
                                </Card> 
                            </Grid2>
                        ))}
                    </Grid2>
                </Grid2>
                <Grid2 size={1}>
                    <Typography sx={{textAlign: "center"}} variant="body2" >Favorite Dogs</Typography>
                    <Stack spacing={2} sx={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                    }}>
                        {favoriteDogs?.map((dog) => (
                            <Card>
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
                    </Stack>
                </Grid2>
            </Grid2>
        </Container>
    );
};

export default DogGraph;