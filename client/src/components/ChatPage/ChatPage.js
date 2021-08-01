import React, { useRef, useEffect, useState } from 'react';
import { useStateRef } from './../../utils'
import { Container, Row, Col, InputGroup, Button, FormControl, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import ProfileInfo from './../Utils/ProfileInfo/ProfileInfo';
import ProfileInfoWIthAddBtn from './../Utils/ProfileInfo/ProfileInfoWithAddBtn';
import Message from './../Utils/Message/Message'
import Navbar from './../Navbar/Navbar'
import MyProfileInfo from './../Utils/MyProfileInfo/MyProfileInfo'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import Profile from '../Utils/Profile/Profile';
import './styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/actions/auth';
import { getMe, getUserData, searchUsers } from '../../store/actions/user';
import { getMessages, sendMessage } from '../../store/actions/message';
import { getChats } from '../../store/actions/chat'
import { SET_MESSAGE_READY, SET_CHATS_READY, SET_ONLINE_USERS, SET_NEW_MESSAGE_NOTIF, ADD_NEW_MESSAGE_NOTIF, REMOVE_NEW_MESSAGE_NOTIF } from './../../store/actions/types';
import { Animated } from "react-animated-css";
import socket from "./../../socket";
import { URL } from '../../constants';
import { format } from 'timeago.js';

const ChatPage = () => {

    const dispatch = useDispatch();

    const [typedText, setTypedText] = useState("");

    const [chatTextareaRows, setChatTextareaRows] = useState({
        rows: 1,
        minRows: 1,
        maxRows: 2,
    });

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


    // const [selectedChat, setSelectedChat] = useState(null);
    const [selectedChat, setSelectedChat, selectedChatRef] = useStateRef(null);



    const fetchedMessages = useSelector(state => state.messageData.messages);
    const messagesInfo = useSelector(state => state.messageData.messageInfo)
    const messagesIsReady = useSelector(state => state.messageData.messagesIsReady);

    const [onlineUsers, setOnlineUsers] = useState([]);

    const [friends, setFriends] = useState([]);

    const [messages, setMessages] = useState([]);

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


    //***********************************Socket implementation*********************************************** */

    useEffect(() => {

        if (ownUserIsReady) {

            socket.connect();
            socket.removeAllListeners();

            socket.onAny((event, ...args) => {
                console.log('-0-----------------');
                console.log(event, args);
                console.log('-0-----------------');
            });

            // socket.emit("whoami", (whoami) => {
            //     window.alert('Im ' + whoami+ socket.request.session);
            // })

            socket.emit("addUser", ownUser?._id, ownUser?.name);

            console.log('shiiiiiiiiiiiiiiiiiiiiiiiiiiiiittttttttt');
            console.log(new Date());

            socket.on("getUsers", (users) => {
                dispatch({
                    type: SET_ONLINE_USERS,

                    payload: {
                        onlineUsers: users
                        //it is also possible to handle this filter in the socket side and socket returns filtered user
                        // onlineUsers: ownUser?.friends.filter((f) => users.some((u) => u._id === f))
                    }
                })
                setOnlineUsers(
                    ownUser.friends.filter((f) => users.some((u) => u._id === f._id))
                );
            });
            socket.on("connect_error", (err) => {
                console.log('connect_error due to' + err.message);
                socket.removeAllListeners()
                socket.disconnect();
            });

            socket.on("getMessage", (data) => {

                const newMsg = {
                    sender: data.sender,
                    text: data.text,
                    // chat: selectedChat?._id,
                    createdAt: Date.now(),
                    _id: new Date().getUTCMilliseconds()
                };
                console.log('text', data.text)
                console.log("messages added", data.sender, "---", selectedChat)
                console.log('query', selectedChat?.users.some(user => user._id === data.sender));


                selectedChatRef.current?.users.some(user => user._id === data.sender) && setMessages(prev => [...prev, newMsg]);

                !(selectedChatRef.current?.users.some(user => user._id === data.sender))
                    && dispatch({
                        type: ADD_NEW_MESSAGE_NOTIF,
                        payload: {
                            //data.sender is id of sender
                            user: data.sender
                        }
                    })
            });
        }

    }, [ownUserIsReady])

    // useEffect(() => {

    //     console.log('runneddddddd')
    //     socket.on("getMessage", (data) => {

    //         const newMsg = {
    //             sender: data.sender,
    //             text: data.text,
    //             // chat: selectedChat?._id,
    //             createdAt: Date.now(),
    //             _id: new Date().getUTCMilliseconds()
    //         };
    //         console.log('text', data.text)
    //         console.log("messages added", data.sender, "---", selectedChat)
    //         console.log('query', selectedChat?.users.some(user => user._id === data.sender))
    //         selectedChatRef.current?.users.some(user => user._id === data.sender) && setMessages(prev => [...prev, newMsg]);
    //     });
    // }, []);


    //******************************************************************************************************** */


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
    }, []);

    useEffect(() => {
        if (fetchedMessages) {
            setMessages(fetchedMessages);
        }
        setSendingMsg(false);

    }, [fetchedMessages]);

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

    const handleSendMessage = () => {

        if (typedText.trim().length > 0) {
            console.log("typed text", typedText.trim())

            setSendingMsg(true);
            const typedTxt = typedText;

            setTypedText("");
            setChatTextareaRows(prev => ({
                ...prev,
                rows: 1,
            }))

            dispatch(sendMessage(typedTxt.trim(), ownUser?._id, selectedChat?._id)).then(() => {
                console.log('typeeeeed then', typedText);

                // const newMsg = {
                //     text: typedTxt,
                //     sender: ownUser?._id,
                //     chat: selectedChat?._id,
                //     createdAt: new Date()
                // }
                // setMessages(prev => [...prev, newMsg]);


                //********************Socket implementation******************* */
                const reciever = selectedChat?.users[0]._id === ownUser?._id ? selectedChat?.users[1]._id : selectedChat?.users[0]._id;
                socket.emit("sendMessage", {
                    sender: ownUser?._id,
                    receiver: reciever,
                    text: typedTxt,
                });
                //********************Socket implementation******************* */

                console.log('message sent');
            }).catch((err) => {
                console.log(err)
                setSendingMsg(false);

                setModalTitle("Message sending Error");
                setModalBodyText(messagesInfo);
                setShowModal(true);
            });
        }

    }

    const handleGetMessages = (chat) => (e) => {


        setTypedText("");
        setSelectedChat(chat);
        console.log(chat)
        console.log('fucking chat selected')
        dispatch(getMessages(chat._id))
            .then(() => {
                // console.log('fetched messages')'
                console.log('In chatPage');

                dispatch({
                    type: REMOVE_NEW_MESSAGE_NOTIF,
                    payload: {
                        user: (ownUser?._id === chat.users[0]._id) ? chat.users[1]._id : chat.users[0]._id
                    }
                })
            }).catch((err) => {
                setModalTitle("Fetching message Error");
                setModalBodyText(messagesInfo);
                setShowModal(true);
            });

        // console.log('i got chat', chat)
    }



    const handleTextareaChange = (event) => {
        const textareaLineHeight = 24;
        const { minRows, maxRows } = chatTextareaRows;

        const previousRows = event.target.rows;
        event.target.rows = minRows; // reset number of rows in textarea 

        const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

        if (currentRows === previousRows) {
            event.target.rows = currentRows;
        }

        if (currentRows >= maxRows) {
            event.target.rows = maxRows;
            event.target.scrollTop = event.target.scrollHeight;
        }

        setTypedText(event.target.value);
        setChatTextareaRows(prev => ({
            ...prev,
            rows: currentRows < maxRows ? currentRows : maxRows,
        }))
    }



    // const handleMessageScroll = (e) => {
    //     console.log('scroll');
    // }


    const throttle = (fn, wait) => {
        var time = Date.now();
        console.log('hello')
        return function () {
            if ((time + wait - Date.now()) < 0) {
                fn();
                time = Date.now();
            }
        }
    }

    const chatScrollRef = useRef(null);
    const [goToBottomBtnShow, setGoToBottomBtnShow] = useState(false);
    const throttleCallback = () => {
        console.log('hey hey hey');
        const scrollHeight = chatScrollRef.current.scrollHeight;
        const scrollTop = chatScrollRef.current.scrollTop;
        console.log(chatScrollRef.current.scrollTop);
        console.log(chatScrollRef.current.scrollHeight);
        console.log('--------------------------')
        if (scrollHeight - scrollTop > 800) {
            setGoToBottomBtnShow(true);
        } else {
            setGoToBottomBtnShow(false);

        }
    }


    const handleTextareaKeyPress = (e) => {
        if (e.keyCode === 13 && e.ctrlKey) {
            handleSendMessage();
        }
    }


    const handleGoToBottomBtn = (e) => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const handleLogout = (e) => {
        dispatch(logout());
        socket.removeAllListeners();
        socket.disconnect();
    }

    return (
        <>
            <Container className="mainContainer chatPageStyles" fluid>
                <Row className="rowOne mb-3 bg-primary text-white p-2">
                    <Col className='' lg={10} style={{ marginTop: "15px", marginBottom: "10px" }}>
                        <Navbar logout={handleLogout} />

                        {/* <Button onClick={handleLogout}>logout</Button> */}
                    </Col>
                    <Col className='' lg={2} style={{ marginTop: "15px", marginBottom: "10px" }}>
                        <MyProfileInfo />
                    </Col>
                </Row>
                <Row className="rowTwo">
                    <Col lg={2} sm={4} className="shadow-lg rounded">
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
                                    className="textarea search-textarea"
                                    placeholder="Enter userName" />
                                <Button
                                    onClick={handleSearchUsers}
                                    variant="secondary"
                                    className="shadow-none sendMsgBtn ms-1"
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
                                            onClick={handleGetMessages(chat)}
                                            className="mb-1"
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

                    <Col lg={8} sm={8}>
                        {/* {selectedChat && messagesIsReady && */}
                        {/* Add some extra condition to load messages and profile info in the same time */}

                        <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={ownUserIsReady && chatsIsReady && selectedChat && messagesIsReady}>
                            {ownUserIsReady && chatsIsReady && selectedChat && messagesIsReady &&

                                <div className={"chatSection " + (selectedChat && messagesIsReady && "shadow-lg rounded")}>
                                    <div className="messageSection" ref={chatScrollRef} onScroll={throttle(throttleCallback, 500)}>
                                        {/* <div className="messageSection" onScroll={handleMessageScroll}> */}
                                        {messages?.map((msg, i, messages) => {
                                            let nextIsMe = false;
                                            let nextIsUser = false;
                                            if (i < messages.length - 1) {
                                                nextIsMe = messages[i + 1].sender === ownUser?._id;
                                                nextIsUser = !nextIsMe;
                                            }
                                            return <div ref={scrollRef} key={msg._id}>
                                                {/* nextIsMe shows that next message belongs to ownUser or not */}
                                                <Message nextIsMe={nextIsMe} nextIsUser={nextIsUser} me={ownUser?._id === msg.sender} msg={msg} />
                                            </div>
                                        })}
                                        {sendingMsg &&
                                            <div ref={scrollRef} className="send-msg-spinner-cont">
                                                <Spinner className="send-msg-spinner" animation="border" role="status" variant="primary">
                                                </Spinner>
                                            </div>
                                        }

                                    </div>

                                    <div className="sendSection shadow-lg">

                                        <InputGroup>
                                            {/* <Picker style={{ position: 'absolute', bottom: '10px', left: '10px' }} set='apple' onSelect={(e) => setTypedText(prevtext => (prevtext + e.native))} title='Pick your emoji…' emoji='point_up' emojiTooltip={true} /> */}
                                            <FormControl as="textarea"
                                                className="textarea"
                                                onChange={handleTextareaChange}
                                                onKeyDown={handleTextareaKeyPress}
                                                // onChange={(e) => setTypedText(e.target.value)}
                                                value={typedText}
                                                placeholder="type something"
                                                rows={chatTextareaRows.rows}
                                            // styles={{ marginRight: "10px" }}
                                            />

                                            <Button onClick={handleSendMessage} className="shadow-none sendMsgBtn rounded ms-3 mb-0 text-white" variant="primary">
                                                Send!
                                            </Button>
                                        </InputGroup>
                                        {/* {goToBottomBtnShow &&
                                            <Button onClick={handleGoToBottomBtn} >
                                                go to bottom
                                            </Button>} */}
                                    </div>
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