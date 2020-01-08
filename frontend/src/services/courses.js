import axios from 'axios';
const baseUrl = 'http://deerclops.sytes.net:3001';

const getAllCourses = async details => {
  const response = await axios.post(`${baseUrl}/course/get/all`, details).catch(console.log);
  return response.data
};

const updateCourse = async details => {
    const response = await axios.post(`${baseUrl}/course/update`, details).catch(console.log);
    return response.data
};

const addCourse = async details => {
  const response = await axios.post(`${baseUrl}/course/add`, details).catch(console.log);
  return response.data
};

const deleteCourse = async details => {
  const response = await axios.post(`${baseUrl}/course/delete`, details).catch(console.log);
  return response.data
};

export default { getAllCourses, updateCourse, addCourse, deleteCourse };