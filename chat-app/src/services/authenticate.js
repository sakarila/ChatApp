import axios from 'axios';

const baseUrl = 'http://localhost:3001/api/auth';

const login = async (credentials) => {
  const response = await axios.post(`${baseUrl}/login`, credentials);
  return response.data;
};

const signup = async (credentials) => {
  const response = await axios.post(`${baseUrl}/signup`, credentials);
  return response.data;
};

export default { login, signup };
