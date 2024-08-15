

// // import React from 'react'
// import Menu_NavBar from "./MenuNavbar";
// import Table from "./Table";

// export default function DataScreen() {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className=" bg-gray-900">
//         <Menu_NavBar />
//       </div>
//       <div className=" ">
//         <Table />
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import Menu_NavBar from "./MenuNavbar";
import Table from "./Table";

export default function DataScreen() {
  const [tableData, setTableData] = useState(null);

  const handleTransform = (data) => {
    setTableData(data); // Update state with new data
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-gray-900">
        <Menu_NavBar onTransform={handleTransform} />
      </div>
      <div>
        <Table datasetId={1} data={tableData} /> {/* Pass the data to Table */}
      </div>
    </div>
  );
}
