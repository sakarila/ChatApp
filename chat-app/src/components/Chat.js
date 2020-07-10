import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typeahead } from 'react-bootstrap-typeahead';
import {
  Button, Form, Modal, InputGroup, OverlayTrigger, Tooltip,
} from 'react-bootstrap';
import { animateScroll } from 'react-scroll';

import chatService from '../services/chat';
import socketService from '../services/socket';
import { addMessage, addUser } from '../reducers/chatReducer';

function Chat() {
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');
  const [newUser, setNewUser] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const chat = useSelector((state) => state.chats.currentChat);
  const user = useSelector((state) => state.users.currentUser);
  const users = useSelector((state) => state.users.users);
  const loggedUsers = useSelector((state) => state.users.loggedUsers);

  console.log(chat);

  const scrollToBottom = () => {
    animateScroll.scrollToBottom({
      containerId: 'current-chat-messages',
    });
  };

  useEffect(() => {
    scrollToBottom();
  });

  const createMessage = async (event) => {
    event.preventDefault();
    if (!message) {
      return;
    }

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

  const getAddableUsers = () => {
    const chatUsers = chat.users.map((singleUser) => singleUser.username);
    const allUsers = users.map((singleUser) => singleUser.username);

    const addableUsers = allUsers.filter((singleUser) => !chatUsers.includes(singleUser));
    return addableUsers;
  };

  const addUsertoChat = async (event) => {
    event.preventDefault();
    if (!newUser) {
      console.log('Kehotetaan käyttäjää valitsemaan lisättävä käyttäjä');
      return;
    }

    const addedUser = await chatService.addUserToChat(newUser, chat.id);
    dispatch(addUser(addedUser));

    const newUserLogged = loggedUsers.find((loggedUser) => loggedUser.username === newUser[0]);
    if (newUserLogged) {
      socketService.addUser(newUserLogged.socketID, chat.id);
    }

    setNewUser('');
    setShowAddUserModal(!showAddUserModal);
  };

  return (
    <div className="chatbox">
      <h1 className="current-chat-header">{chat.title}</h1>
      <div id="current-chat-messages">
        <ul>
          {chat.messages.map((msg) => (
            <OverlayTrigger
              key={msg.id}
              placement={msg.user.username === user.username ? 'left' : 'right'}
              overlay={(
                <Tooltip id={msg.id}>
                  <p className="tooltip-username">{msg.user.username}</p>
                  <div className={loggedUsers.map((loggedUser) => loggedUser.username).includes(msg.user.username) ? 'circle user-logged' : 'circle user-not-logged'} />
                </Tooltip>
              )}
            >
              <li key={msg.id} className={msg.user.username === user.username ? 'right-msg' : 'left-msg'}>
                <div>
                  <p className="message">{msg.message}</p>
                  <p className="message-info">
                    {`${msg.user.username}, ${msg.time}`}
                  </p>
                </div>
              </li>
            </OverlayTrigger>
          ))}
        </ul>
      </div>
      <Form onSubmit={createMessage}>
        <InputGroup>
          <Form.Control type="text" placeholder="Type a message" value={message} onChange={({ target }) => setMessage(target.value)} />
          <InputGroup.Append>
            <Button className="input-btn" variant="primary" type="submit">Send</Button>
          </InputGroup.Append>
          <InputGroup.Append>
            <Button className="input-btn" variant="primary" onClick={() => setShowAddUserModal(!showAddUserModal)}>Add user</Button>
          </InputGroup.Append>
        </InputGroup>
      </Form>
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showAddUserModal}
        onHide={() => setShowAddUserModal(!showAddUserModal)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add a user to the chat
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={addUsertoChat}>
            <Form.Group>
              <Typeahead id="userSelection" placeholder="Start typing a username..." options={getAddableUsers()} onChange={setNewUser} />
            </Form.Group>
            <Button className="input-btn" variant="primary" type="submit">
              Add user
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Chat;
