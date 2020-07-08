import React, { useEffect, useState } from 'react';
import {
  Button, Image, Modal, Form,
} from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Chat from './Chat';

import storageService from '../utils/storage';
import helperService from '../utils/helpers';

import chatService from '../services/chat';
import userService from '../services/user';
import { setUser, setAllUsers } from '../reducers/userReducer';
import {
  setChats, addChat, setCurrentChat, removeMessageNotification,
} from '../reducers/chatReducer';
import socketService from '../services/socket';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import '../styles/Chats.css';

function Home() {
  const dispatch = useDispatch();

  const [chatTitle, setChatTitle] = useState('');
  const [chatUsers, setChatUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const user = useSelector((state) => state.users.currentUser);
  const chats = useSelector((state) => state.chats.chats);
  const allUsers = useSelector((state) => state.users.users);

  const getChats = async (savedUser) => {
    const userChats = await chatService.getAllChats();
    const chatsWithTime = helperService.initMessageNotifications(savedUser, userChats);
    const chatIDs = userChats.map((chat) => chat.id);

    socketService.subscribeChats(chatIDs);
    dispatch(setChats(chatsWithTime));
  };

  const getUsers = async () => {
    const users = await userService.getAllUsers();
    dispatch(setAllUsers(users));
  };

  useEffect(() => {
    const savedUser = storageService.loadUser();

    dispatch(setUser(savedUser));
    getChats(savedUser);
    getUsers();

    return async () => {
      const updatedUser = await userService.updateLastLogin();
      storageService.saveUser(updatedUser);
    };
  }, []);

  const logOut = () => {
    userService.updateLastLogin();
    storageService.logoutUser();
    dispatch(setCurrentChat(null));
    dispatch(setChats([]));
    dispatch(setUser(null));
  };

  const createChat = async (event) => {
    event.preventDefault();
    if (!chatTitle) {
      console.log('Huono input otsikolle');
      return;
    }
    if (!chatUsers.length >= 1) {
      console.log('Huono input käyttäjille');
      return;
    }

    const newChat = await chatService.createChat(chatTitle, chatUsers);
    dispatch(addChat(newChat));
    setChatTitle('');
    setChatUsers([]);
    setShowModal(!showModal);
  };

  const selectChat = async (chatID) => {
    const currentChat = await chatService.getCurrentChat(chatID);
    dispatch(removeMessageNotification(chatID));
    dispatch(setCurrentChat(currentChat));
  };

  if (!user) {
    return (
      <Redirect to="/" />
    );
  }

  return (
    <div className="chatsContainer">
      <div className="chatContainerHeader">
        <Image src="" roundedCircle />
        <Button className="input-btn" id="logOut-btn" onClick={logOut}>Log out</Button>
        <Button className="input-btn" id="createChat-btn" onClick={() => setShowModal(!showModal)}>Create chat</Button>

        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={showModal}
          onHide={() => setShowModal(!showModal)}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Chat creation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Create a new chat. Chat&apos;s name has to be unique!
            </p>
            <Form onSubmit={createChat}>
              <Form.Group>
                <Form.Control maxLength={60} type="text" id="chatTitle" placeholder="Type a name for the chat" value={chatTitle} onChange={({ target }) => setChatTitle(target.value)} />
              </Form.Group>
              <Form.Group>
                <Typeahead
                  id="userSelection"
                  placeholder="Add users"
                  multiple
                  options={allUsers.map((singleUser) => singleUser.username)
                    .filter((singleUser) => singleUser !== user.username)}
                  selected={chatUsers}
                  onChange={setChatUsers}
                />
              </Form.Group>
              <Button className="form-btn" variant="primary" type="submit">
                Create
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
      <div className="chatContainerBody">
        <div className="chat-list">
          <h1 className="chat-list-header">Chats</h1>
          <div className="chat-list-body">
            {chats.map((chat) => (
              <Button className="chat-btn" key={chat.id} variant="primary" onClick={() => selectChat(chat.id)}>
                {chat.title}
                <p className="chat-message-notification">{chat.messageNotification}</p>
              </Button>
            ))}
          </div>
        </div>
        <div className="current-chat">
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default Home;
