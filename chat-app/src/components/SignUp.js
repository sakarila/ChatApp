import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import userService from '../services/user';

function SignUp() {
  const history = useHistory();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !username || !password) {
      setAlertMessage('Please fill all the required fields!');
      setShowAlert(true);
      return;
    }

    try {
      await userService.signup({ username, email, password });
      history.goBack();
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
      <h1 className="header">Register for a new account!</h1>
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
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" id="email" value={email} onChange={({ target }) => setEmail(target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" id="username" value={username} onChange={({ target }) => setUsername(target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" id="password" value={password} onChange={({ target }) => setPassword(target.value)} />
            </Form.Group>
            <Button variant="primary" className="form-btn" type="submit">
              Sign up!
            </Button>
            <Button variant="primary" className="form-btn" onClick={() => history.goBack()}>
              Cancel
            </Button>
          </Form>
        )}
    </div>
  );
}

export default SignUp;
