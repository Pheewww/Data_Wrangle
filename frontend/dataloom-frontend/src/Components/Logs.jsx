// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { getLogs, revertToCheckpoint } from '../api';

// const Logs = () => {
//     const { datasetId } = useParams();
//     const [logs, setLogs] = useState([]);
//     const [checkpoints, setCheckpoints] = useState([]);

//     useEffect(() => {
//         fetchLogs();
//     }, [datasetId]);

//     const fetchLogs = async () => {
//         try {
//             const response = await getLogs(datasetId);
//             setLogs(response.data.logs);
//             setCheckpoints(response.data.checkpoints);
//         } catch (error) {
//             console.error('Error fetching logs:', error);
//             alert('Failed to fetch logs. Please try again.');
//         }
//     };

//     const handleRevert = async (checkpointId) => {
//         try {
//             await revertToCheckpoint(datasetId, checkpointId);
//             alert('Successfully reverted to checkpoint');
//             fetchLogs(); // Refresh logs after revert
//         } catch (error) {
//             console.error('Error reverting to checkpoint:', error);
//             alert('Failed to revert to checkpoint. Please try again.');
//         }
//     };

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-2xl font-bold mb-4">Logs and Checkpoints</h1>
//             <div className="grid grid-cols-2 gap-4">
//                 <div>
//                     <h2 className="text-xl font-semibold mb-2">Logs</h2>
//                     <ul className="space-y-2">
//                         {logs.map((log) => (
//                             <li key={log.id} className="bg-gray-100 p-2 rounded">
//                                 <p><strong>Action:</strong> {log.action_type}</p>
//                                 <p><strong>Details:</strong> {JSON.stringify(log.action_details)}</p>
//                                 <p><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//                 <div>
//                     <h2 className="text-xl font-semibold mb-2">Checkpoints</h2>
//                     <ul className="space-y-2">
//                         {checkpoints.map((checkpoint) => (
//                             <li key={checkpoint.id} className="bg-gray-100 p-2 rounded flex justify-between items-center">
//                                 <div>
//                                     <p><strong>Message:</strong> {checkpoint.message}</p>
//                                     <p><strong>Created:</strong> {new Date(checkpoint.created_at).toLocaleString()}</p>
//                                 </div>
//                                 <button
//                                     onClick={() => handleRevert(checkpoint.id)}
//                                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//                                 >
//                                     Revert
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Logs;