import axios from 'axios';
const baseUrl = 'http://deerclops.sytes.net:3001';

const login = async credentials => {
  const response = await axios.post(`${baseUrl}/auth`, credentials);
  return response.data;
};

export default { login };