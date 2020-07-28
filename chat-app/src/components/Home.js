import React, { useEffect, useState } from 'react';
import {
  Button, Image, Modal, Form, Alert,
} from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Chat from './Chat';

import storageService from '../utils/storage';

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
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const user = useSelector((state) => state.users.currentUser);
  const chats = useSelector((state) => state.chats.chats);
  const allUsers = useSelector((state) => state.users.users);
  const loggedUsers = useSelector((state) => state.users.loggedUsers);

  const getChats = async () => {
    try {
      const userChats = await chatService.getAllChats();
      const chatIDs = userChats.map((chat) => chat.id);

      socketService.subscribe(chatIDs);
      dispatch(setChats(userChats));
    } catch (error) {
      setAlertMessage(`${error.response.data.error}`);
      setShowAlert(true);
    }
  };

  const getUsers = async () => {
    try {
      const users = await userService.getAllUsers();
      dispatch(setAllUsers(users));
    } catch (error) {
      setAlertMessage(`${error.response.data.error}`);
      setShowAlert(true);
    }
  };

  useEffect(() => {
    const savedUser = storageService.loadUser();

    dispatch(setUser(savedUser));
    getChats();
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
    socketService.logOut();
  };

  const createChat = async (event) => {
    event.preventDefault();
    if (!chatTitle) {
      setAlertMessage('Please provide a valid title for the chat!');
      setShowAlert(true);
    } else if (!chatUsers.length >= 1) {
      setAlertMessage('Please add at least one valid user to the chat!');
      setShowAlert(true);
    } else {
      try {
        const newChat = await chatService.createChat(chatTitle, chatUsers);
        dispatch(addChat(newChat));
        socketService.joinChat(newChat.id);

        loggedUsers.forEach((loggedUser) => {
          if (loggedUser.username !== user.username) {
            socketService.addUser(loggedUser.socketID, newChat.id);
          }
        });

        const newCurrentChat = await chatService.getCurrentChat(newChat.id);
        dispatch(setCurrentChat(newCurrentChat));

        setChatTitle('');
        setChatUsers([]);
        setShowModal(!showModal);
      } catch (error) {
        setAlertMessage(`${error.response.data.error}`);
        setShowAlert(true);

        setChatTitle('');
        setChatUsers([]);
        setShowModal(!showModal);
      }
    }
  };

  const selectChat = async (chatID) => {
    try {
      const currentChat = await chatService.getCurrentChat(chatID);
      dispatch(removeMessageNotification(chatID));
      dispatch(setCurrentChat(currentChat));
    } catch (error) {
      setAlertMessage(`${error.response.data.error}`);
      setShowAlert(true);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
    setAlertMessage('');
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
      {showAlert
        ? (
          <Alert variant="danger" show={showAlert} onClose={closeAlert} dismissible>
            <Alert.Heading>Error!</Alert.Heading>
            <p>
              {alertMessage}
            </p>
          </Alert>
        )
        : (
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
              <Chat
                showAlert={showAlert}
                setShowAlert={setShowAlert}
                alertMessage={alertMessage}
                setAlertMessage={setAlertMessage}
              />
            </div>
          </div>
        )}
    </div>
  );
}

export default Home;
