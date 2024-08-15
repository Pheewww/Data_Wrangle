// // NavBar.js
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { saveDataset } from "../api";
// import proptypes from "prop-types";
// const Menu_NavBar = ({ datasetId, onFilter, onSort }) => {
//   const [activeTab, setActiveTab] = useState("Home");
//   const navigate = useNavigate();

//   const menuOptions = {
//     File: [
//       {
//         name: "File Operations 1",
//         options: [
//           { name: "Filter Dataset", icon: "🔍", action: () => onFilter() },
//           { name: "Sort Dataset", icon: "🔢", action: () => onSort() },
//           { name: "Join Dataset", icon: "📌" },
//           { name: "Delete Dataset", icon: "✂️" },
//           { name: "Upload Dataset", icon: "📤" },
//           { name: "Download Dataset", icon: "📥" },
//         ],
//       },
//       {
//         name: "Future Options",
//         options: [
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//         ],
//       },
//       {
//         name: "Future Options",
//         options: [
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//         ],
//       },
//     ],
//     Home: [
//       {
//         name: "Clipboard 1 ",
//         options: [
//           { name: "Cut", icon: "✂️" },
//           { name: "Copy", icon: "📋" },
//           { name: "Paste", icon: "📌" },
//           { name: "Edit", icon: "✏️" },
//           { name: "Save", icon: "💾", action: () => handleSave() },
//           { name: "Last Checkpoint", icon: "↪️" },
//         ],
//       },
//       {
//         name: "Future Options",
//         options: [
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//         ],
//       },
//       {
//         name: "Future Options",
//         options: [
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//         ],
//       },
//     ],
//     Insert: [
//       {
//         name: "Cells 1",
//         options: [
//           { name: "Add Row", icon: "➕" },
//           { name: "Add Column", icon: "↔️" },
//           { name: "Edit Item", icon: "✍️" },
//           { name: "Remove Item", icon: "🗑️" },
//           { name: "Highlight Cell", icon: "🖍️" },
//           { name: "Highlight Complete Bar", icon: "🎨" },
//         ],
//       },
//       {
//         name: "Future Options",
//         options: [
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//         ],
//       },
//       {
//         name: "Future Options",
//         options: [
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//         ],
//       },
//     ],
//     "Page Layout": [
//       {
//         name: "Page Setup 1",
//         options: [
//           { name: "Margins", icon: "↔️" },
//           { name: "Orientation", icon: "🔄" },
//           { name: "Size", icon: "📏" },
//           { name: "Notes", icon: "🔖" },
//           { name: "Text Color", icon: "🎨" },
//           { name: "Font Size", icon: "🔠" },
//         ],
//       },
//       {
//         name: "Future Options",
//         options: [
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//         ],
//       },
//       {
//         name: "Future Options",
//         options: [
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//         ],
//       },
//     ],
//     Formulas: [
//       {
//         name: "Function Library 1",
//         options: [
//           { name: "AutoSum", icon: "Σ" },
//           { name: "Average", icon: "📊" },
//           { name: "Count", icon: "🔢" },
//           { name: "Max", icon: "🔝" },
//           { name: "Min", icon: "🔽" },
//           { name: "Recently Used", icon: "🕒" },
//         ],
//       },
//       {
//         name: "Future Options",
//         options: [
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//         ],
//       },
//       {
//         name: "Future Options",
//         options: [
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//         ],
//       },
//     ],
//     Data: [
//       {
//         name: "Sort & Filter",
//         options: [
//           { name: "Filter", icon: "🔍" },
//           { name: "Sort", icon: "🔢" },
//           { name: "Sort Ascending", icon: "🔼" },
//           { name: "Find", icon: "🔎" },
//           { name: "Group", icon: "📊" },
//           { name: "Sort Descending", icon: "🔽" },
//         ],
//       },
//       {
//         name: "Future Options",
//         options: [
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//         ],
//       },
//       {
//         name: "Future Options",
//         options: [
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//         ],
//       },
//     ],
//     Export: [
//       {
//         name: "Download 1",
//         options: [
//           { name: "Select Rows and Column", icon: "📝" },
//           { name: "Complete Download", icon: "📚" },
//           { name: "Download Last Savepoint", icon: "🔢" },
//           { name: "Print Document", icon: "🖨️" },
//           { name: "Share Document", icon: "🔗" },
//           { name: "Undo Changes", icon: "↩️" },
//         ],
//       },
//       {
//         name: "Future Options",
//         options: [
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//         ],
//       },
//       {
//         name: "Future Options",
//         options: [
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//           { name: "Future Item", icon: "🛠️" },
//         ],
//       },
//     ],
//     Help: [
//       {
//         name: "Help 1",
//         options: [
//           { name: "Tutorial", icon: "💬" },
//           { name: "Community Blogs", icon: "❓" },
//           { name: "FAQ", icon: "📚" },
//           { name: "Help Center", icon: "🆘" },
//           { name: "Video Guide", icon: "🎥" },
//           { name: "User Manual", icon: "📖" },
//         ],
//       },
//       {
//         name: "Help 2",
//         options: [
//           { name: "Tutorial", icon: "💬" },
//           { name: "Community Blogs", icon: "❓" },
//           { name: "Community Blogs", icon: "❓" },
//         ],
//       },
//       {
//         name: "Help 3",
//         options: [
//           { name: "Tutorial", icon: "💬" },
//           { name: "Community Blogs", icon: "❓" },
//           { name: "Community Blogs", icon: "❓" },
//         ],
//       },
//     ],
//   };
//   const handleSave = async () => {
//     const commitMessage = prompt("Enter a commit message:");
//     if (commitMessage) {
//       try {
//         await saveDataset(datasetId, commitMessage);
//         alert("Dataset saved successfully!");
//       } catch (error) {
//         console.error("Error saving dataset:", error);
//         alert("Failed to save dataset. Please try again.");
//       }
//     }
//   };

