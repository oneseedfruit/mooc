import axios from 'axios';
const baseUrl = 'http://deerclops.sytes.net:3001';

const login = async credentials => {
  const response = await axios.post(`${baseUrl}/auth`, credentials);
  return response.data;
};

const register = async details => {
  const response = await axios.post(`${baseUrl}/register`, details);
  return response.data;
};

const updateAccount = async details => {
  const response = await axios.post(`${baseUrl}/updateaccount`, details);
  return response.data
};

const getProfile = async sessionId => {
  const response = await axios.post(`${baseUrl}/profile`, sessionId);  
  return response.data;
};

const getPermissions = async sessionId => {
  const response = await axios.post(`${baseUrl}/permissions`, sessionId);  
  return response.data;
};

export default { login, register, updateAccount, getProfile, getPermissions };