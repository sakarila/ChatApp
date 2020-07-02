const initialState = {
  chats: [],
  currentChat: null,
};

const chatReducer = (state = initialState, action) => {
  const updateMessageNotification = (notification) => state.chats.map((chat) => ({
    ...chat,
    messageNotification: chat.id === action.payload ? notification : chat.messageNotification,
  }));

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

export default chatReducer;
