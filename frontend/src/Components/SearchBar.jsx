import axios from "axios";
import React, { useEffect, useState } from "react";

const SearchBar = ({doRefresh}) => {
    const [searchTerm, setSearchTerm] = useState("");
    
    useEffect(() => {
        const fetchSearchTerm = async () => {
            try {
                const email = localStorage.getItem("email");
                if (!email) return;

                const searchItem = await axios.get(`http://localhost:5002/getSearch?email=${email}`);

                if (searchItem.status === 200) {
                    setSearchTerm(searchItem.data.value);
                    console.log(searchItem.data.value)
                } else {
                    setSearchTerm("");
                }
            } catch (error) {
                console.error("Error fetching search term:", error);
                setSearchTerm("");
            }
        };

        fetchSearchTerm();
    }, []);

    const handleSearch=async()=>{
        try{
            const email = localStorage.getItem("email")
            if (!email) return;
            const response=await axios.post('http://localhost:5002/getSearch',{
                email,
                searchTerm,
            })
            if (response.status===200){
                console.log('added succesffulyy')                
            }
            doRefresh()
        }catch(e){
            console.log("something went wrong",e)
        }
    }

    return (
        <label className="mx-auto  w-full md:w-[80%] flex flex-col md:flex-row items-center bg-white py-2 px-4 rounded-2xl gap-3  focus-within:border-gray-300">
            <input
                id="search-bar"
                type="text"
                placeholder="Your keyword here"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-6 py-3 w-full rounded-md flex-1 outline-none bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleSearch}
                className="w-full md:w-auto px-6 py-3 !bg-gray-800 text-white border-black rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-70"
            >
                <span className="text-sm font-semibold whitespace-nowrap">Search</span>
            </button>
        </label>
    );
};

export default SearchBar;
