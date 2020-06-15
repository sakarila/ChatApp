import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import storageService from './utils/storage';

import { setUser } from './reducers/userReducer';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Chat from './components/Chat';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const savedUser = storageService.loadUser();
    dispatch(setUser(savedUser));
  }, [dispatch]);

  return (
    <div className="container">
      <Router>
        <Switch>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path="/chat">
            <Chat />
          </Route>
          <Route path="/">
            {user ? <Redirect to="/chat" /> : <Login />}
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
