import io from 'socket.io-client';

import store from '../store';
import { addMessage, addMessageNotification } from '../reducers/chatReducer';

const socket = io('http://localhost:3001');

socket.on('new-message', (({ message, chatID }) => {
  const state = store.getState();
  if (state.chats.currentChat && state.chats.currentChat.id === chatID) {
    store.dispatch(addMessage(message));
  } else {
    store.dispatch(addMessageNotification(chatID));
  }
}));

const subscribeChats = (chatTitles) => {
  socket.emit('subscribe', chatTitles);
};

const sendMessage = (messageID, chatID) => {
  socket.emit('message', { messageID, chatID });
};

export default { subscribeChats, sendMessage };
