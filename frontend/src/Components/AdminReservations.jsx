import { useEffect, useState } from "react";
import axios from "axios";

const AdminReservations = () => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        fetchDetails();
    }, []);

    const fetchDetails = async () => {
        try {
            const libraryId = localStorage.getItem("libraryId");
            if (!libraryId) {
                console.error("No libraryId found in localStorage");
                return;
            }

            const res = await axios.get(`http://localhost:5002/admin/reservations?libraryId=${libraryId}`);
            if (res.status === 200) {
                setReservations(res.data);
                console.log(res.data)
            }
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };

    const handleDelete = async (userId, reservationId) => {
        console.log(userId,reservationId)
        try {
            const res = await axios.post(`http://localhost:5002/admin/remove-reservation`, {
                userId, reservationId 
            });

            if (res.status === 200) {
                alert("Reservation deleted successfully!");
                fetchDetails(); // Refresh UI after deletion
            }
        } catch (error) {
            console.error("Error deleting reservation:", error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6">Book Reservations</h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="p-3 text-left">User</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Book ID</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Time</th>
                            <th className="p-3 text-left">Location</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((user) =>
                            user.reservedBooks.map((book) =>
                                book.reservedAt.map((reservation) => (
                                    <tr key={reservation._id} className="border-b hover:bg-gray-100">
                                        <td className="p-3">{user.username}</td>
                                        <td className="p-3">{user.email}</td>
                                        <td className="p-3 text-blue-600">{book.bookId}</td>
                                        <td className="p-3">{reservation.date}</td>
                                        <td className="p-3">{reservation.startTime} - {reservation.endTime}</td>
                                        <td className="p-3">
                                            Floor {reservation.position.floor}, Grid {reservation.position.grid}
                                        </td>
                                        <td className="p-3">
                                            <button 
                                                onClick={() => handleDelete(user._id, reservation._id)}
                                                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminReservations;
