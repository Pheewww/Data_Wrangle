 import proptype from 'prop-types';

const TableDisplay = ({ columns, rows }) => {
  return (
    <div className="p-4 mt-4 border border-blue-500 rounded bg-gray-800">
      <h4 className="font-bold mb-2">API Response:</h4>
      {rows.length > 0 && (
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-600">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {rows.length === 0 && <p className="text-white">No data available</p>}
    </div>
  );
};

TableDisplay.propTypes = {
    columns: proptype.array.isRequired,
    rows: proptype.array.isRequired,
    };
    

export default TableDisplay;
