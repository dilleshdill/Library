import { useEffect,useState } from "react"
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


const BodyPage=()=>{
  const [isShow,setShow]=useState(false)

  const navigate=useNavigate()

    useEffect(()=>{
            AOS.init({
                duration:1500,
                once:true
            })
            if(localStorage.getItem("justLogin")===true){
              setShow(true)
              setTimeout(()=>{
                isShow(false)
                localStorage.clear()
              },3000)
            }
        })

    return(
        <div>
          {isShow && (
            <motion.div
                className="fixed top-20 right-5 bg-green-500 text-white text-center py-2 px-4 rounded-md shadow-lg flex items-center justify-center gap-2"
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                transition={{ duration: 0.5, ease: "easeOut" }} 
            >
                Welcome To The Page
                <motion.div
                    className="h-2 bg-green-200 absolute bottom-0 left-0 w-full"
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />
            </motion.div>
                )}
        <div className="flex h-screen items-center justify-center p-10">
          <div className="grid md:grid-cols-2 grid-cols-1 items-center gap-10 md:px-10" >
            <div data-aos="fade-up">
              <h1 className="mb-2 text-3xl font-bold text-black"><span className="text-green-500">Welcome ,</span> To This Library Page</h1>
              <p className="mb-6 text-black">This library Website provides users with easy and convenient access to a vast collection of books and journals from anywhere, at any time. </p>
              <div className="flex justify-center space-x-5">
                <button className="flex w-full items-center justify-center gap-1 rounded-2xl !bg-gray-500 p-5 py-3 font-semibold text-white hover:!bg-gray-700">
                    Visit Now
                 
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-2xl !bg-white p-5 py-3 font-semibold hover:border-2" onClick={()=>{navigate('/chat')}}>
                    Chat Us
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-6 w-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <div className="hidden md:block md:columns-2 xl:columns-3 gap-7 ">
                <div className=" break-inside-avoid mb-8" data-aos="fade-right">
                    <img className="h-auto max-w-full rounded-lg hover:scale-110 transition-transform duration-500 ease-in-out" src="https://img.freepik.com/free-vector/books-stack-realistic_1284-4735.jpg?t=st=1739338907~exp=1739342507~hmac=876d1f292072a094d15b68960337fc71763b2d7fd1741585838b66ec6c1eb368&w=740" alt="Gallery image" />
                </div>
                <div className=" break-inside-avoid  mb-8" data-aos="fade-right">
                    <img className="h-auto max-w-full rounded-lg  hover:scale-110 transition-transform duration-500 ease-in-out" src="https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149341898.jpg?uid=R185473814&ga=GA1.1.1062628245.1737545133&semt=ais_hybrid" alt="Gallery image" />
                </div>
                <div className=" break-inside-avoid  mb-8" data-aos="fade-up">
                    <img className="h-auto max-w-full rounded-lg  hover:scale-110 transition-transform duration-500 ease-in-out" src="https://img.freepik.com/free-photo/stack-multicolored-books-table_23-2148204799.jpg?uid=R185473814&ga=GA1.1.1062628245.1737545133&semt=ais_hybrid" alt="Gallery image" />
                </div>
                <div className=" break-inside-avoid  mb-8" data-aos="fade-up">
                <img className="h-auto max-w-full rounded-lg  hover:scale-110 transition-transform duration-500 ease-in-out" src="https://img.freepik.com/premium-vector/e-learning_24908-46549.jpg?uid=R185473814&ga=GA1.1.1062628245.1737545133&semt=ais_hybrid" alt="Gallery image" />
                </div>
                <div className=" break-inside-avoid  mb-8" data-aos="fade-left">
                <img className="h-auto max-w-full rounded-lg  hover:scale-110 transition-transform duration-500 ease-in-out" src="https://img.freepik.com/free-vector/hand-drawn-world-book-day-illustration-with-stack-books_23-2148868267.jpg?uid=R185473814&ga=GA1.1.1062628245.1737545133&semt=ais_hybrid" alt="Gallery image" />
                </div>
                <div className=" break-inside-avoid  mb-8" data-aos="fade-left">
                <img className="h-auto max-w-full rounded-lg  hover:scale-110 transition-transform duration-500 ease-in-out" src="https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books_23-2149338888.jpg?uid=R185473814&ga=GA1.1.1062628245.1737545133&semt=ais_hybrid" alt="Gallery image" />
                </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default BodyPage