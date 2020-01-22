import axios from 'axios';
const baseUrl = 'http://deerclops.sytes.net:3001';

const getAllClasses = async details => {
  const response = await axios.get(`${baseUrl}/class/get/all?user_id=${details.user_id}`).catch(console.log);
  return response.data
};

// const updateCourse = async details => {
//     const response = await axios.post(`${baseUrl}/course/update`, details).catch(console.log);
//     return response.data
// };

const addClass = async details => {
  const response = await axios.post(`${baseUrl}/class/add`, details).catch(console.log);
  return response.data
};

// const deleteCourse = async details => {
//   const response = await axios.post(`${baseUrl}/course/delete`, details).catch(console.log);
//   return response.data
// };

export default { addClass, getAllClasses };