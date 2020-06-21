import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Chat from './Chat';

import storageService from '../utils/storage';
import chatService from '../services/chat';
import { setUser } from '../reducers/userReducer';
import { setChats } from '../reducers/chatReducer';

function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const chats = useSelector((state) => state.chats);

  const getChats = async () => {
    const userChats = await chatService.getAllChats();
    dispatch(setChats(userChats));
  };

  useEffect(() => {
    const savedUser = storageService.loadUser();
    dispatch(setUser(savedUser));
    getChats();
  }, []);

  const logOut = () => {
    storageService.logoutUser();
    dispatch(setUser(null));
    dispatch(setChats([]));
  };

  if (!user) {
    return (
      <Redirect to="/" />
    );
  }

  return (
    <div className="container">
      <h1>
        {user.username}
      </h1>
      {chats.map((chat) => (
        <p key={chat.id}>
          {chat.title}
        </p>
      ))}
      <Chat />
      <Button onClick={logOut}>Log out</Button>
    </div>
  );
}

export default Home;
