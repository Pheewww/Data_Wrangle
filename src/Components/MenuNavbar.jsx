// NavBar.js
import { useState } from "react";

const Menu_NavBar = () => {
  const [activeTab, setActiveTab] = useState("Home");

  const menuOptions = {
    File: [
      {
        name: "File Options",
        options: [
          { name: "New Dataset", icon: "📋" },
          { name: "Join Dataset", icon: "📌" },
          { name: "Delete Dataset", icon: "✂️" },
        ],
      },
    ],
    Home: [
      {
        name: "Clipboard",
        options: [
          { name: "Cut", icon: "✂️" },
          { name: "Copy", icon: "📋" },
          { name: "Paste", icon: "📌" },
        ],
      },
    ],
    Insert: [
      {
        name: "Cells",
        options: [
          { name: "Rows", icon: "🏗️" },
          { name: "Column", icon: "🏗️" },
          { name: "Column2", icon: "🏗️" },
        ],
      },
    ],
    "Page Layout": [
      {
        name: "Page Setup",
        options: [
          { name: "Margins", icon: "↔️" },
          { name: "Orientation", icon: "🔄" },
          { name: "Size", icon: "📏" },
        ],
      },
    ],
    Formulas: [
      {
        name: "Function Library",
        options: [
          { name: "AutoSum", icon: "Σ" },
          { name: "Recently Used", icon: "🕒" },
          { name: "Financial", icon: "💰" },
        ],
      },
    ],
    Data: [
      {
        name: "Sort & Filter",
        options: [
          { name: "Sort", icon: "🔢" },
          { name: "Filter", icon: "🔍" },
          { name: "Filter2", icon: "🔍" },
        ],
      },
      {
        name: "Data Tools",
        options: [{ name: "Data Tools", icon: "🛠️" }],
      },
    ],
    Export: [
      {
        name: "Download",
        options: [
          { name: "Select Rows and Column", icon: "📝" },
          { name: "Complete Download", icon: "📚" },
          { name: "Download Last Savepoint", icon: "🔢" },
        ],
      },
    ],
    Help: [
      {
        name: "Help",
        options: [
          { name: "Tutorial", icon: "💬" },
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
      <div className="bg-white p-2 h-40">
        <div className="flex space-x-2">
          {menuOptions[activeTab]?.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="bg-green-400 rounded p-2 flex flex-col items-center border border-green-500"
            >
              <div className="text-xs font-semibold mb-2">{group.name}</div>
              <div className="grid grid-cols-2 gap-2">
                {group.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="flex flex-col items-center justify-center p-1 hover:bg-green-500 rounded cursor-pointer"
                  >
                    <div className="text-lg mb-1">{option.icon}</div>
                    <div className="text-xs text-center">{option.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu_NavBar;
