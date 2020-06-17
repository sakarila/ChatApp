import { createStore, combineReducers } from 'redux';
import userReducer from './reducers/userReducer';
import chatReducer from './reducers/chatReducer';

const reducer = combineReducers({
  user: userReducer,
  chats: chatReducer,
});

const store = createStore(reducer);

export default store;
