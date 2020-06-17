const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;
    default: return state;
  }
};

export const setUser = (user) => ({
  type: 'SET_USER',
  payload: user,
});

export default userReducer;
