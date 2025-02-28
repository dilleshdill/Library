import React, { useState } from "react";

const LocationFetcher = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  // Function to get current location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          console.log(location)
          getAddress(latitude, longitude); // Fetch address
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  // Function to fetch address from coordinates
  const getAddress = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      console.log(data.address)
      setAddress(data.address);
    } catch (error) {
      setError("Error fetching address");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Get Location & Address</h2>
      <button
        onClick={getLocation}
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Get Location
      </button>

      {location.latitude && location.longitude && (
        <p className="mt-3">
          <strong>Latitude:</strong> {location.latitude}, <strong>Longitude:</strong>{" "}
          {location.longitude}
        </p>
      )}

      {address && (
        <div className="mt-3">
          <p><strong>City:</strong> {address.city || address.town || address.village}</p>
          <p><strong>State:</strong> {address.state}</p>
          <p><strong>Country:</strong> {address.country}</p>
          <p><strong>Postal Code:</strong> {address.postcode}</p>
          <p><strong>district:</strong> {address.state_district
          }</p>

        </div>
      )}

      {error && <p className="text-red-500 mt-3">{error}</p>}
    </div>
  );
};

export default LocationFetcher;
