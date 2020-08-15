/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typeahead } from 'react-bootstrap-typeahead';
import {
  Button, Form, Modal, InputGroup, OverlayTrigger, Tooltip, Dropdown, DropdownButton,
} from 'react-bootstrap';
import { animateScroll, Element, scroller} from 'react-scroll';
import PropTypes from 'prop-types';

import chatService from '../services/chat';
import socketService from '../services/socket';
import {
  addMessage, addUser, removeUserFromChat, setCurrentChat, addMessages,
} from '../reducers/chatReducer';

function Chat(props) {
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');
  const [newUser, setNewUser] = useState('');
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showLeaveChatModal, setShowLeaveChatModal] = useState(false);
  const [scrollBottom, setScrollBottom] = useState(true);

  const chat = useSelector((state) => state.chats.currentChat);
  const user = useSelector((state) => state.users.currentUser);
  const users = useSelector((state) => state.users.users);
  const loggedUsers = useSelector((state) => state.users.loggedUsers);

  const scrollToBottom = () => {
    if(scrollBottom) {
      const newMessagesElement = document.getElementById('NewMessages');
      if (newMessagesElement) {
        const currentChatElement = document.getElementById('current-chat-messages');
        scroller.scrollTo('myScrollToElement', { containerId: 'current-chat-messages', duration: 50 });
      } else {
          animateScroll.scrollToBottom({ containerId: 'current-chat-messages' });
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const createMessage = async (event) => {
    event.preventDefault();
    if (!message) {
      return;
    }

    try {
      const newMessage = await chatService.postNewMessage(chat.id, message);
      socketService.sendMessage(newMessage.id, chat.id);
      dispatch(addMessage(newMessage));
      setMessage('');
    } catch (error) {
      setMessage('');
      props.setAlertMessage(`${error.response.data.error}`);
      props.setShowAlert(true);
    }
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
      props.setAlertMessage('Please provide a valid username!');
      props.setShowAlert(true);
      return;
    }

    try {
      const addedUser = await chatService.addUserToChat(newUser, chat.id);
      dispatch(addUser(addedUser));

      const newUserLogged = loggedUsers.find((loggedUser) => loggedUser.username === newUser[0]);
      if (newUserLogged) {
        socketService.addUser(newUserLogged.socketID, chat.id);
      }

      setNewUser('');
      setShowAddUserModal(!showAddUserModal);
    } catch (error) {
      setNewUser('');
      props.setAlertMessage(`${error.response.data.error}`);
      props.setShowAlert(true);
    }
  };

  const leaveChat = async (chatID) => {
    try {
      const updatedChat = await chatService.removeUserFromChat(chatID);
      dispatch(removeUserFromChat(updatedChat.chatID));
      dispatch(setCurrentChat(null));
      setShowLeaveChatModal(false);

      socketService.leaveChat(updatedChat.id);
    } catch (error) {
      props.setAlertMessage(`${error.response.data.error}`);
      props.setShowAlert(true);
      setShowLeaveChatModal(false);
    }
  };

  const checkFirstNewMessage = (msg) => {
    const firstNewMessage = chat.messages.slice().find((message) => {
      const seenUsers = message.seen.map((user) => user.username)
      return !seenUsers.includes(user.username)
    })
    if (firstNewMessage && firstNewMessage.id === msg.id) {
      return true;
    }
    return false;
  };

  const handleScrollToTop = async (event) => {
    const element = event.target;
    if (element.scrollTop === 0 && chat.messages.length >= 50) {
      try {
        const messages = await chatService.getMoreMessages(chat.id, chat.messages.length);
        if (messages.length !== 0) {
          setScrollBottom(false);
          animateScroll.scrollTo(element.scrollHeight + 200, { containerId: 'current-chat-messages', duration: 0, });
          dispatch(addMessages(messages));
          setScrollBottom(true);
        }
      } catch (error) {
        setMessage('');
        props.setAlertMessage(`${error.response.data.error}`);
        props.setShowAlert(true);
      }
    }
  };

  return (
    <div className="chatbox">
      <h1 className="current-chat-header">{chat.title}</h1>
      <div id="current-chat-messages" onScroll={handleScrollToTop}>
        <ul id="message-list">
          {chat.messages.map((msg) => (
            <div key={msg.id}>
              {checkFirstNewMessage(msg) ? <li className='dashed' id="NewMessages"><Element name="myScrollToElement"></Element> <span>New Messages!</span> </li> : ''}
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
                  <div >
                    <p className="message">{msg.message}</p>
                    <p className="message-info">
                      {`${msg.user.username}, ${msg.time}`}
                    </p>
                  </div>
                </li>
              </OverlayTrigger>
            </div>
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
            <DropdownButton id="dropdown-variants-primary" className="input-btn" title="Options">
              <Dropdown.Item as="button" onClick={() => setShowUsersModal(!showUsersModal)}>Show users</Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => setShowAddUserModal(!showAddUserModal)}>Add user</Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => setShowLeaveChatModal(!showLeaveChatModal)}>Leave chat</Dropdown.Item>
            </DropdownButton>
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
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showLeaveChatModal}
        onHide={() => setShowLeaveChatModal(!showLeaveChatModal)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Are you sure you want to leave?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button variant="primary" type="submit" onClick={() => leaveChat(chat.id)}>Leave</Button>
        </Modal.Body>
      </Modal>
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showUsersModal}
        onHide={() => setShowUsersModal(!showUsersModal)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Chat users
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <ul>
              {chat.users.map((chatUser) => (
                <div key={chatUser.username}>
                  <li key={chatUser.username}>
                    {loggedUsers.map((loggedUser) => loggedUser.username).includes(chatUser.username)
                      ? <div><strong>{chatUser.username}</strong> is logged in!</div> : <div><strong>{chatUser.username}</strong> last login {chatUser.lastLogin}</div>}
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

Chat.propTypes = {
  setShowAlert: PropTypes.func.isRequired,
  setAlertMessage: PropTypes.func.isRequired,
};

export default Chat;
