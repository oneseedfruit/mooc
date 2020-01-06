import axios from 'axios';
const baseUrl = 'http://deerclops.sytes.net:3001';

const login = async credentials => {
  const response = await axios.post(`${baseUrl}/auth`, credentials);
  return response.data;
};

const getProfile = async sessionId => {
  const response = await axios.post(`${baseUrl}/profile`, sessionId);  
  return response.data;
};

const getPermissions = async sessionId => {
  const response = await axios.post(`${baseUrl}/permissions`, sessionId);  
  return response.data;
};

export default { login, getProfile, getPermissions };