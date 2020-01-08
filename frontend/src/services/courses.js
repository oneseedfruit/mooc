import axios from 'axios';
const baseUrl = 'http://deerclops.sytes.net:3001';

const getAllCourses = async details => {
  const response = await axios.get(`${baseUrl}/courses/get/all`);
  return response.data
};

const updateCourse = async details => {
    const response = await axios.post(`${baseUrl}/courses/update`, details);
    return response.data
};

export default { getAllCourses, updateCourse };