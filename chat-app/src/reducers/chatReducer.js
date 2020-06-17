const chatReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_CHATS':
      return action.payload;
    default: return state;
  }
};

export const setChats = (chats) => ({
  type: 'SET_CHATS',
  payload: chats,
});

export default chatReducer;
