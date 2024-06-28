import { useState } from "react";
import { FaFileUpload } from "react-icons/fa";

const Table = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    rowIndex: null,
    columnIndex: null,
    type: null, // 'row' or 'column'
  });

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


  // ADDING ROW + COLUMN
  const handleAddRow = (index) => {
    const newRow = Array(columns.length).fill("");
    const newData = [...data];
    newData.splice(index + 1, 0, newRow);

    // Rearrange index numbers
    for (let i = index + 1; i < newData.length; i++) {
      newData[i][0] = i + 1;
    }

    setData(newData);
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
      rowIndex: null,
      columnIndex: null,
      type: null,
    });
  };

  const handleAddColumn = (index) => {
    const newColumnName = prompt("Enter column name:");
    if (newColumnName) {
      const newColumns = [...columns];
      newColumns.splice(index + 1, 0, newColumnName);

      const newData = data.map((row) => {
        const newRow = [...row];
        newRow.splice(index + 1, 0, "");
        return newRow;
      });

      setColumns(newColumns);
      setData(newData);
      setContextMenu({
        visible: false,
        x: 0,
        y: 0,
        rowIndex: null,
        columnIndex: null,
        type: null,
      });
    }
  };


  // DELETING ROW + COLUMNS
  const handleDeleteRow = (index) => {
    const newData = [...data];
    newData.splice(index, 1);

    // Rearrange index numbers
    for (let i = index; i < newData.length; i++) {
      newData[i][0] = i + 1;
    }

    setData(newData);
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
      rowIndex: null,
      columnIndex: null,
      type: null,
    });
  };

  const handleDeleteColumn = (index) => {
    if (index === 0) {
      alert("Cannot delete the index column.");
      return;
    }

    const newColumns = [...columns];
    newColumns.splice(index, 1);

    const newData = data.map((row) => {
      const newRow = [...row];
      newRow.splice(index, 1);
      return newRow;
    });

    setColumns(newColumns);
    setData(newData);
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
      rowIndex: null,
      columnIndex: null,
      type: null,
    });
  };

  const handleRightClick = (
    event,
    rowIndex = null,
    columnIndex = null,
    type = null
  ) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      rowIndex: rowIndex,
      columnIndex: columnIndex,
      type: type,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
      rowIndex: null,
      columnIndex: null,
      type: null,
    });
  };

  return (
    <div className="container mx-auto p-4" onClick={handleCloseContextMenu}>
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

      <div className="max-h-[500px] overflow-x-scroll overflow-y-auto border border-gray-300 rounded-lg shadow ">
        <table className="min-w-full bg-white">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              {columns.map((column, columnIndex) => (
                <th
                  key={columnIndex}
                  className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700"
                  onContextMenu={(e) =>
                    handleRightClick(e, null, columnIndex, "column")
                  }
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
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="py-2 px-4 border-b border-gray-300 text-sm text-gray-700"
                    onContextMenu={(e) =>
                      cellIndex === 0 &&
                      handleRightClick(e, rowIndex, null, "row")
                    }
                  >
                    {cell}
                    <td>
                      <input value={row.name} />
                    </td>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {contextMenu.visible && contextMenu.type === "row" && (
        <div
          className="absolute bg-white border border-gray-300 rounded shadow-lg p-2"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            className="block w-full text-left text-sm text-blue-700 py-1 px-2 hover:bg-blue-100 rounded transition duration-300"
            onClick={() => handleAddRow(contextMenu.rowIndex)}
          >
            Add Row
          </button>
          <button
            className="block w-full text-left text-sm text-blue-700 py-1 px-2 hover:bg-blue-100 rounded transition duration-300"
            onClick={() => handleDeleteRow(contextMenu.rowIndex)}
          >
            Delete Row
          </button>
        </div>
      )}

      {contextMenu.visible && contextMenu.type === "column" && (
        <div
          className="absolute bg-white border border-gray-300 rounded shadow-lg p-2"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            className="block w-full text-left text-sm text-blue-700 py-1 px-2 hover:bg-blue-100 rounded transition duration-300"
            onClick={() => handleAddColumn(contextMenu.columnIndex)}
          >
            Add Column
          </button>
          <button
            className="block w-full text-left text-sm text-blue-700 py-1 px-2 hover:bg-blue-100 rounded transition duration-300"
            onClick={() => handleDeleteColumn(contextMenu.columnIndex)}
          >
            Delete Column
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
