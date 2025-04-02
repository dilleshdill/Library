import Sidebar from "./Sidebar"
import Header from "./Header";
import ViewBooks from "./ViewBooks";
import axios from "axios";
import { useEffect, useState } from "react";
const Dashboard = () =>{
  const [libraryName,setLibraryName] = useState("")
  
  useEffect(() => {
    const fetchDetails = async () => {
        try {
            const libraryId = localStorage.getItem("libraryId"); // Fix variable name
            if (!libraryId) {
                console.error("No libraryId found in localStorage");
                return;
            }

            const response = await axios.get(`http://localhost:5002/library?libraryId=${libraryId}`);
            console.log(response.data.library.name);
            setLibraryName(response.data.library.name)
        } catch (error) {
            console.error("Error fetching library details:", error);
        }
    };

    fetchDetails();
}, []);
  return(
    <div className="flex w-screen min-h-screen">
      <div className="w-[15%]">
        <Sidebar/>
      </div>
      <div className="flex flex-col w-[85%]">
        <Header/>
        <h1 className="flex justify-center">{libraryName}</h1>
        
      </div>
    </div>
  )
}
export default Dashboard;
