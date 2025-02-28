import Sidebar from "./Sidebar"
import Header from "./Header";
import ViewBooks from "./ViewBooks";
const Dashboard = () =>{
  
  return(
    <div className="flex w-screen min-h-screen">
      <div className="w-[15%]">
        <Sidebar/>
      </div>
      <div className="flex flex-col w-[85%]">
        <Header/>
        <ViewBooks/>
      </div>
    </div>
  )
}
export default Dashboard;
