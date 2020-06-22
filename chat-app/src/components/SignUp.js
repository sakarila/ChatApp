import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import authService from '../services/authenticate';

function SignUp() {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    authService.signup({ username, email, password });
    history.goBack();
  };

  return (
    <div className="formContainer">
      <h1 className="header">Register for a new account!</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" id="email" onChange={({ target }) => setEmail(target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" id="username" onChange={({ target }) => setUsername(target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" id="password" onChange={({ target }) => setPassword(target.value)} />
        </Form.Group>
        <Button variant="primary" className="form-btn" type="submit">
          Sign up!
        </Button>
        <Button variant="primary" className="form-btn" onClick={() => history.goBack()}>
          Cancel
        </Button>
      </Form>
    </div>
  );
}

export default SignUp;
