import axios from 'axios';
import moment from 'moment';

import store from '../store';

const baseUrl = 'http://localhost:3001/api/chat';

const formatMessageDates = (messages) => {
  const newMessages = messages.map((message) => ({ ...message, time: moment(message.time).format('DD.MM.YYYY HH:mm:ss') }));
  return newMessages;
};

const formatLastLoginDate = (users) => {
  const newUsers = users.map((user) => ({ ...user, lastLogin: moment(user.lastLogin).format('DD.MM.YYYY HH:mm:ss') }));
  return newUsers;
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
  const dateFormattedMessages = formatMessageDates(response.data.messages);
  const dateFormattedUsers = formatLastLoginDate(response.data.users);
  return { ...response.data, messages: dateFormattedMessages, users: dateFormattedUsers };
};

const getMoreMessages = async (chatID, numOfMessages) => {
  const response = await axios.get(`${baseUrl}/${chatID}/${numOfMessages}`, getConfig());
  const dateFormattedMessages = formatMessageDates(response.data.messages);
  return dateFormattedMessages;
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

const removeUserFromChat = async (chatID) => {
  const response = await axios.delete(`${baseUrl}/chat/${chatID}`, getConfig());
  return response.data;
};

const markMessageSeen = async (messageID) => {
  const response = await axios.put(`${baseUrl}/message/${messageID}`, {}, getConfig());
  return response.data;
};

export default {
  getAllChats,
  createChat,
  getCurrentChat,
  postNewMessage,
  addUserToChat,
  removeUserFromChat,
  getMoreMessages,
  markMessageSeen,
};
