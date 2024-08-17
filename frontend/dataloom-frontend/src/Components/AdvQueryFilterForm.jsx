import { useState } from "react";
import PropTypes from "prop-types";
import TableDisplay from "./TableDisplay"; // Import TableDisplay component
import { complexTransformDataset } from "../api"; // Import the API call function

const AdvQueryFilterForm = ({ datasetId, onClose }) => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null); // State to hold API response
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Query:", query);
    setLoading(true); // Set loading state
    try {
      
      const response = await complexTransformDataset(datasetId, {
        operation_type: "advQueryFilter",
        adv_query: { query },
      });
      setResult(response.data); // Set API response to state
      console.log("Query API response:", response.data);
    } catch (error) {
      console.error("Error applying query:", error.message);
    } finally {
      setLoading(false); // Reset loading state
    }
    onClose(); // Close the form after submission
  };

  return (
    <div className="p-4 border border-green-500 rounded bg-gray-100 text-black">
      <form onSubmit={handleSubmit}>
        <h3 className="font-bold mb-2">Advanced Query</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium">Query:</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border border-gray-300 rounded w-full p-1 bg-white text-black"
            placeholder="e.g., col1 > 10 and col2 < 5"
            required
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
      {result && <TableDisplay columns={result.columns} rows={result.rows} />}
    </div>
  );
};

AdvQueryFilterForm.propTypes = {
  datasetId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AdvQueryFilterForm;
