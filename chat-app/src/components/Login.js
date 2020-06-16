import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import storageService from '../utils/storage';

import { setUser } from '../reducers/userReducer';
import authService from '../services/authenticate';

function Login() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const savedUser = storageService.loadUser();
    dispatch(setUser(savedUser));
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = await authService.login({ username, password });
    storageService.saveUser(user);
    dispatch(setUser(user));
  };

  return (
    <div className="container">
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" id="username" placeholder="Enter username" onChange={({ target }) => setUsername(target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" id="password" value={password} placeholder="Password" onChange={({ target }) => setPassword(target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
      <Link to="/signup">Sign Up!</Link>
    </div>
  );
}

export default Login;
