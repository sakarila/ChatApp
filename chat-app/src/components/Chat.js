import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Form } from 'react-bootstrap';

import chatService from '../services/chat';
import { addMessage } from '../reducers/chatReducer';

function Chat() {
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');

  const chat = useSelector((state) => state.chats.currentChat);
  const user = useSelector((state) => state.user);

  const createMessage = async (event) => {
    event.preventDefault();

    const newMessage = await chatService.postNewMessage(chat.id, message);
    dispatch(addMessage(newMessage));
    setMessage('');
  };

  if (!chat) {
    return (
      <div className="chatbox">
        Select a chat from left or create a new one!
      </div>
    );
  }

  return (
    <div className="chatbox">
      <h1>{chat.title}</h1>
      {chat.messages.map((msg) => (
        <div key={msg.id} className={msg.user.username === user.username ? 'right-msg' : 'left-msg'}>
          {msg.user.username}
          {msg.message}
        </div>
      ))}
      <Form onSubmit={createMessage}>
        <Form.Group>
          <Form.Control type="text" value={message} placeholder="Send a message" onChange={({ target }) => setMessage(target.value)} />
        </Form.Group>
        <Button className="chat-btn" variant="primary" type="submit">
          Send
        </Button>
      </Form>
    </div>
  );
}

export default Chat;
