import React, { useCallback, useEffect, useState } from 'react';
import { Dog, fetchAPI } from '../../services/fetchapi';
import SearchControls from './components/SearchControls';
import useDebounce from './components/useDebounce';
import DogGraph from './components/DogGraph';


const SearchPage: React.FC = () => {
    const [breeds, setBreeds] = useState<string[]>([]);
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [page, setPage] = useState<{ next?: string; prev?: string}>({})
    const [searchParams, setSearchParams] = useState<any>({ size: 20, sort: 'name:asc' });
    const [favoriteDogs, setFavoriteDogs] = useState<string[]>([]);

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

    const handleAddToFavorites = (dogId: string) => {
        if (!favoriteDogs.includes(dogId)) {
            setFavoriteDogs([...favoriteDogs, dogId]);
        }
    };
    
    const handleRemoveFromFavorites = (dogId: string) => {
        setFavoriteDogs(favoriteDogs.filter((id) => id !== dogId));
    };

    const handleSendFavorites = () => {
        console.log(favoriteDogs)
        const match = fetchAPI.sendFavorites(favoriteDogs).catch(console.error);
        console.log(match);
        setFavoriteDogs([]);
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
            <button onClick={handleSendFavorites}>Send Favorites</button>
            <DogGraph
            dogs={dogs}
            favoriteDogs={favoriteDogs}
            onAddToFavorites={handleAddToFavorites}
            onRemoveFromFavorites={handleRemoveFromFavorites}
            />
            <div>
                {page.prev && <button onClick={() => handleSearch(page.prev)}>Previous</button>}
                {page.next && <button onClick={() => handleSearch(page.next)}>Next</button>}
            </div>
        </div>
    )
};

export default SearchPage