import React, { useCallback, useEffect, useState } from 'react';
import { Dog, fetchAPI } from '../../services/fetchapi';
import SearchControls from './components/SearchControls';
import useDebounce from './components/useDebounce';


const SearchPage: React.FC = () => {
    const [breeds, setBreeds] = useState<string[]>([]);
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [page, setPage] = useState<{ next?: string; prev?: string}>({})
    const [searchParams, setSearchParams] = useState<any>({ size: 20, sort: 'name:asc' });

    const debouncedSearchParams = useDebounce(searchParams, 500);

    const handleSearch = useCallback(async (query?: string) => {
        try {
            const searchResult = await fetchAPI.searchDogs({ ...debouncedSearchParams, from: query });
            console.log(searchResult);
            setPage({
              next: getCursorFromUrl(searchResult.next) || undefined,
              prev: getCursorFromUrl(searchResult.prev) || undefined,
            });
            const dogData: Dog[] = await fetchAPI.getDogsByIds(searchResult.resultIds);
            setDogs(dogData);
          } catch (error) {
            console.error('Error during dog search:', error);
          }
    }, [debouncedSearchParams]);

    const getCursorFromUrl = (url?: string): string | undefined => {
        if (!url) return undefined;
        const params = new URLSearchParams(url.split('?')[1]);
        return params.get('from') || undefined;
    };

    useEffect(() => {
        fetchAPI.getBreeds().then(setBreeds);
    }, [])

    useEffect(() => {
        handleSearch();
    }, [debouncedSearchParams, handleSearch]);

    return (
        <div>
            <SearchControls 
            breeds={breeds}
            searchParams={searchParams}
            setSearchParams={(partialParams) => {
                setSearchParams((prevSearchParams: {}) => ({
                  ...prevSearchParams,
                  ...partialParams,
                }))
            }}
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