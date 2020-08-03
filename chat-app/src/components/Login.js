import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import storageService from '../utils/storage';
import { setUser } from '../reducers/userReducer';
import userService from '../services/user';
import socketService from '../services/socket';

import '../styles/Auth.css';

function Login() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const loggedUsers = await userService.getLoggedUsers();
    if (!username || !password) {
      setAlertMessage('Please provide a valid username and password!');
      setShowAlert(true);
      return;
    }
    if (loggedUsers.includes(username)) {
      setAlertMessage('You are already logged in!');
      setShowAlert(true);
      return;
    }

    try {
      const user = await userService.login({ username, password });
      storageService.saveUser(user);
      dispatch(setUser(user));
      socketService.logIn();
    } catch (error) {
      setAlertMessage(`${error.response.data.error}`);
      setShowAlert(true);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
    setAlertMessage('');
  };

  return (
    <div className="formContainer">
      <div>
        <h1 className="header">Welcome to ChatApp!</h1>
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
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" id="username" value={username} onChange={({ target }) => setUsername(target.value)} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" id="password" value={password} onChange={({ target }) => setPassword(target.value)} />
              </Form.Group>
              <Button className="form-btn" variant="primary" type="submit">
                Login
              </Button>
              <Button className="form-btn" onClick={() => history.push('/signup')}>
                Sign Up!
              </Button>
            </Form>
          )}
      </div>
    </div>
  );
}

export default Login;
