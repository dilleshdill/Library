import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaTrash,
  FaBook,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const libraryId = localStorage.getItem("libraryId");
      if (!libraryId) {
        console.error("No libraryId found in localStorage");
        toast.error("Please select a library first");
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_DOMAIN}/admin/reservations?libraryId=${libraryId}`
      );
      if (res.status === 200) {
        const approvedReservations = res.data
          .map((user) => {
            const filteredBooks = user.reservedBooks
              .map((book) => {
                const approvedAt = book.reservedAt.filter(
                  (reservation) => reservation.status === "Approved"
                );
                return { ...book, reservedAt: approvedAt };
              })
              .filter((book) => book.reservedAt.length > 0);
            if (filteredBooks.length > 0) {
              return { ...user, reservedBooks: filteredBooks };
            }
            return null;
          })
          .filter((user) => user !== null);

        // Flatten and filter
        const filteredReservations = approvedReservations.flatMap((user) =>
          user.reservedBooks
            .filter((book) => book.libraryId === libraryId)
            .flatMap((book) =>
              book.reservedAt
                .filter(
                  (reservation) =>
                    reservation.status === "Approved" && reservation.bookId
                )
                .map((reservation) => ({
                  user,
                  book,
                  reservation,
                }))
            )
        );

        const finalFilteredBooks = await Promise.all(
          filteredReservations.map(async ({ user, book, reservation }) => {
            try {
              const response = await axios.get(
                `${import.meta.env.VITE_DOMAIN}/admin/book-details/${reservation.bookId}`
              );
              const bookDetails = response.data;

              return {
                userId: user._id,
                reservationId: reservation._id,
                username: user.username,
                email: user.email,
                bookId: reservation.bookId,
                book_url:
                  bookDetails.book_url || "https://via.placeholder.com/150",
                time: `${reservation.startTime} - ${reservation.endTime}`,
                date: reservation.date,
                position: reservation.position,
              };
            } catch (err) {
              console.error(
                `Error fetching book (${reservation.bookId}) details:`,
                err
              );
              return null;
            }
          })
        );

        setReservations(finalFilteredBooks.filter((item) => item !== null));
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast.error("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, reservationId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_DOMAIN}/admin/remove-reservation`,
        {
          userId,
          reservationId,
        }
      );

      if (res.status === 200) {
        toast.success("Reservation deleted successfully!");
        setReservations((prev) =>
          prev.filter((res) => res.reservationId !== reservationId)
        );
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
      toast.error("Failed to delete reservation");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Book Reservations
      </h2>

      {reservations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No reservations found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 m-auto gap-4">
          {reservations.map((reservation) => (
            <div
              key={
                reservation.reservationId +
                reservation.bookId +
                reservation.date
              }
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={reservation.book_url}
                alt="Book Cover"
                className="w-full p-3 rounded-2xl h-45 object-cover"
              />

              <div className="p-4">
                <div className="flex items-center mb-3">
                  <FaUser className="text-blue-500 mr-2" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {reservation.username}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {reservation.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  <FaBook className="text-green-500 mr-2" />
                  <span className="font-medium">
                    Book ID:{" "}
                    <span className="text-blue-600">{reservation.bookId}</span>
                  </span>
                </div>

                <div className="flex items-center mb-3">
                  <FaCalendarAlt className="text-purple-500 mr-2" />
                  <span>{reservation.date}</span>
                </div>

                <div className="flex items-center mb-3">
                  <FaClock className="text-yellow-500 mr-2" />
                  <span>{reservation.time}</span>
                </div>

                <div className="flex items-center mb-4">
                  <FaMapMarkerAlt className="text-red-500 mr-2" />
                  <span>
                    Floor {reservation.position.floor}, Grid{" "}
                    {reservation.position.grid}, Index{" "}
                    {reservation.position.index}
                  </span>
                </div>

                <button
                  onClick={() =>
                    handleDelete(
                      reservation.userId,
                      reservation.reservationId
                    )
                  }
                  className="w-full flex items-center justify-center !bg-red-400 hover:!bg-red-600 text-white py-2 px-4 rounded transition-colors duration-300"
                >
                  <FaTrash className="mr-2" />
                  Delete Reservation
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReservations;
