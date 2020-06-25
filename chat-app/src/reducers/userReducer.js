const initialState = {
  users: [],
  currentUser: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_ALL_USERS':
      return { ...state, users: action.payload };
    default: return state;
  }
};

export const setUser = (user) => ({
  type: 'SET_USER',
  payload: user,
});

export const setAllUsers = (users) => ({
  type: 'SET_ALL_USERS',
  payload: users,
});

export default userReducer;
