import UserHeader from "../Components/UserHeader"
import BodyPage from "./BodyPage"
import Features from "./Features"
import ProductImage from "./ProductImage"
import Price from "./Price"
import State from "./State"
import  Feedback  from "./Feedback"
import Footer from "./Footer"


const Homepage=()=>{
    return(
        <>
            <UserHeader />
            <BodyPage />
            <Features />
            <ProductImage />
            <Price />
            <State />
            <Feedback />
            <hr />
            <Footer />
        </>
    )
}

export default Homepage