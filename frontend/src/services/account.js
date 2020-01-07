import axios from 'axios';
const baseUrl = 'http://deerclops.sytes.net:3001';

const login = async credentials => {
  const response = await axios.post(`${baseUrl}/auth/login`, credentials);
  return response.data;
};

const register = async details => {
  const response = await axios.post(`${baseUrl}/auth/register`, details);
  return response.data;
};

const updateAccount = async details => {
  const response = await axios.post(`${baseUrl}/account/update`, details);
  return response.data
};

const getAllAccounts = async details => {
  const response = await axios.get(`${baseUrl}/account/get/all`);
  return response.data
};

const getProfile = async sessionId => {
  const response = await axios.post(`${baseUrl}/profile/get`, sessionId);  
  return response.data;
};

const getPermissions = async sessionId => {
  const response = await axios.post(`${baseUrl}/profile/get/permissions`, sessionId);  
  return response.data;
};

export default { login, register, updateAccount, getAllAccounts, getProfile, getPermissions };