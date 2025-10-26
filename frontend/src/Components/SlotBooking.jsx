import axios from "axios";
import React, { useState, useEffect } from "react";
import { MdOutlineChair } from "react-icons/md";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useLocation } from "react-router-dom";


const SlotBooking = () => {
    const location = useLocation();
    const [floorData, setFloorData] = useState([]);
    const [selected, setSelected] = useState([]);
    const [userSelected, setUserSelected] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("10:00");
    const bookId = location.state;
    const [reservedBooks, setReservedBooks] = useState([]);
    const [freeTimes, setFreeTime] = useState([]);
    const [showModel, setShowModel] = useState(false);
    const [timing,setTiming] = useState(null)
    const [showAvailable,setShowAvailable] = useState(false)
    const [checkAvailabe,setChekAvailable]=useState(false)
    const [positionArray,setPositionArray] = useState([])
    const [isButtonShow,setButtonShow] = useState(false)
    // Generate next 30 days for date selection
    const getNextMonthDates = () => {
        const dates = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            dates.push(date.toISOString().split("T")[0]);
        }
        return dates;
    };

    useEffect(() => {

        console.log(bookingDetails)
        const getTimings = async () =>{
            try {
                const libraryId = localStorage.getItem('selectedLibrary'); // Ensure this is set
        
                if (!libraryId) {
                    console.error("Library ID is not set in localStorage");
                    return false;
                }
        
                const response = await axios.post(`${import.meta.env.VITE_DOMAIN}/library/getTimings`, { libraryId });
        
                if (response.status === 200) {
                    console.log("Successfully fetched library timings",response.data);
                    setTiming(response.data)
                    console.log(response.data)
                }
        
                return false;
            } catch (error) {
                console.error("Error fetching library timings:", error);
                return false;
            }
        }
        getTimings()
        fetchedList();
        fetchedBookingList();
    }, []);

    const fetchedList = async () => {
        const selectedLibrary = localStorage.getItem("selectedLibrary");
        try {
            const response = await axios.post(`${import.meta.env.VITE_DOMAIN}/slotbooking/getslotdetailes`, { selectedLibrary });
            if (response.status === 200) {
                const updatedData = response.data.user.dimension.map(eachItem => ({ grids: eachItem.grids }));
                setFloorData(updatedData);
                setSelected(response.data.user.selected);
            }
        } catch (e) {
            console.error("Something went wrong:", e);
        }
    };

    const fetchedBookingList = async () => {
        try {
            const libraryId = localStorage.getItem('selectedLibrary');
            const response = await axios.post(`${import.meta.env.VITE_DOMAIN}/slotbooking/getBookingSlots`, { libraryId });
    
            if (response.status === 200) {
                console.log(response.data);
                
                if (response.data && Array.isArray(response.data.data)) {
                    const updatedData = response.data.data.flatMap(eachItem =>
                        eachItem.reservations.flatMap(item =>
                            item.reservedAt.map(newItem => ({
                                position: newItem.position,
                                date: newItem.date,
                                startTime: newItem.startTime,
                                endTime: newItem.endTime,
                                status:newItem.status,
                            }))
                        )
                    );
    
                    console.log("updatedData", updatedData);
                    setReservedBooks(updatedData);
    
                   
                    const transformedBookings = updatedData.reduce((acc, booking) => {
                        const positionKey = `${booking.position.floor}-${booking.position.grid}-${booking.position.index}`;
    
                        if (!acc[positionKey]) {
                            acc[positionKey] = { position: positionKey, time: [] };
                        }
    
                        acc[positionKey].time.push({
                            startTime: booking.startTime,
                            endTime: booking.endTime
                        });
    
                        return acc;  // ✅ Return the accumulator inside reduce
                    }, {});  // ✅ Initialize an empty object
    
                    console.log("transformedBookings:", transformedBookings);
                    
                    // Convert object to array before setting state
                    setPositionArray(Object.values(transformedBookings));
                }
            }
        } catch (e) {
            console.log("Something went wrong:", e);
        }
    };
    
    

    const getSelected = (floor, grid, index) => {
        console.log(bookingDetails)
        setBookingDetails({ floor, grid, index });
        
        setOpenModal(true);
    };


    const isSlotAvailable = (floor, grid, index) => {
        // console.log(reservedBooks);
        
        return !reservedBooks.some(item =>
            item.date === selectedDate &&
            item.position.floor === floor &&
            item.position.grid === grid &&
            item.position.index === index && 
            item.status === "Approved"
        );
    };

    const isTotallyBooked = (floor, grid, index) => {
                
                const data =reservedBooks.some(item => (



                    item.date === selectedDate &&
                    parseInt(item.startTime) === parseInt(timing.data.startTime) &&
                    item.endTime === timing.data.endTime &&
                    item.position.floor === floor &&
                    item.position.grid === grid &&
                    item.position.index === index
        )
                    
                    
                 ) 
                 
                 return data
    };

    const confirmBooking = async () => {
        
        setUserSelected({ ...bookingDetails, bookId, selectedDate, startTime, endTime });
        const libraryId = localStorage.getItem('selectedLibrary');
        const email = localStorage.getItem('email');
        try {
            const data = {
                libraryId,
                bookingDetails,
                bookId,
                selectedDate,
                startTime,
                endTime,
                status:"Approved",
            };
            const response = await axios.post(`${import.meta.env.VITE_DOMAIN}/api/auth/reserve-book`, {
                data, email
            });
            if (response.status === 200) {
                fetchedList();
                fetchedBookingList();
                console.log("Booking successful");
            }
        } catch (e) {
            console.log("Something went wrong", e);
        }
        setOpenModal(false);
    };

    const getShowHover = (floor, grid, index) => {
        const data = reservedBooks.filter(item => (
            item.date === selectedDate && 
            item.position.floor === floor &&
            item.position.grid === grid &&
            item.position.index === index
        ));
        const times = data.map(eachItem => ({
            startTime: eachItem.startTime,
            endTime: eachItem.endTime
        }));
        setFreeTime(times);
        setShowModel(true);
    };

    

    const showAvailableTiming = () => {
        setShowAvailable(true);
        setChekAvailable(true)
        console.log("resereved",reservedBooks);
    
        // Reduce function to transform data
       
    };
    
    console.log("postionarry",positionArray)

    const getVerified =(floor,grid,index)=>{
        showAvailableTiming(true)
        
        const data = positionArray.find(eachItem=>eachItem.position === `${floor}-${grid}-${index}`)
        const isShow = data.time.find(eachItem => eachItem.startTime === startTime && eachItem.endTime === endTime)
        if(isShow){
            getShowHover(floor,grid,index)
        }
        else{
            
            getSelected(floor,grid,index)
        }
    }

    const getColorVerifed =(floor,grid,index)=>{
        const data = positionArray.find(eachItem=>eachItem.position === `${floor}-${grid}-${index}`)
        console.log(data)
        const isShow = data.time.some(eachItem => (eachItem.startTime === startTime && eachItem.endTime === endTime) || !(eachItem.startTime >= endTime || eachItem.endTime <= startTime))
        console.log(isShow)
        return !isShow
    }
    
    const toggleSlotButton = () => {
        showAvailableTiming()
    }
    
    return (
        <div className="container mx-auto px-4 py-6 max-w-screen" >
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Slot Booking</h1>
            
            {/* Date Selection */}
            <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold mb-3">Select Date</h2>
                <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-thin scrollbar-thumb-gray-300" style={{scrollbarWidth:'none'}}>
                    {getNextMonthDates().map(date => (
                        <div
                            key={date}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                                selectedDate === date 
                                    ? "bg-blue-500 text-white shadow-md" 
                                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                            }`}
                            onClick={() => setSelectedDate(date)}
                        >
                            {date}
                        </div>
                    ))}
                </div>
            </div>

            {/* Time Selection */}
            <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold mb-3">Select Time Slot</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input 
                            type="time" 
                            value={startTime} 
                            onChange={e => setStartTime(e.target.value)} 
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input 
                            type="time" 
                            value={endTime} 
                            onChange={e => setEndTime(e.target.value)} 
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex justify-between items-center">
                <div className="mb-6 flex flex-wrap gap-4 items-center">
                    <div className="flex items-center">
                        <MdOutlineChair size={24} className="text-green-700 mr-2" />
                        <span className="text-sm">Available</span>
                    </div>
                    <div className="flex items-center">
                        <MdOutlineChair size={24} className="text-amber-500 mr-2" />
                        <span className="text-sm">Partially Booked</span>
                    </div>
                    <div className="flex items-center">
                        <MdOutlineChair size={24} className="text-red-500 mr-2" />
                        <span className="text-sm">Booked</span>
                    </div>
                    <div className="flex items-center">
                        <MdOutlineChair size={24} className="text-blue-500 mr-2" />
                        <span className="text-sm">Your Selection</span>
                    </div>
                    <div className="flex items-center">
                        <MdOutlineChair size={24} className="text-blue-500 mr-2" />
                        <span className="text-sm">Available slots</span>
                    </div>
                </div>
                <div>
                    <button className="!bg-blue-500 text-white mb-2" onClick={()=>showAvailableTiming()}>show Available slots</button>
                </div>
            </div>

            {/* Floor Data */} 
            <div className="space-y-8">
                {floorData.map((floor, floorIndex) => (
                    <div key={floorIndex} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b">
                            <h2 className="text-lg font-semibold">Floor {floorIndex + 1}</h2>
                        </div>
                        <div className="p-4 flex justify-center  ">
                            <div className="flex flex-wrap gap-6  my-auto justify-center">

                                {floor.grids.map((grid, gridIndex) => (
                                    <div key={gridIndex} className="bg-gray-50 p-4 rounded-md">
                                        <h3 className="font-medium text-center mb-3">Grid {gridIndex + 1}</h3>
                                        <div  
                                            className="grid gap-2 justify-center mx-auto"
                                            style={{ 
                                                gridTemplateColumns: `repeat(${grid.cols}, minmax(30px, 1fr))`,
                                                maxWidth: 'fit-content'
                                            }}
                                        >
                                            {Array.from({ length: grid.rows * grid.cols }).map((_, chairIndex) =>
                                                
                                                selected.some(eachItem => eachItem.floor === floorIndex + 1 && eachItem.grid === gridIndex + 1 && eachItem.index === chairIndex + 1) ? (
                                                    <div 
                                                        key={chairIndex} 
                                                        className="w-8 h-8 bg-gray-200 rounded-sm"
                                                        title="Not available"
                                                    />
                                                    
                                                ) : 
                                                    isSlotAvailable(floorIndex + 1, gridIndex + 1, chairIndex + 1) ? 
                                                        <div
                                                            key={chairIndex}
                                                            className={`w-8 h-8 flex items-center justify-center rounded-sm ${
                                                                userSelected?.floor === floorIndex + 1 && 
                                                                userSelected?.grid === gridIndex + 1 && 
                                                                userSelected?.index === chairIndex + 1
                                                                    ? "bg-blue-500 text-white"
                                                                    : "bg-gray-100 text-gray-400 hover:text-blue-500"
                                                            }`}
                                                            onClick={() => getSelected(floorIndex + 1, gridIndex + 1, chairIndex + 1)}
                                                        >
                                                            {
                                                                showAvailable ? <MdOutlineChair size={20} className="hover:text-blue-500 text-blue-500" />:<MdOutlineChair size={20} className="hover:text-blue-500 text-green-700" />
                                                            }

                                                        </div> : 
                                                        isTotallyBooked(floorIndex + 1, gridIndex + 1, chairIndex + 1) ?
                                                        <div
                                                            key={chairIndex}
                                                            className="w-8 h-8 flex items-center justify-center rounded-sm  "
                                                            onClick={() => getShowHover(floorIndex + 1, gridIndex + 1, chairIndex + 1)}
                                                        >
                                                            <MdOutlineChair size={20} color="red" />
                                                        </div>:
                                                        
                                                        
                                                            checkAvailabe ? (
                                                                <div
                                                                    key={chairIndex}
                                                                    className="w-8 h-8 flex items-center justify-center rounded-sm cursor-pointer"
                                                                    onClick={() => {
                                                                        const isAvailable = getColorVerifed(floorIndex + 1, gridIndex + 1, chairIndex + 1);
                                                                        isAvailable 
                                                                            ? getSelected(floorIndex + 1, gridIndex + 1, chairIndex + 1)
                                                                            : getShowHover(floorIndex + 1, gridIndex + 1, chairIndex + 1);
                                                                    }}
                                                                >
                                                                    <MdOutlineChair 
                                                                        size={20} 
                                                                        className={getColorVerifed(floorIndex + 1, gridIndex + 1, chairIndex + 1) ? "text-blue-500" : "text-red-500"} 
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="w-8 h-8 flex items-center justify-center">
                                                                    <MdOutlineChair size={20} color="orange" />
                                                                </div>
                                                            )
                                                        
                                                )
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Booking Confirmation Modal */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
                <DialogTitle className="bg-gray-50">
                    <h3 className="font-semibold text-lg">Confirm Your Booking</h3>
                </DialogTitle>
                <DialogContent className="py-4">
                    <div className="space-y-3">
                        <p className="text-gray-700">
                            <span className="font-medium">Date:</span> {selectedDate}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Time:</span> {startTime} - {endTime}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Location:</span> Floor {bookingDetails?.floor}, Grid {bookingDetails?.grid}, Seat {bookingDetails?.index}
                        </p>
                    </div>
                </DialogContent>
                <DialogActions className="bg-gray-50 px-4 py-3">
                    <Button 
                        onClick={() => setOpenModal(false)} 
                        className="text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={confirmBooking} 
                        className="bg-blue-600 text-white hover:bg-blue-700"
                        variant="contained"
                    >
                        Confirm Booking
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Booked Slots Modal */}
            <Dialog open={showModel} onClose={() => setShowModel(false)} fullWidth maxWidth="sm">
                <DialogTitle className="bg-gray-50">
                    <h3 className="font-semibold text-lg">Booked Time Slots</h3>
                </DialogTitle>
                <DialogContent className="py-4">
                    <p className="text-gray-700 mb-3">
                        This seat is already booked for the following times on {selectedDate}:
                    </p>
                    <div className="space-y-2">
                        {freeTimes.length > 0 ? (
                            freeTimes.map((eachItem, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-md">
                                    <p className="font-medium">
                                        {eachItem.startTime} - {eachItem.endTime}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No bookings found for this seat.</p>
                        )}
                    </div>
                </DialogContent>
                <DialogActions className="bg-gray-50 px-4 py-3">
                    <Button 
                        onClick={() => setShowModel(false)} 
                        className="bg-blue-600 text-white hover:bg-blue-700"
                        variant="contained"
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SlotBooking;