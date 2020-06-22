import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form } from 'react-bootstrap';

function Chat() {
  const [message, setMessage] = useState('');

  const chat = useSelector((state) => state.chats.currentChat);

  const createMessage = async (event) => {
    event.preventDefault();

    // Tässä luotais keskusteluun uus viesti
    console.log(message);
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
        <p key={msg.id}>
          {msg.message}
          {msg.user.username}
          {msg.time}
        </p>
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
