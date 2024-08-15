import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const uploadDataset = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/datasets/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Add the missing getDatasetById function
export const getDatasetById = ()=> {
//   const response = await api.get(`/datasets/${datasetId}`);
//   return response.data;
const response =  1;
  return response.data;
};

export const transformDataset = async (datasetId, transformationInput) => {
  const response = await api.post(
    `/${datasetId}/transform`,
    transformationInput
  );
  return response.data;
};

export const saveDataset = async (datasetId, commitMessage) => {
  const response = await api.post(`/${datasetId}/save`, {
    commit_message: commitMessage,
  });
  return response.data;
};

export const getLogs = async (datasetId) => {
  const response = await api.get(`/${datasetId}`);
  return response.data;
};

export const getCheckpoints = async (datasetId) => {
  const response = await api.get(`/checkpoints/${datasetId}`);
  return response.data;
};

export const revertToCheckpoint = async (datasetId, checkpointId) => {
  const response = await api.post(`/${datasetId}/revert`, {
    checkpoint_id: checkpointId,
  });
  return response.data;
};
