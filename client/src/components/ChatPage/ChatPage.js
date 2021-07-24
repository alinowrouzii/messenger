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
import { getMessages, sendMessage } from '../../actions/message';
import { getChats } from '../../actions/chat'
import { SET_MESSAGE_READY, SET_CHATS_READY } from './../../actions/types';
import { Animated } from "react-animated-css";

const ChatPage = () => {

    const dispatch = useDispatch();

    const [typedText, setTypedText] = useState("");

    const [friendButtonSelected, setFriendButtonSelected] = useState(true);
    const [searchBarText, setSearchBarText] = useState("");

    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    const ownUser = useSelector(state => state.userData.ownUser);
    const ownUserIsReady = useSelector(state => state.userData.ownUserIsReady);

    const chats = useSelector(state => state.chatsData.chats);
    const chatsIsReady = useSelector(state => state.chatsData.chatsIsReady);

    const [selectedChat, setSelectedChat] = useState(null);
    const messages = useSelector(state => state.messageData.messages);
    const messagesIsReady = useSelector(state => state.messageData.messagesIsReady);

    const scrollRef = useRef();
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, messagesIsReady]);

    useEffect(() => {
        console.log('hello');
        if (isLoggedIn) {
            dispatch(getChats())
                .then(() => {
                    console.log('chats fetched successfuly');
                }).catch((err) => {
                    console.log('error in fetching chats');
                });;
        }
    }, [isLoggedIn]);


    useEffect(() => {
        if (chats.length > 0) {
            console.log('chatsss', chats);
        }
    }, [chats])

    useEffect(() => {
        dispatch({
            type: SET_MESSAGE_READY,
            payload: { isReady: false }
        });
    }, [])

    // const handleContactClick = (e) => {
    //     console.log(e);
    // }

    const handleSendMessage = () => {

        if(typedText.trim().length >0){
            console.log("typed text",typedText.trim())
            dispatch(sendMessage(typedText.trim(), ownUser?._id, selectedChat?._id));
            setTypedText("")
        }
    }

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
                    <Col lg={2} className="shadow-lg rounded">
                        <Row>

                            <InputGroup className="mb-2">
                                <Button active={friendButtonSelected}
                                    onClick={() => setFriendButtonSelected(true)}
                                    className="shadow-none"
                                    variant="secondary"
                                >
                                    Ur friends
                                </Button>
                                <Button active={!friendButtonSelected}
                                    onClick={() => setFriendButtonSelected(false)}
                                    className="shadow-none"
                                    variant="secondary"
                                >
                                    All users
                                </Button>
                            </InputGroup>
                        </Row>
                        <Row>
                            <InputGroup className="mb-3">
                                <FormControl aria-label="Enter the username!" placeholder="Enter userName" />
                                <Button variant="dark">Search!</Button>
                            </InputGroup>
                        </Row>
                        <Row className="contactLists">
                            {chatsIsReady &&
                                chats?.map((chat) =>
                                    <div key={chat._id}
                                        onClick={() => { setTypedText(""); dispatch(getMessages(chat._id)); setSelectedChat(chat) }}
                                        className="mb-3">

                                        <ProfileInfo chat={chat} />
                                    </div>
                                )}
                        </Row>
                    </Col>

                    <Col lg={8}>
                        {/* {selectedChat && messagesIsReady && */}
                        {/* Add some extra condition to load messages and profile info in the same time */}

                        <Animated animationIn="fadeInLeft" animationOut="fadeOut" isVisible={ownUserIsReady && chatsIsReady && selectedChat && messagesIsReady}>
                            {ownUserIsReady && chatsIsReady && selectedChat && messagesIsReady &&

                                <div className={"chatSection " + (selectedChat && messagesIsReady && "shadow-lg rounded")}>
                                    <div className="messageSection">
                                        {messages?.map((msg) =>
                                            <div ref={scrollRef} key={msg._id}>
                                                <Message me={ownUser?._id == msg.sender} msg={msg} />
                                            </div>
                                        )}
                                    </div>
                                    <InputGroup className="sendSection">
                                        {/* <Picker style={{ position: 'absolute', bottom: '10px', left: '10px' }} set='apple' onSelect={(e) => setTypedText(prevtext => (prevtext + e.native))} title='Pick your emoji…' emoji='point_up' emojiTooltip={true} /> */}
                                        <FormControl as="textarea"
                                            className="textarea"
                                            onChange={(e) => setTypedText(e.target.value)}
                                            value={typedText}
                                            placeholder="type something"
                                            styles={{ marginRight: "10px" }}
                                        />
                                        <Button onClick={handleSendMessage} variant="primary">Send!</Button>
                                    </InputGroup>
                                </div>
                            }
                        </Animated>
                    </Col>

                    <Col lg={2}>
                        <Animated animationIn="fadeInRight" animationOut="fadeOut" isVisible={ownUserIsReady && chatsIsReady && selectedChat && messagesIsReady}>
                            {ownUserIsReady && chatsIsReady && selectedChat && messagesIsReady &&
                                <div className="profileSection">
                                    <Profile user={ownUser._id === selectedChat.users[0]._id ? selectedChat.users[1] : selectedChat.users[0]} ></Profile>
                                </div>
                            }
                        </Animated>
                    </Col>

                </Row>
            </Container>
        </>
    );
};

export default ChatPage;