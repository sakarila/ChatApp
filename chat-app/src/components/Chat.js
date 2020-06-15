import React from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import storageService from '../utils/storage';
import { setUser } from '../reducers/userReducer';

function Chat() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const logOut = () => {
    storageService.logoutUser();
    dispatch(setUser(null));
  };

  if (!user) {
    return (
      <Redirect to="/" />
    );
  }

  return (
    <div className="container">
      <p>Kirjautuneena pitäisi päätyä tänne</p>
      <Button onClick={logOut}>Log out</Button>
    </div>
  );
}

export default Chat;
