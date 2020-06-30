import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typeahead } from 'react-bootstrap-typeahead';
import {
  Button, FormControl, InputGroup, Form,
} from 'react-bootstrap';

import chatService from '../services/chat';
import socketService from '../services/socket';
import { addMessage, addUser } from '../reducers/chatReducer';

function Chat() {
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');
  const [newUser, setNewUser] = useState('');

  const chat = useSelector((state) => state.chats.currentChat);
  const user = useSelector((state) => state.users.currentUser);
  const users = useSelector((state) => state.users.users);

  const createMessage = async (event) => {
    event.preventDefault();

    const newMessage = await chatService.postNewMessage(chat.id, message);
    socketService.sendMessage(newMessage.id, chat.id);
    dispatch(addMessage(newMessage));
    setMessage('');
  };

  if (!chat) {
    return (
      <div className="chatbox" />
    );
  }

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const getAddableUsers = () => {
    const chatUsers = chat.users.map((singleUser) => singleUser.username);
    const allUsers = users.map((singleUser) => singleUser.username);

    const addableUsers = allUsers.filter((singleUser) => !chatUsers.includes(singleUser));
    return addableUsers;
  };

  const addUsertoChat = async () => {
    if (newUser.length === 0) {
      return;
    }

    const addedUser = await chatService.addUserToChat(newUser, chat.id);
    dispatch(addUser(addedUser));
    setNewUser('');
  };

  return (
    <div className="chatbox">
      <h1 className="current-chat-header">{chat.title}</h1>
      <div className="current-chat-messages">
        {chat.messages.map((msg) => (
          <div key={msg.id} className={msg.user.username === user.username ? 'right-msg' : 'left-msg'}>
            {msg.user.username}
            {msg.message}
          </div>
        ))}
      </div>
      <InputGroup onChange={handleMessageChange}>
        <FormControl placeholder="Send a message" />
        <Button onClick={createMessage} className="input-btn">Send</Button>
      </InputGroup>
      <Form.Label>Add a new user to the chat</Form.Label>
      <InputGroup>
        <Typeahead id="userSelection" options={getAddableUsers()} onChange={(selected) => setNewUser(selected)} />
        <InputGroup.Append>
          <Button onClick={addUsertoChat} className="input-btn">Add</Button>
        </InputGroup.Append>
      </InputGroup>
    </div>
  );
}

export default Chat;
