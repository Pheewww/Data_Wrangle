
import './App.css'
import DataScreen from './Components/DataScreen';
import HomeScreen from './Components/Homescreen';
import Navbar from './Components/Navbar';

function App() {

  return (
    <>
      {/* className="min-h-screen bg-gray-900 " */}
      {/* <DataScreen /> */}
      <div><Navbar/></div>
      <div>
        <HomeScreen />
      </div>
    </>
  );
}

export default App
