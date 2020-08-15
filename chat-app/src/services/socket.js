import io from 'socket.io-client';
import moment from 'moment';

import store from '../store';
import chatService from './chat';
import {
  addMessage, addMessageNotification, addChat, updateUsersLastLogin,
} from '../reducers/chatReducer';
import { setLoggedUsers } from '../reducers/userReducer';

const socket = io('http://ChatApp-backend-dev.eu-central-1.elasticbeanstalk.com');

socket.on('new-message', (({ message, chatID }) => {
  const state = store.getState();
  if (state.chats.currentChat && state.chats.currentChat.id === chatID) {
    const dateFormattedMessage = {
      ...message,
      seen: message.seen.concat({
        username: state.users.currentUser.username,
        id: state.users.currentUser.id,
      }),
      time: moment(message.time).format('DD.MM.YYYY HH:mm:ss'),
    };
    store.dispatch(addMessage(dateFormattedMessage));
    chatService.markMessageSeen(message.id);
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
  const state = store.getState();
  const { loggedUsers } = state.users;
  const leavingUser = loggedUsers.filter((loggedUser) => users.map((user) => user.username)
    .indexOf(loggedUser.username) === -1);

  if (state.chats.currentChat) {
    if (state.chats.currentChat.users.map((user) => user.username)
      .includes(leavingUser[0].username)) {
      store.dispatch(updateUsersLastLogin(leavingUser[0].username));
    }
  }
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
