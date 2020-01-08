import axios from 'axios';
const baseUrl = 'http://deerclops.sytes.net:3001';

const login = async credentials => {
  const response = await axios.post(`${baseUrl}/auth/login`, credentials).catch(console.log);
  return response.data;
};

const register = async details => {
  const response = await axios.post(`${baseUrl}/auth/register`, details).catch(console.log);
  return response.data;
};

const getPermissions = async session_id => {
  const response = await axios.post(`${baseUrl}/account/permissions`, session_id).catch(console.log);  
  return response.data;
};

const updateAccount = async details => {
  const response = await axios.post(`${baseUrl}/account/update`, details).catch(console.log);
  return response.data;
};

const deleteAccount = async details => {
  const response = await axios.post(`${baseUrl}/account/delete`, details).catch(console.log);
  return response.data;
};

const getAllAccounts = async details => {
  const response = await axios.get(`${baseUrl}/account/get/all`).catch(console.log);
  return response.data;
};


const getProfile = async session_id => {
  const response = await axios.post(`${baseUrl}/profile/get`, session_id).catch(console.log);  
  return response.data;
};

export default { login, register, updateAccount, deleteAccount, getAllAccounts, getProfile, getPermissions };