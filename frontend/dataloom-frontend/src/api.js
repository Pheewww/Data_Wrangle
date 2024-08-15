import axios from 'axios';
 


const API = axios.create({
    baseURL : "http://localhost:8000/",
});

export const uploadDataset = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return API.post('/upload', formData);
};

export const transformDataset = (datasetId, transformationInput) => {
    return API.post(`/datasets/1/transform`, transformationInput);
};

export const complexTransformDataset = (datasetId, transformationInput) => {
    return API.post(`datasets/1/Complextransform`, transformationInput);
};

export const saveDataset = (datasetId, commitMessage) => {
    return API.post(`/datasets/1/save?commit_message=${encodeURIComponent(commitMessage)}`);
};

export const revertToCheckpoint = (datasetId, checkpointId) => {
    return API.post(`/datasets/1/revert?checkpoint_id=${checkpointId}`);
};


// export const getLogs = (datasetId) => {
//     return API.get(`/${datasetId}/logs`);
// };

export const getLogs = (datasetId) => {
    return API.get(`/logs/1`);
};

export const getCheckpoints = (datasetId) => {
    return API.get(`/logs/checkpoints/1`);
};