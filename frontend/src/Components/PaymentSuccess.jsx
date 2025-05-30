import { useNavigate } from "react-router-dom";


const PaymentSuccess = () => {

    const navigate = useNavigate();
    return (
      <div className="flex items-center w-screen justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 sm:px-0">
        <div className="w-full max-w-2xl p-8 sm:p-12 text-center transition-all transform bg-white shadow-lg rounded-xl hover:shadow-xl">
  
          {/* Success Icon */}
          <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8 bg-green-100 rounded-full">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
  
          {/* Main Content */}
          <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl font-extrabold text-green-600">
            Payment Successful!
          </h1>
  
          <p className="mb-6 sm:mb-8 text-lg sm:text-xl text-gray-700">
            Thank you for your purchase.
          </p>
  
          {/* Tool Information */}
          {/* <div className="p-4 sm:p-6 mb-6 sm:mb-8 rounded-lg bg-blue-50">
            <p className="text-base sm:text-lg font-medium text-blue-700">
              Your tool <span className="font-bold">"http://example.com"</span> will be listed shortly.
            </p>
          </div> */}
  
          {/* Contact Information */}
          <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-gray-100">
            <p className="text-base sm:text-lg text-gray-700">Have questions? Contact us at:</p>
            <a href="mailto:admin@eliteai.tools" className="inline-block mt-2 text-lg sm:text-xl font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800">
              admin@gmail.com
            </a>
          </div>
  
          {/* Back to Dashboard Button */}
          <div className="mt-8 sm:mt-12 flex gap-5 justify-center">
            <div className="inline-block px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-colors duration-200 bg-blue-500 rounded-lg hover:bg-blue-700"
            onClick={() => navigate("/books")}>
              Go to Dashboard
            </div>
            <div className="inline-block px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-colors duration-200 bg-blue-500 rounded-lg hover:bg-blue-700"
              onClick={() => navigate("/orders")}>
              Go to Orders
            </div>
          </div>
  
        </div>
      </div>
    );
  };
  
  export default PaymentSuccess;