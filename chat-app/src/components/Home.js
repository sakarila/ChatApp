import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Chat from './Chat';

import storageService from '../utils/storage';
import chatService from '../services/chat';
import { setUser } from '../reducers/userReducer';
import { setChats, addChat, setCurrentChat } from '../reducers/chatReducer';

import '../styles/Chats.css';

function Home() {
  const dispatch = useDispatch();

  const [chatTitle, setChatTitle] = useState('');

  const user = useSelector((state) => state.user);
  const chats = useSelector((state) => state.chats.chats);
  const messages = useSelector((state) => state.messages);

  console.log(messages);

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

  if (!user) {
    return (
      <Redirect to="/" />
    );
  }

  return (
    <div className="chatsContainer">
      <div className="chatList">
        {chats.map((chat) => (
          <Button className="chat-btn" key={chat.id} variant="primary" onClick={() => selectChat(chat.id)}>
            {chat.title}
          </Button>
        ))}
      </div>
      <div className="currentChat">
        <Form onSubmit={createChat}>
          <Form.Group>
            <Form.Label>Create a new conversation!</Form.Label>
            <Form.Control type="text" value={chatTitle} placeholder="Type a name for the chat" onChange={({ target }) => setChatTitle(target.value)} />
          </Form.Group>
          <Button className="create-chat-btn" variant="primary" type="submit">
            Create
          </Button>
        </Form>
        <Chat />
      </div>
      <Button className="logOut-button" onClick={logOut}>Log out</Button>
    </div>
  );
}

export default Home;
