import React, { useEffect, useState } from "react";
import Stepper from "./Stepper";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import CustomerDetails from "./CustomerDetails";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserHeader from "./UserHeader";

const AddressForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone_no, setPhoneNo] = useState("");
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [village, setVillage] = useState("");
  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [getaddress, setgetAddress] = useState(null);
  const [error, setError] = useState(null);
  const Navigate = useNavigate();

  const statesList = [
    { id: "state-ap", label: "Andhra Pradesh" },
    { id: "state-ar", label: "Arunachal Pradesh" },
    { id: "state-as", label: "Assam" },
    { id: "state-br", label: "Bihar" },
    { id: "state-ch", label: "Chhattisgarh" },
    { id: "state-ga", label: "Goa" },
    { id: "state-gj", label: "Gujarat" },
    { id: "state-hr", label: "Haryana" },
    { id: "state-hp", label: "Himachal Pradesh" },
    { id: "state-jh", label: "Jharkhand" },
    { id: "state-ka", label: "Karnataka" },
    { id: "state-kl", label: "Kerala" },
    { id: "state-mp", label: "Madhya Pradesh" },
    { id: "state-mh", label: "Maharashtra" },
    { id: "state-mn", label: "Manipur" },
    { id: "state-ml", label: "Meghalaya" },
    { id: "state-mz", label: "Mizoram" },
    { id: "state-nl", label: "Nagaland" },
    { id: "state-or", label: "Odisha" },
    { id: "state-pb", label: "Punjab" },
    { id: "state-rj", label: "Rajasthan" },
    { id: "state-sk", label: "Sikkim" },
    { id: "state-tn", label: "Tamil Nadu" },
    { id: "state-tg", label: "Telangana" },
    { id: "state-tr", label: "Tripura" },
    { id: "state-up", label: "Uttar Pradesh" },
    { id: "state-uk", label: "Uttarakhand" },
    { id: "state-wb", label: "West Bengal" },
    { id: "state-an", label: "Andaman and Nicobar Islands" },
    { id: "state-chd", label: "Chandigarh" },
    { id: "state-dn", label: "Dadra and Nagar Haveli and Daman and Diu" },
    { id: "state-dl", label: "Delhi" },
    { id: "state-jk", label: "Jammu and Kashmir" },
    { id: "state-lad", label: "Ladakh" },
    { id: "state-lk", label: "Lakshadweep" },
    { id: "state-py", label: "Puducherry" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message, type = "success") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  const fetchData = async () => {
    try {
      const email = localStorage.getItem("email");
      const response = await axios.get(
        `http://localhost:5002/address?email=${email}`
      );
      if (response.status === 200) {
        setAddress(response.data);
        if (response.data.length > 0) {
          setSelectedAddress(response.data[0]._id);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = localStorage.getItem("email");
      if (!email) return;

      await axios.post("http://localhost:5002/address", {
        email,
        name,
        phone_no,
        street,
        district,
        state,
        pincode,
        village,
      });

      fetchData();
      showToast("Address added successfully", "success");
      setIsOpen(false);
      setName("");
      setPhoneNo("");
      setStreet("");
      setDistrict("");
      setState("");
      setPincode("");
      setVillage("");
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleDelete = async (_id) => {
    try {
      const email = localStorage.getItem("email");
      if (!email) {
        return;
      }
      const response = await axios.post(
        "http://localhost:5002/address/remove",
        { email, _id }
      );
      if (response.status === 200) {
        setAddress((prevAddresses) =>
          prevAddresses.filter((item) => item._id !== _id)
        );
        showToast("Remove Address", "info");
        if (address.length > 0) {
          setSelectedAddress(address[0]._id);
          fetchData();
        } else {
          setSelectedAddress(null);
        }
      }
    } catch (error) {
      console.log("Error deleting address", error);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setLatAndLong(latitude, longitude);
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const setLatAndLong = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      setgetAddress(data.address);
      if (data.address) {
        setStreet(data.address.road || "");
        setDistrict(data.address.state_district || "");
        setState(data.address.state || "");
        setPincode(data.address.postcode || "");
        setVillage(data.address.county || "");
      }
    } catch (error) {
      setError("Error fetching address");
    }
  };

  return (
    <>
      <UserHeader />
      <div className="flex flex-col w-screen md:flex-row items-start md:items-baseline justify-center md:justify-between min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
        <ToastContainer />
        <div className="w-screen md:w-[70%]">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            Select Address
          </h2>
          {address.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">
              No address found. Please add a new address.
            </p>
          ) : (
            address.map((eachItem) => (
              <div
                key={eachItem._id}
                className="flex justify-between items-center space-x-3 p-3  shadow-sm rounded-md bg-white dark:bg-gray-800 mb-2"
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="selectedAddress"
                    value={eachItem._id}
                    checked={selectedAddress === eachItem._id}
                    onChange={() => setSelectedAddress(eachItem._id)}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <div className="ml-3">
                    <p className="text-gray-800 dark:text-white font-medium">
                      {eachItem.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {eachItem.street}, {eachItem.district}, {eachItem.state} -{" "}
                      {eachItem.pincode}
                    </p>
                  </div>
                </div>
                <Popup
                  trigger={
                    <button
                      className="text-red-500 !bg-transparent"
                      style={{ border: 0, outline: 0 }}
                    >
                      Delete
                    </button>
                  }
                  modal
                >
                  {(close) => (
                    <div className="p-6 pt-0 text-center">
                      <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
                        Are you sure you want to delete this address?
                      </h3>
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            handleDelete(eachItem._id);
                            close();
                          }}
                          className="text-white !bg-red-500 hover:bg-red-700 font-medium rounded-lg text-base px-4 py-2.5 mr-2"
                          style={{ border: 0, outline: 0 }}
                        >
                          Yes, Delete
                        </button>
                        <button
                          onClick={close}
                          className="text-gray-900 !bg-gray-300   font-medium rounded-lg text-base px-3 py-2.5"
                          style={{ border: 0, outline: 0 }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </Popup>
              </div>
            ))
          )}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setIsOpen(true)}
              className="px-6 py-3 text-white !bg-blue-500 rounded-md hover:!bg-blue-700 transition duration-300"
            >
              Add Address
            </button>
            <button
              onClick={() => Navigate("/payment")}
              className="px-6 py-3 text-white !bg-blue-500 rounded-md hover:!bg-blue-700 transition duration-300"
            >
              Place Order
            </button>
          </div>

          {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-100  bg-opacity-10">
              <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 text-xl"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center mb-6">
                  Add Address
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={phone_no}
                        onChange={(e) => setPhoneNo(e.target.value)}
                        className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium">
                      Street Address
                    </label>
                    <input
                      type="text"
                      placeholder="Enter street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={getLocation}
                    className="!bg-blue-400 text-white"
                    style={{ border: 0, outline: 0 }}
                  >
                    Use current Location
                  </button>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium">
                        District
                      </label>
                      <input
                        type="text"
                        placeholder="Enter district"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium">
                        State
                      </label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="">Select State</option>
                        {statesList.map((state) => (
                          <option key={state.id} value={state.label}>
                            {state.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium">
                        Pincode
                      </label>
                      <input
                        type="text"
                        placeholder="Enter pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium">
                        Village
                      </label>
                      <input
                        type="text"
                        placeholder="Enter village"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center mt-6">
                    <button
                      type="submit"
                      className="px-6 py-3 text-white !bg-blue-500 rounded-md hover:!bg-blue-700 transition duration-300"
                      style={{ border: 0, outline: 0 }}
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        <CustomerDetails
          selectedAddress={address.find((addr) => addr._id === selectedAddress)}
        />
      </div>
    </>
  );
};

export default AddressForm;
