import io from 'socket.io-client';
import moment from 'moment';

import store from '../store';
import { addMessage, addMessageNotification, addChat } from '../reducers/chatReducer';
import { setLoggedUsers } from '../reducers/userReducer';

const socket = io('http://localhost:3001');

socket.on('new-message', (({ message, chatID }) => {
  const state = store.getState();
  if (state.chats.currentChat && state.chats.currentChat.id === chatID) {
    const dateFormattedMessage = { ...message, time: moment(message.time).format('DD.MM.YYYY HH:mm:ss') };
    store.dispatch(addMessage(dateFormattedMessage));
  } else {
    store.dispatch(addMessageNotification(chatID));
  }
}));

const joinChat = (chatID) => {
  socket.emit('join-chat', { chatID });
};

const leaveChat = (chatID) => {
  socket.emit('leave-chat', { chatID });
};

socket.on('new-chat', ((chat) => {
  store.dispatch(addChat({ ...chat, messageNotification: '' }));
  joinChat(chat.id);
}));

socket.on('user-logged', ((users) => {
  store.dispatch(setLoggedUsers(users));
}));

socket.on('user-left', ((users) => {
  store.dispatch(setLoggedUsers(users));
}));

const subscribe = (chatIDs) => {
  const state = store.getState();
  const { username } = state.users.currentUser;

  socket.emit('subscribe', [{ chatIDs, username }]);
};

const sendMessage = (messageID, chatID) => {
  socket.emit('message', { messageID, chatID });
};

const addUser = (socketID, chatID) => {
  socket.emit('add-user', { socketID, chatID });
};

const logOut = () => {
  socket.disconnect();
};

const logIn = () => {
  socket.connect();
};

export default {
  subscribe, sendMessage, logOut, logIn, addUser, joinChat, leaveChat,
};
