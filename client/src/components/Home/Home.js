import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ChatPage from './../ChatPage/ChatPage';
import Login from './../Login/Login';
const Home = () => {

    //isLoggedin should be global and we should use redux and use isLoggedIn globally
    const [isLoggedin, setLogin] = useState(true);

    return (
        <>
        home
        </>
    );
};

export default Home;