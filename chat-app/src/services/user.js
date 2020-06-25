import axios from 'axios';
import storageService from '../utils/storage';

const baseUrl = 'http://localhost:3001/api/auth';

const getConfig = () => ({
  headers: { Authorization: `bearer ${storageService.loadUser().token}` },
});

const login = async (credentials) => {
  const response = await axios.post(`${baseUrl}/login`, credentials);
  return response.data;
};

const signup = async (credentials) => {
  const response = await axios.post(`${baseUrl}/signup`, credentials);
  return response.data;
};

const getAllUsers = async () => {
  const response = await axios.get(`${baseUrl}`, getConfig());
  return response.data;
};

export default { login, signup, getAllUsers };
