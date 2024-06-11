
import './App.css'
import NavBar from './Components/Navbar'
import Table from './Components/Table';

function App() {

  return (
    <>
      {/* className="min-h-screen bg-gray-900 " */}
      <div>
        <NavBar className="min-h-screen bg-gray-900 " />
      </div>

      <div  >
        <Table />
      </div>
    </>
  );
}

export default App
