import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ChatPage from './../ChatPage/ChatPage';
import Login from './../Login/Login';
import { useSelector } from 'react-redux';
const Home = () => {

    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    useEffect(()=>{
        console.log(isLoggedIn)
    });
    return (
        <>
            {isLoggedIn ? <ChatPage/> : <Login/>}
        </>
    );
};

export default Home;