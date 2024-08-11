import { useState } from "react";
import PropTypes from "prop-types";
import { complexTransformDataset } from "../api"; // Update the path based on your project structure

const DropDuplicateForm = ({  onClose, onTransform }) => {
  const [columns, setColumns] = useState("");
  const [keep, setKeep] = useState("first");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const transformationInput = {
      operation_type: "dropDuplicate",
      drop_duplicate: {
        columns: columns,
        keep: keep,
      },
    };
    // FIX BELOW LATER
    const datasetId = 1;
    try {
      const response = await complexTransformDataset(
        datasetId,
        transformationInput
      );
      console.log("Transformation response:", response.data);
      onTransform(response.data); // Pass data to table component
    } catch (error) {
      console.error("Error transforming dataset:", error);
    }

    onClose(); // Close the form after submission
  };

  return (
    <div className="p-4 border border-green-500 rounded bg-gray-200 text-black">
      <form onSubmit={handleSubmit}>
        <h3 className="font-bold mb-2">Drop Duplicate</h3>

        {/* Flexbox container for the form inputs */}
        <div className="flex space-x-2 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Columns:</label>
            <input
              type="text"
              value={columns}
              onChange={(e) => setColumns(e.target.value)}
              className="border border-gray-300 rounded w-full p-2 bg-white text-black"
              placeholder="e.g., col1,col2"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">Keep:</label>
            <select
              value={keep}
              onChange={(e) => setKeep(e.target.value)}
              className="border border-gray-300 rounded w-full p-2 bg-white text-black"
            >
              <option value="first">First</option>
              <option value="last">Last</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

DropDuplicateForm.propTypes = {
  datasetId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onTransform: PropTypes.func.isRequired,
};

export default DropDuplicateForm;
