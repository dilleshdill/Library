
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from "./Components/Login";
import Register from "./Components/Register";
import Dashboard from "./Components/Dashboard";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import AdminLogin from './Components/adminLogin';
import UserHeader from './Components/UserHeader';
import AddBook from './Components/AddBook';
import './App.css'
import ViewBooks from './Components/ViewBooks';
import Books from './Components/Books';
import Favorite from './Components/Favorites';
import ProductDetails from './Components/ProductDetails';
import CustomerDetails from './Components/CustomerDetails';
import Homepage from './HomePage/HomePage';
import Wishlist from './Wishlist/Wishlist';
import Address from './Components/Address';
import LocationFetcher from './Location/Location';
import PaymentButton from './Components/Payment';
import ChatApp from './Components/Chat/UserChat';
import AdminRegister from './Components/AdminRegister';
import AdminChatApp from './Components/Chat/AdminChat';
import ProtuctedRoute from './Components/ProtuctedRoute';
import AdminSelectedChatApp from './Components/Chat/AdminSelectedChat';
import PaymentSuccess from './Components/PaymentSuccess';
import Orders from './Components/Orders';
import OrderArrived from './Components/OrderArrived';


const App = () =>{
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path="/" element={<Homepage />} />
        <Route path='/register' element= {<Register />} />
        <Route element = {<ProtuctedRoute/>}>
          <Route path ='/header' element = {<Header />} />
          <Route path ='/sidebar' element = {<Sidebar />} />
          <Route path ='/dashboard' element ={<Dashboard />} />
          <Route path='/adminLogin' element = {<AdminLogin />} />
          <Route path='/adminregister' element = {<AdminRegister />} />
          <Route path='/addbook' element = {<AddBook/>} />
          <Route path = '/viewbooks' element = {<ViewBooks/>}/>
          <Route path = '/books' element = {<Books/>}/>
          <Route path = '/favorite' element = {<Favorite/>}/>
          <Route path = '/books/:_id' element = {<ProductDetails/>}/>
          <Route path = '/customerdetails' element = {<CustomerDetails/>}/>
          <Route path = '/wishlist' element = {<Wishlist/>}/>
          <Route path = '/address' element = {<Address/>}/>
          <Route path='/location' element = {<LocationFetcher/>}/>
          <Route path='/payment' element = {<PaymentButton/>}/>
          <Route path='/chat' element = {<ChatApp/>}/>
          <Route path='/adminchat' element = {<AdminChatApp/>}/>
          <Route path="/adminchat/:id" element={<AdminSelectedChatApp />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders-arrived" element={<OrderArrived />} />
        </Route>
       </Routes>
    </BrowserRouter>
  )
}
export default App
