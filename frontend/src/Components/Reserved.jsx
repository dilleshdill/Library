import axios from "axios";
import React, { useState } from "react";
import { MdOutlineChair } from "react-icons/md";

const Reserved = () => {
    const [numFloors, setNumFloors] = useState(0);
    const [floorData, setFloorData] = useState([]);
    const [showGrids, setShowGrid] = useState(false);
    const [selected,setSelected] = useState([])
    const [showoutput,setOutput] = useState(false)
    


    console.log('floor data',floorData)
    console.log('grid data',showGrids)
    console.log('selected ',selected)
    // Handle number of floors change
    const handleFloorChange = (e) => {
        const floors = Number(e.target.value);
        setNumFloors(floors);

        // Initialize floors with empty grids
        setFloorData(
            Array.from({ length: floors }, () => ({
                grids: []
            }))
        );
    };

    // Handle number of grids per floor
    const handleGridChange = (floorIndex, e) => {
        const gridCount = Number(e.target.value);

        setFloorData((prevData) => {
            const newFloorData = [...prevData];
            newFloorData[floorIndex] = {
                grids: Array.from({ length: gridCount }, () => ({ row: 0, cols: 0 }))
            };
            return newFloorData;
        });
    };

    // Handle row & column changes for grids
    const handleGridDetailsChange = (floorIndex, gridIndex, field, value) => {
        setFloorData((prevData) => {
            const newFloorData = [...prevData];
            newFloorData[floorIndex].grids[gridIndex] = {
                ...newFloorData[floorIndex].grids[gridIndex],
                [field]: Number(value)
            };
            return newFloorData;
        });
    };

    const getHandel = (floor,grid,index) =>{
        const data = selected.filter(eachItem=>(
            !(eachItem.floor === floor && eachItem.grid === grid && eachItem.index === index )  
        ))
        setSelected(data)
        const isTrue =selected.find((eachItem)=>(
            eachItem.floor === floor && eachItem.grid === grid && eachItem.index === index   
        ))

        if (!isTrue){
            const updated  = [...selected]
            const newData = [...updated,{floor,grid,index}]
            setSelected(newData)
        }
    }

    const finalHandle = async () => {
        const libraryid = localStorage.getItem('libraryId');
    
        const formattedDimension = floorData.map((floor, floorIndex) => ({
            floor: floorIndex + 1, // Floor index starts from 1
            grids: floor.grids.map(grid => ({
                rows: grid.row, 
                cols: grid.cols
            }))
        }));
    
        try {
            const response = await axios.post('http://localhost:5002/slotbooking', {
                libraryId: libraryid,
                dimension: formattedDimension, // Correctly structured dimension array
                selected
            });
    
            console.log("Data saved successfully", response.data);
        } catch (e) {
            console.log('Something went wrong', e);
        }
    };
    

    return (
        <div className="p-4">
            <input
                placeholder="Enter No. of Floors"
                type="number"
                className="border p-2 mb-2"
                onChange={handleFloorChange}
            />

            {floorData.map((floor, floorIndex) => (
                <div key={floorIndex} className="mt-4 border p-4">
                    <h2 className="text-lg font-bold">Floor {floorIndex + 1}</h2>

                    <input
                        placeholder="Enter No. of Grids for this Floor"
                        type="number"
                        className="border p-2 mt-2"
                        onChange={(e) => handleGridChange(floorIndex, e)}
                    />

                    {floor.grids.map((grid, gridIndex) => (
                        <div key={gridIndex} className="mt-2">
                            <p>Grid {gridIndex + 1} - Rows:</p>
                            <input
                                type="number"
                                className="border p-2"
                                onChange={(e) => handleGridDetailsChange(floorIndex, gridIndex, "row", e.target.value)}
                            />

                            <p>Grid {gridIndex + 1} - Columns:</p>
                            <input
                                type="number"
                                className="border p-2"
                                onChange={(e) => handleGridDetailsChange(floorIndex, gridIndex, "cols", e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            ))}

            <button onClick={() => setShowGrid(true)} className="bg-green-500 text-white px-4 py-2 mt-4">
                Show Layout
            </button>

            {showGrids && (
                <div className="mt-6 w-screen">
                    {floorData.map((floor, floorIndex) => (
                        <div key={floorIndex} className="mb-6 border p-4">
                            <h2 className="text-lg font-bold text-center">Floor {floorIndex + 1}</h2>

                            <div className="flex flex-wrap justify-center">
                                {floor.grids.map((grid, gridIndex) => (
                                    <div key={gridIndex} className="m-4">
                                        <p className="text-md font-bold text-center">Grid {gridIndex + 1}</p>
                                        <div
                                            className="grid gap-2  p-2"
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: `repeat(${grid.cols}, 40px)`,
                                                gap: "5px",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {Array.from({ length: grid.row * grid.cols }).map((_, chairIndex) => (
                                                 selected.some(
                                                    (eachItem) =>
                                                      eachItem.floor === floorIndex + 1 &&
                                                      eachItem.grid === gridIndex + 1 &&
                                                      eachItem.index === chairIndex + 1
                                                  ) ? (
                                                    <MdOutlineChair size={30} className="text-amber-400 hover:text-amber-500 " onClick={()=>getHandel(floorIndex+1,gridIndex+1,chairIndex+1)} />

                                                  ) : (
                                                    <MdOutlineChair size={30} className="text-gray-400 hover:text-amber-500" onClick={()=>getHandel(floorIndex+1,gridIndex+1,chairIndex+1)} />
                                                  )
                                                
                                                
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <button onClick={()=>{setOutput(true)}}>Genarate</button>
            {
                showoutput && 
                <div className="mt-6 w-screen">
                    {floorData.map((floor, floorIndex) => (
                        <div key={floorIndex} className="mb-6 border p-4">
                            <h2 className="text-lg font-bold text-center">Floor {floorIndex + 1}</h2>

                            <div className="flex flex-wrap justify-center">
                                {floor.grids.map((grid, gridIndex) => (
                                    <div key={gridIndex} className="m-4">
                                        <p className="text-md font-bold text-center">Grid {gridIndex + 1}</p>
                                        <div
                                            className="grid gap-2  p-2"
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: `repeat(${grid.cols}, 40px)`,
                                                gap: "5px",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {Array.from({ length: grid.row * grid.cols }).map((_, chairIndex) => (
                                                selected.some(
                                                    (eachItem) =>
                                                      eachItem.floor === floorIndex + 1 &&
                                                      eachItem.grid === gridIndex + 1 &&
                                                      eachItem.index === chairIndex + 1
                                                  ) ? (
                                                    <div style={{ width: "30px", height: "30px" }}></div>
                                                  ) : (
                                                    <MdOutlineChair size={30} className="text-gray-400 hover:text-amber-500" />
                                                  )
                                                  
                                                
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button onClick={()=>finalHandle()}>Done</button>
                </div>
                
            }
        </div>
    );
};

export default Reserved;
