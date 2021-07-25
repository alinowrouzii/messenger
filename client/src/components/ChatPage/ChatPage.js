import React, { useRef, useEffect, useState } from 'react';
import { Container, Row, Col, InputGroup, Button, FormControl, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import ProfileInfo from './../Utils/ProfileInfo/ProfileInfo';
import ProfileInfoWIthAddBtn from './../Utils/ProfileInfo/ProfileInfoWithAddBtn';
import Message from './../Utils/Message/Message'
import MyProfileInfo from './../Utils/MyProfileInfo/MyProfileInfo'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import Profile from '../Utils/Profile/Profile';
import './styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/auth';
import { getMe, getUserData, searchUsers } from '../../actions/user';
import { getMessages, sendMessage } from '../../actions/message';
import { getChats } from '../../actions/chat'
import { SET_MESSAGE_READY, SET_CHATS_READY } from './../../actions/types';
import { Animated } from "react-animated-css";

const ChatPage = () => {

    const dispatch = useDispatch();

    const [typedText, setTypedText] = useState("");

    const [friendButtonSelected, setFriendButtonSelected] = useState(true);
    const [searchBarText, setSearchBarText] = useState("");

    const [fliteredUsersText, setFilteredUsersText] = useState("");
    const [filteredUserIsActive, setFilteredUserIsActive] = useState(false);

    const [searchedUsersIsReady, setsearchedUsersIsReady] = useState(false);
    const searchedUsers = useSelector(state => state.userData.searchedUsers);

    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    const ownUser = useSelector(state => state.userData.ownUser);
    const ownUserMessageInfo = useSelector(state => state.userData.ownUserMessage);
    const ownUserIsReady = useSelector(state => state.userData.ownUserIsReady);

    const chats = useSelector(state => state.chatsData.chats);
    const chatsIsReady = useSelector(state => state.chatsData.chatsIsReady);
    const chatMessageInfo = useSelector(state => state.chatsData.chatMessage);


    const [selectedChat, setSelectedChat] = useState(null);

    const messages = useSelector(state => state.messageData.messages);
    const messagesInfo = useSelector(state => state.messageData.messageInfo)
    const messagesIsReady = useSelector(state => state.messageData.messagesIsReady);

    const [sendingMsg, setSendingMsg] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalBodyText, setModalBodyText] = useState("");

    const scrollRef = useRef();
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, messagesIsReady, sendingMsg]);

    useEffect(() => {
        console.log('hello');
        if (isLoggedIn) {
            dispatch(getChats())
                .then(() => {
                    console.log('chats fetched successfulyyy');
                }).catch((err) => {
                    setModalBodyText(chatMessageInfo);
                    setModalTitle("chat error");
                    setShowModal(true);
                    console.log('error in fetching chats');
                });
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

    const handleSendMessage = () => {

        if (typedText.trim().length > 0) {
            console.log("typed text", typedText.trim())

            setSendingMsg(true);
            setTypedText("")

            dispatch(sendMessage(typedText.trim(), ownUser?._id, selectedChat?._id)).then(() => {
                console.log('message sent')
                setSendingMsg(false);
            }).catch((err) => {
                console.log(err)
                setSendingMsg(false);

                setModalTitle("Message sending Error");
                setModalBodyText(messagesInfo);
                setShowModal(true);
            });
        }

    }

    const handleSearchUsers = () => {
        if (!filteredUserIsActive) {

            if (searchBarText.trim().length > 0) {
                if (friendButtonSelected) {
                    setFilteredUsersText(searchBarText.trim());
                } else {
                    dispatch(searchUsers('username', searchBarText.trim()))
                        .then(() => {
                            setsearchedUsersIsReady(true);
                        }).catch((err) => {
                            setModalTitle("Searching Error");
                            setModalBodyText(ownUserMessageInfo);
                            setShowModal(true);
                        });
                }

                setFilteredUserIsActive(true);
            }
        } else {
            setFilteredUserIsActive(false);
            setFilteredUsersText("");

            setsearchedUsersIsReady(false);
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
                                <FormControl
                                    onChange={(e) => setSearchBarText(e.target.value)}
                                    value={searchBarText}
                                    aria-label="Enter the username!"
                                    placeholder="Enter userName" />
                                <Button
                                    onClick={handleSearchUsers}
                                    variant="dark"
                                    className="shadow-none sendMsgBtn"
                                >
                                    {filteredUserIsActive ? "Cancel!" : "Search!"}
                                </Button>
                            </InputGroup>
                        </Row>
                        <Row className="contactLists">

                            {ownUserIsReady && chatsIsReady && !searchedUsersIsReady ?
                                chats?.filter(chat => chat.users[0]._id === ownUser._id ? (chat.users[1].username.includes(fliteredUsersText)) : ((chat.users[0].username.includes(fliteredUsersText))))
                                    .map((chat) =>
                                        <div key={chat._id}
                                            onClick={() => {
                                                setTypedText("");
                                                setSelectedChat(chat)
                                                dispatch(getMessages(chat._id)).catch((err) => { setModalTitle("Fetching message Error"); setModalBodyText(messagesInfo); setShowModal(true) });
                                            }}
                                            className="mb-3"
                                        >
                                            <ProfileInfo chat={chat} />
                                        </div>
                                    )
                                :
                                searchedUsersIsReady &&
                                searchedUsers.map((user) =>
                                    <div key={user._id}
                                        className="mb-3">
                                        <ProfileInfoWIthAddBtn user={user} />
                                    </div>
                                )
                            }
                        </Row>
                    </Col>

                    <Col lg={8}>
                        {/* {selectedChat && messagesIsReady && */}
                        {/* Add some extra condition to load messages and profile info in the same time */}

                        <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={ownUserIsReady && chatsIsReady && selectedChat && messagesIsReady}>
                            {ownUserIsReady && chatsIsReady && selectedChat && messagesIsReady &&

                                <div className={"chatSection " + (selectedChat && messagesIsReady && "shadow-lg rounded")}>
                                    <div className="messageSection">
                                        {messages?.map((msg) =>
                                            <div ref={scrollRef} key={msg._id}>
                                                <Message me={ownUser?._id == msg.sender} msg={msg} />
                                            </div>
                                        )}
                                        {sendingMsg &&
                                            <div ref={scrollRef} className="send-msg-spinner-cont">
                                                <Spinner className="send-msg-spinner" animation="border" role="status">
                                                </Spinner>
                                            </div>
                                        }

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
                                        <Button onClick={handleSendMessage} className="shadow-none sendMsgBtn" variant="dark">
                                            Send!
                                        </Button>
                                    </InputGroup>
                                </div>
                            }
                        </Animated>
                    </Col>

                    <Col lg={2}>
                        <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={ownUserIsReady && chatsIsReady && selectedChat && messagesIsReady}>
                            {ownUserIsReady && chatsIsReady && selectedChat && messagesIsReady &&
                                <div className="profileSection">
                                    <Profile user={ownUser._id === selectedChat.users[0]._id ? selectedChat.users[1] : selectedChat.users[0]} ></Profile>
                                </div>
                            }
                        </Animated>
                    </Col>

                </Row>
            </Container>

            <Modal show={showModal} onHide={() => console.log('message modal hided!')} animation={false}>
                <Modal.Header>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="danger">
                        {modalBodyText}
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ChatPage;