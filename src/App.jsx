
import './App.css'
import HomeScreen from './Components/Homescreen';
import Menu_NavBar from './Components/MenuNavbar'
import Navbar from './Components/Navbar';
import Table from './Components/Table';

function App() {

  return (
    <>
      {/* className="min-h-screen bg-gray-900 " */}
      {/* <div>
        <Menu_NavBar className="min-h-screen bg-gray-900 " />
      </div>

      <div  >
        <Table />
      </div> */}
      <div><Navbar/></div>
      <div>
        <HomeScreen />
      </div>
    </>
  );
}

export default App