//   return (
//     <div className="bg-green-700 text-white h-400">
//       <div className="flex justify-between border-b border-green-600">
//         {Object.keys(menuOptions).map((tab) => (
//           <button
//             key={tab}
//             className={`px-4 py-2 text-sm font-medium hover:bg-green-600 ${
//               activeTab === tab
//                 ? "bg-green-600 border-t border-x border-green-500"
//                 : ""
//             }`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>
//       <div className="bg-white text-black p-2 h-40">
//         <div className="flex space-x-2">
//           {menuOptions[activeTab]?.map((group, groupIndex) => (
//             <div
//               key={groupIndex}
//               className="bg-gray-100 rounded p-2 flex flex-col items-center border border-green-500 w-1/3"
//             >
//               <div className="text-xs font-bold mb-2">{group.name}</div>
//               <div className="grid grid-cols-3 font-semibold gap-2">
//                 {group.options.map((option, optionIndex) => (
//                   <div
//                     key={optionIndex}
//                     className="flex flex-row items-center justify-center p-1 hover:bg-green-300 rounded cursor-pointer"
//                     onClick={option.action}
//                   >
//                     <div className="text-lg mb-1 mr-1 ">{option.icon}</div>
//                     <div className="text-xs text-center">{option.name}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// Menu_NavBar.propTypes = {
//   datasetId: proptypes.string.isRequired,
//   onFilter: proptypes.func.isRequired,
//   onSort: proptypes.func.isRequired,
// };

// export default Menu_NavBar;

// NavBar.js
import { useState } from "react";
import FilterForm from "./FilterForm";
import SortForm from "./SortForm";
import DropDuplicateForm from "./DropDuplicateForm";  // Import DropDuplicateForm component
import AdvQueryFilterForm from "./AdvQueryFilterForm";  // Import AdvQueryFilterForm component
import PivotTableForm from "./PivotTableForm";  // Import PivotTableForm component


