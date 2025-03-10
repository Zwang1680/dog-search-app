import React from 'react';
import { Dog } from '../../../services/fetchapi';

interface DogGraphProps {
  dogs: Dog[];
  favoriteDogs: string[] | null;
  onAddToFavorites: (dogId: string) => void;
  onRemoveFromFavorites: (dogId: string) => void;
}

const DogGraph: React.FC<DogGraphProps> = ({ dogs, favoriteDogs, onAddToFavorites, onRemoveFromFavorites }) => {

    return (
        <div>
        {dogs.map((dog) => (
            <div key={dog.id}>
            <img src={dog.img} alt={dog.name} style={{ maxWidth: '100px' }} />
            <p>Name: {dog.name}</p>
            <p>Breed: {dog.breed}</p>
            <p>Age: {dog.age}</p>
            <p>Zip Code: {dog.zip_code}</p>
            {!favoriteDogs?.includes(dog.id) && (
                <button onClick={() => {onAddToFavorites(dog.id)}}>Favorite</button>
            )}
            {favoriteDogs?.includes(dog.id) && (
                <div>
                <p>Favorite!</p>
                <button onClick={() => onRemoveFromFavorites(dog.id)}>Remove from Favorites</button>
                </div>
            )}
            </div>
        ))}
        </div>
    );
};

export default DogGraph;