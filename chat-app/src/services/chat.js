import axios from 'axios';
import storageService from '../utils/storage';

const baseUrl = 'http://localhost:3001/api';

const getConfig = () => ({
  headers: { Authorization: `bearer ${storageService.loadUser().token}` },
});

const getAllChats = async () => {
  const response = await axios.get(`${baseUrl}/chat`, getConfig());
  return response.data;
};

export default { getAllChats };
