import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import React, { useState, useEffect } from 'react';
import { Row, Container, Form, Button, InputGroup, FormControl, ButtonGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { login, signup } from '../../store/actions/auth.js';
import { Animated } from "react-animated-css";
import AnimateHeight from 'react-animate-height';

import "./styles.css";
const Login = () => {

    const [isLoginForm, setLoginForm] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const loginRegisterMessage = useSelector(state => state.auth.loginRegMessage);
    const [isLoginMessage, setLoginMessage] = useState(true);
    const [colorIsGreen, setColorIsGreen] = useState(false);

    const dispatch = useDispatch();


    useEffect(() => {
        // storage.removeItem('persist:root');

    }, [])
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLoginForm) {
            dispatch(login(username, password))
                .then(() => {
                    console.log('user logged in succesfully. im in react')
                }).catch((err) => {
                    setLoginMessage(true);
                    setColorIsGreen(false);
                });
        } else {
            dispatch(signup(name, username, password))
                .then(() => {
                    setLoginMessage(false);
                    setColorIsGreen(true);
                    console.log('user registered succesfully. im in react')
                }).catch((err) => {
                    setColorIsGreen(false);
                    setLoginMessage(false);
                });
        }
    }

    return (
        <Container className="loginReg-cont">
            <Row>
                <Container className="loginReg-row shadow-lg" styles={{backgroundColor:'#3581eb'}}>

                    <div className="loginForm-cont shadow-lg">
                        <div>
                            <ButtonGroup aria-label="LoginReg Button" className="mb-3">
                                <Button onClick={() => setLoginForm(true)} active={isLoginForm} className="shadow-none" variant="outline-secondary">Login</Button>
                                <Button onClick={() => setLoginForm(false)} active={!isLoginForm} className="shadow-none" variant="outline-secondary">Signup</Button>
                            </ButtonGroup>
                        </div>

                        <div>
                            <Form className="mb-3" onSubmit={handleSubmit} >

                                <Animated animationOut="fadeOut" isVisible={!isLoginForm}>
                                    {!isLoginForm && <Form.Group className="mb-3" controlId="formBasicText">
                                        <Form.Label>Your name</Form.Label>
                                        <Form.Control type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder="Enter ur name!" />
                                    </Form.Group>}

                                </Animated>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" onChange={(e) => setUsername(e.target.value)} value={username} placeholder="Enter ur username!" />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>

                                    <InputGroup className="mb-3">
                                        <FormControl type={showPassword ? "text" : "password"}
                                            aria-label="Enter your passowrd!"
                                            onChange={(e) => setPassword(e.target.value)}
                                            value={password}
                                            placeholder="Password"
                                        />
                                        <Button active={showPassword}
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="shadow-none"
                                            variant="outline-dark"
                                        >
                                            show!
                                        </Button>
                                    </InputGroup>

                                    {/* <Form.Control type={showPassword ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Password" /> */}
                                </Form.Group>

                                {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" onChange={(e) => setShowPassword(e.target.checked)} label="Show password!" />
                                </Form.Group> */}
                                <div className="d-grid gap-2 mb-3">
                                    <Button variant={isLoginForm ? "primary" : "warning"} size="lg" type="submit" >
                                        {isLoginForm ? 'Login!' : 'Register!'}
                                    </Button>
                                </div>
                                <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={isLoginForm}>
                                    {isLoginForm &&
                                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                            <Form.Check type="checkbox" label="Remember me!" />
                                        </Form.Group>
                                    }
                                </Animated>
                                {isLoginForm && isLoginMessage &&
                                    <div className="warning-message">
                                        {loginRegisterMessage}
                                    </div>
                                }
                                {!isLoginForm && !isLoginMessage &&
                                    <div className={colorIsGreen ? "success-message" : "warning-message"}>
                                        {loginRegisterMessage}
                                    </div>
                                }

                            </Form>
                            <div className="or-container">
                                <div className="line-separator"></div>
                                <div className="or-label">or</div>
                                <div className="line-separator"></div>
                            </div>

                            <div className="d-grid gap-2">
                                <Button variant="outline-primary" size="lg" type="submit">
                                    <img src="https://img.icons8.com/color/16/000000/google-logo.png" /> Login Using Google
                                </Button>
                            </div>

                        </div>
                    </div>
                </Container>

            </Row>
        </Container>
    );
};

export default Login;