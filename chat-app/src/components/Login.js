import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import storageService from '../utils/storage';

import { setUser } from '../reducers/userReducer';
import userService from '../services/user';

import '../styles/Auth.css';

function Login() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = await userService.login({ username, password });
    storageService.saveUser(user);
    dispatch(setUser(user));
  };

  return (
    <div className="formContainer">
      <div>
        <h1 className="header">Welcome to ChatApp!</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" id="username" onChange={({ target }) => setUsername(target.value)} />
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
      </div>
    </div>
  );
}

export default Login;
