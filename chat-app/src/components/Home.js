import React, { useEffect, useState } from 'react';
import {
  Button, FormControl, Image, InputGroup,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Chat from './Chat';

import storageService from '../utils/storage';
import chatService from '../services/chat';
import userService from '../services/user';
import { setUser, setAllUsers } from '../reducers/userReducer';
import { setChats, addChat, setCurrentChat } from '../reducers/chatReducer';
import socketService from '../services/socket';

import '../styles/Chats.css';

function Home() {
  const dispatch = useDispatch();

  const [chatTitle, setChatTitle] = useState('');

  const user = useSelector((state) => state.users.currentUser);
  const chats = useSelector((state) => state.chats.chats);

  const getChats = async () => {
    const userChats = await chatService.getAllChats();
    const chatIDs = userChats.map((chat) => chat.id);

    socketService.subscribeChats(chatIDs);
    dispatch(setChats(userChats));
  };

  const getUsers = async () => {
    const users = await userService.getAllUsers();
    dispatch(setAllUsers(users));
  };

  useEffect(() => {
    const savedUser = storageService.loadUser();
    dispatch(setUser(savedUser));
    getChats();
    getUsers();
  }, []);

  const logOut = () => {
    storageService.logoutUser();
    dispatch(setUser(null));
    dispatch(setChats([]));
  };

  const createChat = async (event) => {
    event.preventDefault();
    const newChat = await chatService.createChat(chatTitle);
    dispatch(addChat(newChat));
    setChatTitle('');
  };

  const selectChat = async (chatID) => {
    const currentChat = await chatService.getCurrentChat(chatID);
    dispatch(setCurrentChat(currentChat));
  };

  const handleChange = (event) => {
    setChatTitle(event.target.value);
  };

  if (!user) {
    return (
      <Redirect to="/" />
    );
  }

  console.log(chats);

  return (
    <div className="chatsContainer">
      <Image src="" roundedCircle />
      <Button className="input-btn" onClick={logOut}>Log out</Button>
      <InputGroup onChange={handleChange}>
        <FormControl maxLength={60} placeholder="Type a name for the chat" />
        <Button className="input-btn" onClick={createChat}>Create</Button>
      </InputGroup>
      <div className="chat-list">
        <h1 className="chat-list-header">Your chats</h1>
        {chats.map((chat) => (
          <Button className="chat-btn" key={chat.id} variant="primary" onClick={() => selectChat(chat.id)}>
            {chat.title}
          </Button>
        ))}
      </div>
      <div className="current-chat">
        <Chat />
      </div>
    </div>
  );
}

export default Home;
