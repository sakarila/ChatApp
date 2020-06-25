import { createStore, combineReducers } from 'redux';
import userReducer from './reducers/userReducer';
import chatReducer from './reducers/chatReducer';

const reducer = combineReducers({
  users: userReducer,
  chats: chatReducer,
});

const store = createStore(reducer);

export default store;
