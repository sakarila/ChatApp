const initialState = {
  chats: [],
  currentChat: null,
};

const chatReducer = (state = initialState, action) => {
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

export default chatReducer;
