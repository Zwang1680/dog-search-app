import React, { useCallback, useEffect, useState } from 'react';
import { Dog, fetchAPI } from '../../services/fetchapi';


const SearchPage: React.FC = () => {
    const [breeds, setBreeds] = useState<string[]>([]);
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [sort, setSort] = useState<string>('name:asc');

    const handleSearch = useCallback(async (cursor?: string) => {
        try {
            const searchResult = await fetchAPI.searchDogs({
                size: 20,
                breeds: selectedBreeds,
                sort: sort,
                from: cursor 
            });
            console.log(searchResult);
      
            const dogData: Dog[] = await fetchAPI.getDogsByIds(searchResult.resultIds);
            setDogs(dogData);
          } catch (error) {
            console.error('Error during dog search:', error);
            // Display error to the user
          }
    }, [selectedBreeds, sort]);

    useEffect(() => {
        fetchAPI.getBreeds().then(setBreeds);
    }, [])

    return (
        <div>
            <div>
                <select multiple value={selectedBreeds} onChange={(e) => setSelectedBreeds(Array.from(e.target.selectedOptions, (option) => option.value))}>
                    {breeds.map((breed) => (
                        <option key={breed} value={breed}>
                        {breed}
                        </option>
                    ))}
                </select>
                <button onClick={() => handleSearch()}>Search</button>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="name:asc">Name Ascending</option>
                    <option value="name:desc">Name Descending</option>
                    <option value="age:asc">Age Ascending</option>
                    <option value="age:desc">Age Descending</option>
                    <option value="breed:asc">Breed Ascending</option>
                    <option value="breed:desc">Breed Descending</option>
                </select>
            </div>
            <div>
                {dogs.map((dog) => (
                    <div key={dog.id}>
                    <img src={dog.img} alt={dog.name} style={{ maxWidth: '100px' }} />
                    <p>Name: {dog.name}</p>
                    <p>Breed: {dog.breed}</p>
                    <p>Age: {dog.age}</p>
                    <p>Zip Code: {dog.zip_code}</p>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default SearchPage