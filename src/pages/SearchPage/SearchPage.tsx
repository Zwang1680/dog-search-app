import React, { useCallback, useEffect, useState } from 'react';
import { Dog, fetchAPI } from '../../services/fetchapi';
import SearchControls from './components/SearchControls';


const SearchPage: React.FC = () => {
    const [breeds, setBreeds] = useState<string[]>([]);
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [page, setPage] = useState<{ next?: string; prev?: string}>({})
    const [searchParams, setSearchParams] = useState<any>({ size: 20, sort: 'name:asc' });

    const handleSearch = useCallback(async (cursor?: string) => {
        try {
            const searchResult = await fetchAPI.searchDogs({ ...searchParams, from: cursor });
            console.log(searchResult);
            setPage({
              next: searchResult.next || undefined,
              prev: searchResult.prev || undefined,
            });
            console.log(searchResult);
            const dogData: Dog[] = await fetchAPI.getDogsByIds(searchResult.resultIds);
            setDogs(dogData);
          } catch (error) {
            console.error('Error during dog search:', error);
            // Display error to the user
          }
    }, [searchParams]);

    useEffect(() => {
        fetchAPI.getBreeds().then(setBreeds);
    }, [])

    return (
        <div>
            <SearchControls 
            breeds={breeds}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            onSearch={handleSearch}
            />
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
            <div>
                {page.prev && <button onClick={() => handleSearch(page.prev)}>Previous</button>}
                {page.next && <button onClick={() => handleSearch(page.next)}>Next</button>}
            </div>
        </div>
    )
};

export default SearchPage