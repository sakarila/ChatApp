import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

function SignUp() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`${username} + ${password} + ${email}`);
  };

  return (
    <div className="container">
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" id="email" placeholder="Email" onChange={({ target }) => setEmail(target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" id="username" placeholder="Enter username" onChange={({ target }) => setUsername(target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" id="password" placeholder="Password" onChange={({ target }) => setPassword(target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Sign up
        </Button>
      </Form>
    </div>
  );
}

export default SignUp;
