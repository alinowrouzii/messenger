import React, { useRef, useEffect, useState } from 'react';
import { Container, Row, Col, InputGroup, Button, FormControl, Form } from 'react-bootstrap';
import ProfileInfo from './../Utils/ProfileInfo/ProfileInfo';
import Message from './../Utils/Message/Message'
import MyProfileInfo from './../Utils/MyProfileInfo/MyProfileInfo'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import Profile from '../Utils/Profile/Profile';
import './styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/auth';
import { getMe, getUserData } from '../../actions/user';
import { getChats } from '../../actions/chat'

const ChatPage = () => {

    const dispatch = useDispatch();

    const [typedText, setTypedText] = useState("");

    const scrollRef = useRef();
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [])

    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    const ownUser = useSelector(state => state.userData.ownUser);
    const chats = useSelector(state => state.chatsData.chats);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(getChats())
                .then(() => {
                    console.log('chats fetched successfuly');
                }).catch((err) => {
                    console.log('error in fetching chats');
                });;
        }
    }, [isLoggedIn]);

    const handleLogout = (e) => {
        dispatch(logout());
    }



    return (
        <>
            <Container className="mainContainer chatPageStyles" fluid>
                <Row className="rowOne mb-3">
                    <Col lg={4} style={{ marginTop: "15px", marginBottom: "10px" }}>
                        <MyProfileInfo />
                    </Col>
                    <Col lg={8}>
                        <Button onClick={handleLogout}>logout</Button>
                    </Col>
                </Row>
                <Row className="rowTwo">
                    <Col lg={2}>
                        <Row>

                            <InputGroup className="mb-2">
                                <Button variant="outline-secondary">Ur friends</Button>
                                <Button variant="outline-secondary">All users</Button>
                            </InputGroup>
                        </Row>
                        <Row>
                            <InputGroup className="mb-3">
                                <FormControl aria-label="Enter the username!" placeholder="Enter userName" />
                                <Button variant="outline-secondary">Search!</Button>
                            </InputGroup>
                        </Row>
                        {/* users list */}
                        <Row className="contactLists">
                            <div className="mb-3">
                                <ProfileInfo />
                            </div>
                            <div className="mb-3">
                                <ProfileInfo />
                            </div>
                            <div className="mb-3">
                                <ProfileInfo />
                            </div>
                            <div className="mb-3">
                                <ProfileInfo />
                            </div>
                            <div className="mb-3">
                                <ProfileInfo />
                            </div>
                            <div className="mb-3">
                                <ProfileInfo />
                            </div>
                            <div className="mb-3">
                                <ProfileInfo />
                            </div>
                            <div className="mb-3">
                                <ProfileInfo />
                            </div>
                            <div className="mb-3">
                                <ProfileInfo />
                            </div>
                            <div className="mb-3">
                                <ProfileInfo />
                            </div>
                            <div className="mb-3">
                                <ProfileInfo />
                            </div>
                        </Row>
                    </Col>
                    <Col lg={8}>
                        <div className="chatSection">

                            <div className="messageSection">
                                <div ref={scrollRef}>
                                    <Message me={true} text="heyoifjeori  oihfo oifhvoerih oihgorigo ohofihrfo erovreufeiuerjknbekvjkg" />
                                </div>
                                <div ref={scrollRef}>
                                    <Message me={false} text="hello Ali how r u" />
                                </div>
                                <div ref={scrollRef}>
                                    <Message me={true} text="heyoifjeori  oihfo oifhvoerih oihgorigo ohofihrfo erovreufeiuerjknbekvjkg" />
                                </div>
                                <div ref={scrollRef}>
                                    <Message me={true} text="heyoifjeori  oihfo oifhvoerih oihgorigo ohofihrfo erovreufeiuerjknbekvjkg" />
                                </div>
                                <div ref={scrollRef}>
                                    <Message me={true} text="hello Ali how r u" />
                                </div>
                                <div ref={scrollRef}>
                                    <Message me={false} text="heyoifjeori  oihfo oifhvoerih oihgorigo ohofihrfo erovreufeiuerjknbekvjkg" />
                                </div>
                                <div ref={scrollRef}>
                                    <Message me={true} text="hello Ali how r u" />
                                </div>
                            </div>
                            <InputGroup className="sendSection">
                                {/* <Picker style={{ position: 'absolute', bottom: '10px', left: '10px' }} set='apple' onSelect={(e) => setTypedText(prevtext => (prevtext + e.native))} title='Pick your emoji…' emoji='point_up' emojiTooltip={true} /> */}
                                <FormControl as="textarea" className="textarea" onChange={(e) => setTypedText(e.target.value)} value={typedText} placeholder="type something" />
                                <Button variant="primary">Send!</Button>
                            </InputGroup>
                        </div>
                    </Col>
                    <Col lg={2}>
                        <div className="profileSection">
                            <Profile></Profile>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ChatPage;