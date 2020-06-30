import axios from 'axios';
import storageService from '../utils/storage';

const baseUrl = 'http://localhost:3001/api/chat';

const getConfig = () => ({
  headers: { Authorization: `bearer ${storageService.loadUser().token}` },
});

const getAllChats = async () => {
  const response = await axios.get(`${baseUrl}`, getConfig());
  return response.data;
};

const createChat = async (title) => {
  const response = await axios.post(`${baseUrl}`, { title }, getConfig());
  return response.data;
};

const getCurrentChat = async (chatID) => {
  const response = await axios.get(`${baseUrl}/${chatID}`, getConfig());
  return response.data;
};

const postNewMessage = async (chatID, message) => {
  const response = await axios.post(`${baseUrl}/${chatID}`, { message }, getConfig());
  return response.data;
};

const addUserToChat = async (username, chatID) => {
  const response = await axios.post(`${baseUrl}/user/${chatID}`, { username }, getConfig());
  return response.data;
};

export default {
  getAllChats, createChat, getCurrentChat, postNewMessage, addUserToChat,
};