const Menu_NavBar = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [showFilterForm, setShowFilterForm] = useState(false);
  const [showSortForm, setShowSortForm] = useState(false);
  const [showDropDuplicateForm, setShowDropDuplicateForm] = useState(false);
  const [showAdvQueryFilterForm, setShowAdvQueryFilterForm] = useState(false);
  const [showPivotTableForm, setShowPivotTableForm] = useState(false);

  const menuOptions = {
    File: [
      {
        name: "File Operations 1",
        options: [
          {
            name: "Filter Dataset",
            icon: "🔍",
            onClick: () => {
              setShowFilterForm(true);
              setShowSortForm(false);
              setShowDropDuplicateForm(false);
              setShowAdvQueryFilterForm(false);
              setShowPivotTableForm(false);
            },
          },
          {
            name: "Sort Dataset",
            icon: "🔢",
            onClick: () => {
              setShowSortForm(true);
              setShowFilterForm(false);
              setShowDropDuplicateForm(false);
              setShowAdvQueryFilterForm(false);
              setShowPivotTableForm(false);
            },
          },
          { name: "Join Dataset", icon: "📌" },
          { name: "Delete Dataset", icon: "✂️" },
          { name: "Upload Dataset", icon: "📤" },
          { name: "Download Dataset", icon: "📥" },
        ],
      },
      {
        name: "Complex Query",
        options: [
          {
            name: "Drop Duplicate",
            icon: "❌",
            onClick: () => {
              setShowDropDuplicateForm(true);
              setShowSortForm(false);
              setShowFilterForm(false);
              setShowAdvQueryFilterForm(false);
              setShowPivotTableForm(false);
            },
          },
          {
            name: "Advanced Query",
            icon: "🧠",
            onClick: () => {
              setShowAdvQueryFilterForm(true);
              setShowSortForm(false);
              setShowFilterForm(false);
              setShowDropDuplicateForm(false);
              setShowPivotTableForm(false);
            },
          },
          {
            name: "Pivot Tables",
            icon: "📊",
            onClick: () => {
              setShowPivotTableForm(true);
              setShowSortForm(false);
              setShowFilterForm(false);
              setShowDropDuplicateForm(false);
              setShowAdvQueryFilterForm(false);
            },
          },
        ],
      },
      {
        name: "Future Options",
        options: [
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
        ],
      },
    ],
    Home: [
      {
        name: "Clipboard 1 ",
        options: [
          { name: "Cut", icon: "✂️" },
          { name: "Copy", icon: "📋" },
          { name: "Paste", icon: "📌" },
          { name: "Edit", icon: "✏️" },
          { name: "Save", icon: "💾" },
          { name: "Last Checkpoint", icon: "↪️" },
        ],
      },
      {
        name: "Future Options",
        options: [
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
        ],
      },
      {
        name: "Future Options",
        options: [
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
        ],
      },
    ],
    Insert: [
      {
        name: "Cells 1",
        options: [
          { name: "Add Row", icon: "➕" },
          { name: "Add Column", icon: "↔️" },
          { name: "Edit Item", icon: "✍️" },
          { name: "Remove Item", icon: "🗑️" },
          { name: "Highlight Cell", icon: "🖍️" },
          { name: "Highlight Complete Bar", icon: "🎨" },
        ],
      },
      {
        name: "Future Options",
        options: [
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
        ],
      },
      {
        name: "Future Options",
        options: [
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
        ],
      },
    ],
    "Page Layout": [
      {
        name: "Page Setup 1",
        options: [
          { name: "Margins", icon: "↔️" },
          { name: "Orientation", icon: "🔄" },
          { name: "Size", icon: "📏" },
          { name: "Notes", icon: "🔖" },
          { name: "Text Color", icon: "🎨" },
          { name: "Font Size", icon: "🔠" },
        ],
      },
      {
        name: "Future Options",
        options: [
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
        ],
      },
      {
        name: "Future Options",
        options: [
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
        ],
      },
    ],
    Formulas: [
      {
        name: "Function Library 1",
        options: [
          { name: "AutoSum", icon: "Σ" },
          { name: "Average", icon: "📊" },
          { name: "Count", icon: "🔢" },
          { name: "Max", icon: "🔝" },
          { name: "Min", icon: "🔽" },
          { name: "Recently Used", icon: "🕒" },
        ],
      },
      {
        name: "Future Options",
        options: [
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
        ],
      },
      {
        name: "Future Options",
        options: [
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
        ],
      },
    ],
    Data: [
      {
        name: "Sort & Filter",
        options: [
          { name: "Filter", icon: "🔍" },
          { name: "Sort", icon: "🔢" },
          { name: "Sort Ascending", icon: "🔼" },
          { name: "Find", icon: "🔎" },
          { name: "Group", icon: "📊" },
          { name: "Sort Descending", icon: "🔽" },
        ],
      },
      {
        name: "Future Options",
        options: [
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
        ],
      },
      {
        name: "Future Options",
        options: [
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
        ],
      },
    ],
    Export: [
      {
        name: "Download 1",
        options: [
          { name: "Select Rows and Column", icon: "📝" },
          { name: "Complete Download", icon: "📚" },
          { name: "Download Last Savepoint", icon: "🔢" },
          { name: "Print Document", icon: "🖨️" },
          { name: "Share Document", icon: "🔗" },
          { name: "Undo Changes", icon: "↩️" },
        ],
      },
      {
        name: "Future Options",
        options: [
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
        ],
      },
      {
        name: "Future Options",
        options: [
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
          { name: "Future Item", icon: "🛠️" },
        ],
      },
    ],
    Help: [
      {
        name: "Help 1",
        options: [
          { name: "Tutorial", icon: "💬" },
          { name: "Community Blogs", icon: "❓" },
          { name: "FAQ", icon: "📚" },
          { name: "Help Center", icon: "🆘" },
          { name: "Video Guide", icon: "🎥" },
          { name: "User Manual", icon: "📖" },
        ],
      },
      {
        name: "Help 2",
        options: [
          { name: "Tutorial", icon: "💬" },
          { name: "Community Blogs", icon: "❓" },
          { name: "Community Blogs", icon: "❓" },
        ],
      },
      {
        name: "Help 3",
        options: [
          { name: "Tutorial", icon: "💬" },
          { name: "Community Blogs", icon: "❓" },
          { name: "Community Blogs", icon: "❓" },
        ],
      },
    ],
  };

  return (
    <div className="bg-green-700 text-white h-400">
      <div className="flex justify-between border-b border-green-600">
        {Object.keys(menuOptions).map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium hover:bg-green-600 ${
              activeTab === tab
                ? "bg-green-600 border-t border-x border-green-500"
                : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="bg-white text-black p-2 h-40">
        <div className="flex space-x-2">
          {menuOptions[activeTab]?.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="bg-gray-100 rounded p-2 flex flex-col items-center border border-green-500 w-1/3"
            >
              <div className="text-xs font-bold mb-2">{group.name}</div>
              <div className="grid grid-cols-3 font-semibold gap-2">
                {group.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="flex flex-row items-center justify-center p-1 hover:bg-green-300 rounded cursor-pointer"
                    onClick={option.onClick} // Attach onClick event here
                  >
                    <div className="text-lg mb-1 mr-1 ">{option.icon}</div>
                    <div className="text-xs text-center">{option.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Render forms based on their respective state */}
      {showFilterForm && (
        <FilterForm onClose={() => setShowFilterForm(false)} />
      )}
      {showSortForm && <SortForm onClose={() => setShowSortForm(false)} />}
      {showDropDuplicateForm && (
        <DropDuplicateForm onClose={() => setShowDropDuplicateForm(false)} />
      )}
      {showAdvQueryFilterForm && (
        <AdvQueryFilterForm onClose={() => setShowAdvQueryFilterForm(false)} />
      )}
      {showPivotTableForm && (
        <PivotTableForm onClose={() => setShowPivotTableForm(false)} />
      )}
    </div>
  );
};

export default Menu_NavBar;