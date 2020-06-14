import { createStore } from 'redux';
import userReducer from './reducers/userReducer';

const reducer = userReducer;

const store = createStore(reducer);

export default store;
