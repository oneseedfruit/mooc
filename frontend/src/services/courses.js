import axios from 'axios';
const baseUrl = 'http://deerclops.sytes.net:3001';

const getAllCourses = async details => {
  const response = await axios.post(`${baseUrl}/course/get/all`, details);
  return response.data
};

const updateCourse = async details => {
    const response = await axios.post(`${baseUrl}/course/update`, details);
    return response.data
};

const addCourse = async details => {
  const response = await axios.post(`${baseUrl}/course/add`, details);
  return response.data
};

export default { getAllCourses, updateCourse, addCourse };