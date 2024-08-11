// import { useState } from "react";
// // import { useParams } from "react-router-dom";
// import Menu_NavBar from "./MenuNavbar";
// import Table from "./Table";
// import Modal from "./Modal";

// export default function DataScreen() {
//   // const { datasetId } = useParams();
//   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
//   const [isSortModalOpen, setIsSortModalOpen] = useState(false);

//   const handleFilter = () => {
//     setIsFilterModalOpen(true);
//   };

//   const handleSort = () => {
//     setIsSortModalOpen(true);
//   };

//   return (
//     <div>
//       <Menu_NavBar
//         datasetId={"3"}
//         onFilter={handleFilter}
//         onSort={handleSort}
//       />
//       <Table datasetId={"3"} />
//       <Modal
//         isOpen={isFilterModalOpen}
//         onClose={() => setIsFilterModalOpen(false)}
//         title="Filter Dataset"
//       >
//         {/* Add filter form here */}
//       </Modal>
//       <Modal
//         isOpen={isSortModalOpen}
//         onClose={() => setIsSortModalOpen(false)}
//         title="Sort Dataset"
//       >
//         {/* Add sort form here */}
//       </Modal>
//     </div>
//   );
// }


// import React from 'react'
import Menu_NavBar from "./MenuNavbar";
import Table from "./Table";

export default function DataScreen() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className=" bg-gray-900">
        <Menu_NavBar />
      </div>
      <div className=" ">
        <Table />
      </div>
    </div>
  );
}