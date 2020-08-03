import axios from 'axios';
import store from '../store';

const baseUrl = 'http://localhost:3001/api/auth';

const getConfig = () => {
  const state = store.getState();
  if (state.users.currentUser) {
    return { headers: { Authorization: `bearer ${state.users.currentUser.token}` } };
  }
  return null;
};

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

const updateLastLogin = async () => {
  const state = store.getState();

  if (state.users.currentUser) {
    const response = await axios.post(`${baseUrl}`, {}, getConfig());
    return response.data;
  }
  return null;
};

const getLoggedUsers = async () => {
  const response = await axios.get('http://localhost:3001/api/loggedUsers');
  return response.data;
};


export default {
  login, signup, getAllUsers, updateLastLogin, getLoggedUsers
};
