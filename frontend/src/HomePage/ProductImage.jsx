import {useEffect} from 'react'
import AOS from "aos";
import "aos/dist/aos.css";


const ProductImage = () => { 
    
     useEffect(()=>{
                AOS.init({
                    duration:1500,
                    once:true
                })
        })
  return (
        
    <div className="relative overflow-hidden bg-white">
        <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
            <div className="sm:max-w-lg" data-aos="fade-up">
            <h1 className="font text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Unveiling Books:</h1>
            <p className="mt-4 text-xl text-gray-500">Book your Books online effortlessly and get them delivered to your doorstep with easy!</p>
            </div>
            <div>
            <div className="mt-10">
                
                <div aria-hidden="true" className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl" data-aos="fade-up">
                <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                    <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                        <img src="https://img.freepik.com/premium-photo/books_172251-416.jpg?uid=R185473814&ga=GA1.1.1062628245.1737545133&semt=ais_hybrid" className="h-full w-full object-cover object-center" />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img src="https://img.freepik.com/premium-photo/pile-paperback-books-table_93675-7234.jpg?uid=R185473814&ga=GA1.1.1062628245.1737545133&semt=ais_hybrid" alt="" className="h-full w-full object-cover object-center" />
                        </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img src="https://img.freepik.com/free-vector/flat-design-stack-books-illustration_23-2149380226.jpg?uid=R185473814&ga=GA1.1.1062628245.1737545133&semt=ais_hybrid" alt="" className="h-full w-full object-cover object-center" />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img src="https://img.freepik.com/free-vector/gradient-stack-books-illustration_23-2149327718.jpg?uid=R185473814&ga=GA1.1.1062628245.1737545133&semt=ais_hybrid" alt="" className="h-full w-full object-cover object-center" />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img src="https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149350186.jpg?uid=R185473814&ga=GA1.1.1062628245.1737545133&semt=ais_hybrid" alt="" className="h-full w-full object-cover object-center" />
                        </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img src="https://img.freepik.com/free-vector/lovely-education-concept-with-flat-design_23-2147913130.jpg?uid=R185473814&ga=GA1.1.1062628245.1737545133&semt=ais_hybrid" alt="" className="h-full w-full object-cover object-center" />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img src="https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149350215.jpg?uid=R185473814&ga=GA1.1.1062628245.1737545133&semt=ais_hybrid" alt="" className="h-full w-full object-cover object-center" />
                        </div>
                    </div>
                    </div>
                </div>
                </div>

                <a href="/shop" className="inline-block rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-center font-medium text-white hover:bg-indigo-700" data-aos="fade-up" >Order Now</a>
            </div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default ProductImage