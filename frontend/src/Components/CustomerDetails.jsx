import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const CustomerDetails = ({ selectedAddress }) => {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone_no, setPhoneNo] = useState("");
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [village, setVillage] = useState("");
  const [refresh,setRefresh] = useState(false)
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveAddress();
    setRefresh(prev => !prev);
    setIsOpen(false);
};

  useEffect(() => {
    if (selectedAddress) {
      setName(selectedAddress.name);
      setPhoneNo(selectedAddress.phone_no);
      setStreet(selectedAddress.street);
      setDistrict(selectedAddress.district);
      setState(selectedAddress.state);
      setPincode(selectedAddress.pincode);
      setVillage(selectedAddress.village);
    }
    setEmail(localStorage.getItem("email"));
    // fetchData()
  }, [refresh,selectedAddress]);


  const saveAddress = async () => {
    try {
        const response = await axios.post("http://localhost:5002/address/edit", {
            _id: selectedAddress._id,
            email,
            name,
            phone_no,
            street,
            district,
            state,
            pincode,
            village
        });

        if (response.status === 200) {
            showToast("Address edit successfully","success")
            setIsOpen(false);
            // fetchData();
        }
    } catch (error) {
        console.error("Error updating address:", error);
    }
};

const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            if (data.address) {
              setStreet(data.address.road || "");
              setDistrict(data.address.state_district || "");
              setState(data.address.state || "");
              setPincode(data.address.postcode || "");
              setVillage(data.address.county || "");
            }
          } catch (error) {
            showToast("Error fetching location details", "error");
          }
        },
        (error) => {
          showToast(error.message, "error");
        }
      );
    } else {
      showToast("Geolocation is not supported by this browser.", "error");
    }
  };

//   const fetchData = async () => {
//     try {
//         const email = localStorage.getItem("email");
//         if (!email) return;

//         const response = await axios.get(`http://localhost:5002/address?email=${email}`);
//         if (response.status === 200) {
//             const getEdit = response.data?.find(eachItem => eachItem._id === selectedAddress?._id);
//             console.log(getEdit)

//             if (getEdit) {
//                 setName(getEdit.name);
//                 setPhoneNo(getEdit.phone_no);
//                 setStreet(getEdit.street);
//                 setDistrict(getEdit.district);
//                 setState(getEdit.state);
//                 setPincode(getEdit.pincode);
//                 setVillage(getEdit.village);
//             }
//         }
//     } catch (e) {
//         console.log("Error fetching address:", e);
//     }
// };


  if (!selectedAddress) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 w-full xl:w-96 flex justify-center items-center px-4 py-6 md:p-6 xl:p-8">
        <p className="text-gray-600 dark:text-gray-300">No address selected</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
      <ToastContainer/>
      <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
        Customer
      </h3>
      <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
        <div className="flex flex-col justify-start items-start flex-shrink-0">
          <div className="flex justify-center w-full md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
            <img src="https://i.ibb.co/5TSg7f6/Rectangle-18.png" alt="avatar" />
            <div className="flex justify-start items-start flex-col space-y-2">
              <p className="text-base dark:text-white font-semibold leading-4 text-left text-gray-800">
                {selectedAddress.name}
              </p>
              <p className="text-sm dark:text-gray-300 leading-5 text-gray-600">
                10 Previous Orders
              </p>
            </div>
          </div>

          <div className="flex justify-center text-gray-800 dark:text-white md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
            <img
              className="dark:hidden"
              src="https://tuk-cdn.s3.amazonaws.com/can-uploader/order-summary-3-svg1.svg"
              alt="email"
            />
            <img
              className="hidden dark:block"
              src="https://tuk-cdn.s3.amazonaws.com/can-uploader/order-summary-3-svg1dark.svg"
              alt="email"
            />
            <p className="cursor-pointer text-sm leading-5">{email}</p>
          </div>
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
                <button onClick={getLocation} className="!bg-blue-400 text-white" style={{ border: 0, outline: 0 }}>Use current Location</button>
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium">
                      District
                    </label>
                    <input
                      type="text"
                      placeholder="District"
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
                      required
                    >
                      <option value="" disabled>
                        Select State
                      </option>
                      {statesList.map((state) => (
                        <option key={state.id} value={state.label}>
                          {state.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium">
                      PinCode
                    </label>
                    <input
                      type="text"
                      placeholder="PinCode"
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
                      placeholder="Village"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full !bg-blue-400 text-white py-3 rounded-md hover:bg-blue-700 transition"
                  
                >
                  Save Address
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
          <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
            <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
              <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">
                Shipping Address
              </p>
              <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                {selectedAddress.street}, {selectedAddress.district},{" "}
                {selectedAddress.state} - {selectedAddress.pincode}
              </p>
            </div>
            <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4">
              <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">
                Billing Address
              </p>
              <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                {selectedAddress.street}, {selectedAddress.district},{" "}
                {selectedAddress.state} - {selectedAddress.pincode}
              </p>
            </div>
          </div>


          <div className="flex w-full justify-center items-center md:justify-start md:items-start">
            <button
              onClick={() => setIsOpen(true)}
              className="mt-6 w-full !bg-gray-600 text-white py-2 rounded-md hover:!bg-gray-800 transition"
            >
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
