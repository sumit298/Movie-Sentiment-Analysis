import axios from "axios";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";


interface searchBarProps {
    searchValue: string,
    handleSearch: any
}

const SearchBar: React.FC<searchBarProps> = ({ searchValue, handleSearch }) => {




    return (
        <>
            <input type="search" value={searchValue} onChange={handleSearch} className='w-full rounded-lg px-4 text-lg text-black' placeholder='Enter the movie name' />
        </>
    )
}

export default SearchBar;