import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import storageService from './utils/storage';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const user = storageService.loadUser();
    console.log(user);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    storageService.saveUser(`${username} + ${password}`);
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
    </div>
  );
}

export default Login;
