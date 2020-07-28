import moment from 'moment';

const initialState = {
  chats: [],
  currentChat: null,
};

const chatReducer = (state = initialState, action) => {
  const updateMessageNotification = (notification) => state.chats.map((chat) => ({
    ...chat,
    messageNotification: chat.id === action.payload ? notification : chat.messageNotification,
  }));

  const updateLastLogin = (username) => {
    const { users } = state.currentChat;
    const updatedUsers = users.map((user) => (user.username === username ? { ...user, lastLogin: moment(new Date()).format('DD.MM.YYYY HH:mm:ss') } : user));
    return updatedUsers;
  };

  switch (action.type) {
    case 'SET_CHATS':
      return { ...state, chats: action.payload };
    case 'ADD_CHAT':
      return { ...state, chats: state.chats.concat(action.payload) };
    case 'SET_CURRENT_CHAT':
      return { ...state, currentChat: action.payload };
    case 'ADD_MESSAGE':
      return {
        ...state,
        currentChat:
        { ...state.currentChat, messages: state.currentChat.messages.concat(action.payload) },
      };
    case 'ADD_MESSAGES':
      return {
        ...state,
        currentChat:
        { ...state.currentChat, messages: state.currentChat.messages.concat(action.payload) },
      };
    case 'ADD_USER':
      return {
        ...state,
        currentChat:
        { ...state.currentChat, users: state.currentChat.users.concat(action.payload) },
      };
    case 'ADD_MESSAGE_NOTIFICATION':
      return {
        ...state,
        chats: updateMessageNotification('New messages!'),
      };
    case 'REMOVE_MESSAGE_NOTIFICATION':
      return {
        ...state,
        chats: updateMessageNotification(''),
      };
    case 'REMOVE_USER':
      return { ...state, chats: state.chats.filter((chat) => chat.id !== action.payload) };
    case 'UPDATE_LOGIN':
      return {
        ...state,
        currentChat:
        { ...state.currentChat, users: updateLastLogin(action.payload) },
      };
    default: return state;
  }
};

export const setChats = (chats) => ({
  type: 'SET_CHATS',
  payload: chats,
});

export const addChat = (chat) => ({
  type: 'ADD_CHAT',
  payload: chat,
});

export const setCurrentChat = (chat) => ({
  type: 'SET_CURRENT_CHAT',
  payload: chat,
});

export const addMessage = (message) => ({
  type: 'ADD_MESSAGE',
  payload: message,
});

export const addMessages = (messages) => ({
  type: 'ADD_MESSAGES',
  payload: messages,
});

export const addUser = (user) => ({
  type: 'ADD_USER',
  payload: user,
});

export const addMessageNotification = (chatID) => ({
  type: 'ADD_MESSAGE_NOTIFICATION',
  payload: chatID,
});

export const removeMessageNotification = (chatID) => ({
  type: 'REMOVE_MESSAGE_NOTIFICATION',
  payload: chatID,
});

export const removeUserFromChat = (chatID) => ({
  type: 'REMOVE_USER',
  payload: chatID,
});

export const updateUsersLastLogin = (username) => ({
  type: 'UPDATE_LOGIN',
  payload: username,
});

export default chatReducer;
