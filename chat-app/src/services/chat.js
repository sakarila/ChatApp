import axios from 'axios';
import moment from 'moment';

import store from '../store';

const baseUrl = 'http://localhost:3001/api/chat';

const dateFormatting = (messages) => {
  const newMessages = messages.map((message) => ({ ...message, time: moment(message.time).format('DD.MM.YYYY HH:mm:ss') }));
  return newMessages;
};

const getConfig = () => {
  const state = store.getState();
  if (state.users.currentUser) {
    return { headers: { Authorization: `bearer ${state.users.currentUser.token}` } };
  }
  return null;
};

const getAllChats = async () => {
  const response = await axios.get(`${baseUrl}`, getConfig());
  return response.data;
};

const createChat = async (title, users) => {
  const response = await axios.post(`${baseUrl}`, { title, users }, getConfig());
  return response.data;
};

const getCurrentChat = async (chatID) => {
  const response = await axios.get(`${baseUrl}/${chatID}`, getConfig());
  const dateFormattedMessages = dateFormatting(response.data.messages);
  return { ...response.data, messages: dateFormattedMessages };
};

const postNewMessage = async (chatID, message) => {
  const response = await axios.post(`${baseUrl}/${chatID}`, { message }, getConfig());
  const newMessage = { ...response.data, time: moment(message.time).format('DD.MM.YYYY HH:mm:ss') };
  return newMessage;
};

const addUserToChat = async (username, chatID) => {
  const response = await axios.post(`${baseUrl}/user/${chatID}`, { username }, getConfig());
  return response.data;
};

export default {
  getAllChats, createChat, getCurrentChat, postNewMessage, addUserToChat,
};
