import axios from 'axios';
const baseUrl = 'http://deerclops.sytes.net:3001';

const getProfile = async sessionId => {
  const response = await axios.post(`${baseUrl}/profile`, sessionId);  
  return response.data;
};

const getPermissions = async sessionId => {
  const response = await axios.post(`${baseUrl}/permissions`, sessionId);  
  return response.data;
};

export default { getProfile, getPermissions };