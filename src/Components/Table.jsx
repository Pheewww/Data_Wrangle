import { useState } from "react";
import { FaFileUpload } from "react-icons/fa";

const Table = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split("\n");
      const header = ["S.no", ...lines[0].split(",")];
      const rows = lines
        .slice(1)
        .map((line, index) => [index + 1, ...line.split(",")]);

      setColumns(header);
      setData(rows);
    };

    reader.readAsText(file);
  };

  const addColumn = () => {
    // Prompt the user for a new column name
    const newColumnName = prompt("Enter the name of the new column:");
    if (!newColumnName) return;

    // Add the new column to the columns array
    setColumns((prevColumns) => [...prevColumns, newColumnName]);

    // Add an empty value for the new column in each row
    setData((prevData) => prevData.map((row) => [...row, ""]));
  };

  const handleRightClick = (event) => {
    event.preventDefault();
    addColumn();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-700">Data Table</h1>
        <input
          type="file"
          accept=".csv"
          className="hidden"
          id="file-upload"
          onChange={handleFileUpload}
        />
        <label
          htmlFor="file-upload"
          className="flex items-center cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300"
        >
          <FaFileUpload className="mr-2" />
          Upload Dataset
        </label>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
          SAVE
        </button>
      </div>

      <div className="max-h-[500px] overflow-x-scroll overflow-y-auto border border-gray-300 rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700"
                >
                  <button
                    className="w-full text-left bg-blue-100 hover:bg-blue-200 text-blue-700 py-1 px-2 rounded transition duration-300"
                    onClick={() => console.log(`Column ${column} clicked`)}
                  >
                    {column}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 transition duration-300"
              >
                <td className="py-2 px-4 border-b border-gray-300 text-sm text-gray-700">
                  <button
                    className="w-full bg-green-100 hover:bg-green-200 text-green-700 py-1 px-2 rounded transition duration-300"
                    onContextMenu={handleRightClick}
                  >
                    {rowIndex + 1}
                  </button>
                </td>
                {row.slice(1).map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="py-2 px-4 border-b border-gray-300 text-sm text-gray-700"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
