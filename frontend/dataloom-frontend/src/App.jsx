
// // import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// // import "./App.css";
// // import DataScreen from "./Components/DataScreen";
// // import HomeScreen from "./Components/Homescreen";
// // import Navbar from "./Components/Navbar";
// // import Logs from "./Components/Logs";

// // function App() {
// //   return (
// //     <Router>
// //       <div className="App">
// //         <Navbar />
// //         <Routes>
// //           <Route path="/" element={<HomeScreen />} />
// //           <Route path="/data/:1" element={<DataScreen />} />
// //           <Route path="/logs/:1" element={<Logs />} />
// //         </Routes>
// //       </div>
// //     </Router>
// //   );
// // }

// // export default App;


// import "./App.css";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   useLocation,
// } from "react-router-dom";
// import DataScreen from "./Components/DataScreen";
// import HomeScreen from "./Components/Homescreen";
// import Navbar from "./Components/Navbar";

// function App() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }

// function AppContent() {
//   const location = useLocation();

//   return (
//     <div>
//       <Navbar isSmall={location.pathname === "/data"} />
//       <Routes>
//         <Route path="/" element={<HomeScreen />} />
//         <Route path="/data" element={<DataScreen />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;


import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import DataScreen from "./Components/DataScreen";
import HomeScreen from "./Components/Homescreen";
import Navbar from "./Components/Navbar";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <div>
      <Navbar isSmall={location.pathname === "/data"} />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/data" element={<DataScreen />} />
      </Routes>
    </div>
  );
}

export default App;