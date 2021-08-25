import React, { useRef, useEffect, useState } from 'react';
import { useStateRef } from './../../utils'
import { Container, Row, Col, InputGroup, Button, FormControl, Form, Modal, Alert, Spinner, Image, Dropdown, Toast, Card } from 'react-bootstrap';
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
import { addPendingMessage, getMessages, sendMessage } from '../../store/actions/message';
import { getChats } from '../../store/actions/chat'
import { SET_MESSAGE_READY, SET_CHATS_READY, SET_ONLINE_USERS, SET_NEW_MESSAGE_NOTIF, ADD_NEW_MESSAGE_NOTIF, REMOVE_NEW_MESSAGE_NOTIF, ADD_TYPING_USER, REMOVE_TYPING_USER, ADD_MESSAGE_FROM_SOCKET } from './../../store/actions/types';
import { Animated } from "react-animated-css";
import socket from "./../../socket";
import { URL } from '../../constants';
import _ from 'underscore';
import { v4 as uuidv4 } from 'uuid';

import { ReactComponent as MicIcon } from './../../Images/microphone.svg';
// import { ReactComponent as StopRecordingMic } from './../../Images/stop-record.svg';
import { ReactComponent as CancelIcon } from './../../Images/multiply.svg';
// import { ReactComponent as SendIcon } from './../../Images/send-icon-reverse.svg';
import sendIcon from './../../Images/send-icon-reverse.png';
import { ReactComponent as FileAttachIcon } from './../../Images/file-attach.svg';
// import { ReactComponent as XIcon } from './../../Images/.svg';

import scrollDownIcon from './../../Images/scroll-down.png'
import useRecorder from '../../utils/useRecorder';
import dateFormat from "dateformat";

import { ArrowLeft } from 'react-bootstrap-icons';


const ChatPage = () => {

    const dispatch = useDispatch();

    const [typedText, setTypedText] = useState("");

    const inputFile = useRef(null)

    const [chatTextareaRows, setChatTextareaRows] = useState({
        rows: 1,
        minRows: 1,
        maxRows: 2,
    });
    const [textAreaIsEmpty, setTextareaIsEmpty] = useState(true);

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

    const [messages, setMessages] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalBodyText, setModalBodyText] = useState("");



    const chatScrollRef = useRef();
    const [scrollToBottomShow, setScrollToBottom, scrollToBottomRef] = useStateRef(false);

    const scrollToBottomDebounce = useRef();

    const [isRecording, startRecording, stopRecording, cancelRecording, audioData] = useRecorder();

    const [showSendImageModal, setShowSendImageModal] = useState(false);


    const [messageType, setMessageType] = useState('TEXT_MESSAGE');
    const messageTypeRef = useRef('TEXT_MESSAGE');

    const scrollRef = useRef();
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        setScrollToBottom(false);
        console.log('------------------');
        console.log(messages)
        console.log('------------------');
    }, [messages, messagesIsReady]);

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

            });
            socket.on("connect_error", (err) => {
                console.log('connect_error due to' + err.message);
                socket.removeAllListeners()
                socket.disconnect();
            });

            socket.on("getMessage", (newMessage) => {

                //TODO: add message to the redux state
                selectedChatRef.current?.users.some(user => user._id === newMessage.sender) && setMessages(prev => [...prev, newMessage]);

                selectedChatRef.current?.users.some(user => user._id === newMessage.sender) && dispatch({
                    type: ADD_MESSAGE_FROM_SOCKET,
                    payload: {
                        newMessage,
                    }
                }
                );

                !(selectedChatRef.current?.users.some(user => user._id === newMessage.sender))
                    && dispatch({
                        type: ADD_NEW_MESSAGE_NOTIF,
                        payload: {
                            //data.sender is id of sender
                            user: newMessage.sender
                        }
                    });
            });

            socket.on('isTyping', (data) => {
                // window.alert('add user');
                dispatch({
                    type: ADD_TYPING_USER,
                    payload: {
                        user: data.typingUser
                    }
                })
            });

            socket.on('stopTyping', (data) => {
                // window.alert('remove user');
                dispatch({
                    type: REMOVE_TYPING_USER,
                    payload: {
                        user: data.typingUser
                    }
                })
            });
        }

    }, [ownUserIsReady])

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
        const messageType = messageTypeRef.current;

        if (messageType !== 'TEXT_MESSAGE' && messageType !== 'AUDIO_MESSAGE' && messageType !== 'IMAGE_MESSAGE') {
            return;
        }
        if (messageType === 'TEXT_MESSAGE' && typedText.trim().length === 0) {
            return;
        }

        const sender = ownUser?._id;
        const chat = selectedChat?._id;
        const messageId = uuidv4();
        const text = typedText.trim();
        let data = null;

        const newMsg = {
            text,
            //client id is unique id to recongnize the message when message is sent
            sender, chat,
            //pending means message is not sent yet!
            pending: true
        }

        if (repliedMessage) {
            newMsg.repliedMessage = repliedMessage._id;
        }

        if (messageType === 'TEXT_MESSAGE') {
            newMsg.kind = 'TEXT_MESSAGE';

        } else if (messageType === 'AUDIO_MESSAGE') {
            newMsg.kind = 'AUDIO_MESSAGE';
            data = audioData;

        } else if (messageType === 'IMAGE_MESSAGE') {
            newMsg.kind = 'IMAGE_MESSAGE';
            data = selectedImage;
            setSelectedImage(null);
            setShowSendImageModal(false);
        }


        dispatch(sendMessage({
            tempId: messageId,
            data,
            ...newMsg
        })).then((data) => {

            const receiver = selectedChatRef.current?.users[0]._id === ownUser?._id ? selectedChatRef.current?.users[1]._id : selectedChatRef.current?.users[0]._id;

            socket.emit("sendMessage", {
                receiver,
                _id: data.messageId,
                createdAt: Date.now(),
                ...newMsg
            });

            console.log('message sent');
        }).catch((err) => {
            console.log(err)
            setModalTitle("Message sending Error");
            setModalBodyText(messagesInfo);
            setShowModal(true);
        });

        messageTypeRef.current = 'TEXT_MESSAGE';
        setTypedText("");

        handleCancelRiply();

        setChatTextareaRows(prev => ({
            ...prev,
            rows: 1,
        }));
    }

    const handleGetMessages = (chat) => {

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


    const deb = useRef();
    const [isTyping, setTyping, isTypingRef] = useStateRef(false);

    useEffect(() => {
        if (ownUserIsReady) {

            deb.current = _.debounce(function () {
                // window.alert('stop clicking...');

                if (isTypingRef.current) {
                    setTyping(false);
                    //TODO 

                    const reciever = selectedChatRef.current?.users[0]._id === ownUser?._id ? selectedChatRef.current?.users[1]._id : selectedChatRef.current?.users[0]._id;

                    if (reciever) {
                        socket.emit('stopTyping', reciever);
                    }
                }
            }, 2000);
        }
    }, [ownUserIsReady])

    const handleTextareaChange = (event) => {

        //means we should send isTyping to specified user from socket
        if (!isTypingRef.current) {
            setTyping(true);
            const reciever = selectedChat?.users[0]._id === ownUser?._id ? selectedChat?.users[1]._id : selectedChat?.users[0]._id;

            if (reciever) {
                socket.emit('isTyping', reciever);
            }
        }
        deb.current();

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
        }));
    }

    useEffect(() => {
        scrollToBottomDebounce.current = _.debounce(function () {

            // window.alert('heh'+scrollToBottomRef.current)

            const scrollHeight = chatScrollRef.current.scrollHeight;
            const scrollTop = chatScrollRef.current.scrollTop;
            // window.alert(scrollHeight + ' ' + scrollTop)
            if (scrollHeight - scrollTop > 800) {
                setScrollToBottom(true);
            } else {
                setScrollToBottom(false);
            }

        }, 150)
    }, [])


    const handleMessagesScroll = (e) => {
        scrollToBottomDebounce.current();
    }

    const handleScrollToBottomBtn = (e) => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        setScrollToBottom(false);
    }

    const handleTextareaKeyPress = (e) => {
        if (e.keyCode === 13 && e.ctrlKey) {
            if (isRecording) {
                stopRecording();
                return;
            }
            handleSendMessage();
        }
    }


    const handleLogout = (e) => {
        dispatch(logout());
        socket.removeAllListeners();
        socket.disconnect();
    }



    useEffect(async () => {

        if (audioData) {

            messageTypeRef.current = 'AUDIO_MESSAGE';
            handleSendMessage();

        }
    }, [audioData])


    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    // const selectedImageRef= useRef();

    const handleFileSelect = (e) => {

        if (e.target.files.length > 0) {

            const selected = e.target.files[0];
            setSelectedImage(selected);

            const imageUrl = window.URL.createObjectURL(selected);
            setSelectedImageUrl(imageUrl);

            inputFile.current.value = '';
            setShowSendImageModal(true);
            return
        }
        setShowSendImageModal(false);

    }


    const [profileInfoShow, setProfileInfoShow] = useState(false);

    const showProfileInfo = () => {

        setProfileInfoShow(true);
    }


    const [chatSectionShow, setChatSectionShow] = useState(true);
    const [contactSectionShow, setContactSectionShow] = useState(true);
    const mobileDispaly = useRef(false);
    useEffect(() => {
        if (window.innerWidth < 450) {
            mobileDispaly.current = true;

            setChatSectionShow(false);
            setContactSectionShow(true);
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth <= 575) {
                mobileDispaly.current = true;

                setChatSectionShow(false);
                setContactSectionShow(true);
            } else {
                mobileDispaly.current = false;

                setChatSectionShow(true);
                setContactSectionShow(true);
            }
        })
        console.log('disss', mobileDispaly.current)
    }, []);



    const [riplySectionShow, setRiplySectionShow] = useState(false);
    const [repliedMessage, setRepliedMessage] = useState(null);

    const handleCancelRiply = () => {
        setRiplySectionShow(false);
        setRepliedMessage(null);
    }

    const replyToMessage = (message) => {

        setRepliedMessage(message);

        setRiplySectionShow(true);
        //TODO: nulify replied message after sending message
    }


    return (
        <>
            <Container
                style={{
                    maxHeight: '100vh',
                    // width: (!mobileDispaly ? '60vw' : '')
                }}
                className="chatPageStyles"
            >

                <Row>

                    {contactSectionShow &&

                        <Col
                            lg={3}
                            sm={4}
                            className="shadow-lg rounded">
                            <Container
                                className='p-0'
                                style={{ height: '99.9vh' }}
                            >
                                <Row
                                    className='p-0 '
                                    style={{ height: '8%' }}
                                >

                                    <Container
                                        className='p-1 mt-2'
                                        style={{ height: '100%' }}
                                    >

                                        <InputGroup className="mb-3">

                                            <Dropdown
                                                className='m-1'
                                            >
                                                <Dropdown.Toggle
                                                    variant='secondary'
                                                    className=' pb-1 pt-1 ps-2 pe-2 my-dropdown-toggle'
                                                >
                                                    ☰
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu  >
                                                    <Dropdown.Item
                                                        style={{ cursor: 'initial' }}
                                                    >
                                                        <Button
                                                            onClick={handleLogout}
                                                            style={{
                                                                width: '100%',
                                                                borderRadius: '6px'
                                                            }}
                                                            variant='danger'
                                                        >
                                                            Logout

                                                        </Button>
                                                    </Dropdown.Item>

                                                    <Dropdown.Item
                                                        style={{ cursor: 'initial' }}
                                                    >
                                                        <Button
                                                            onClick={handleLogout}
                                                            style={{
                                                                width: '100%'
                                                            }}
                                                            variant='danger'
                                                        >
                                                            Logout

                                                        </Button>
                                                    </Dropdown.Item>

                                                </Dropdown.Menu>
                                            </Dropdown>

                                            <FormControl
                                                onChange={(e) => setSearchBarText(e.target.value)}
                                                value={searchBarText}
                                                aria-label="Enter the username!"
                                                className="pt-0 pb-0 outline-none"
                                                placeholder="Search!"
                                                style={{
                                                    resize: 'none',
                                                    borderRadius: '10px',
                                                    height: '40px'
                                                }}

                                            />
                                        </InputGroup>
                                    </Container>

                                </Row>
                                <Row
                                    className='p-0'
                                    style={{ height: '92%' }}
                                // className='border border-info'
                                >

                                    <Container
                                        className='pt-3'
                                        style={{
                                            maxHeight: '100%', overflowY: 'auto'
                                        }}
                                    >

                                        {ownUserIsReady && chatsIsReady && !searchedUsersIsReady ?
                                            chats?.filter(chat => chat.users[0]._id === ownUser._id ? (chat.users[1].username.includes(fliteredUsersText)) : ((chat.users[0].username.includes(fliteredUsersText))))
                                                .map((chat) =>
                                                    <div key={chat._id}
                                                        onClick={() => {
                                                            handleGetMessages(chat);
                                                            if (mobileDispaly.current) {
                                                                setContactSectionShow(false);
                                                                setChatSectionShow(true);
                                                            }
                                                        }}
                                                        className="mb-1"
                                                    >
                                                        <ProfileInfo
                                                            chat={chat}
                                                            user={chat.users[0]._id === ownUser._id ? chat.users[1] : chat.users[0]}
                                                        />
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
                                    </Container>
                                </Row>
                            </Container>

                        </Col>
                    }
                    {chatSectionShow &&

                        <Col lg={profileInfoShow ? 7 : 8} sm={8}
                        >

                            <Row
                                style={{ height: '99.9vh' }}
                                className='p-0 shit'
                            >

                                {/* {selectedChat && messagesIsReady && */}
                                {/* Add some extra condition to load messages and profile info in the same time */}
                                <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={ownUserIsReady && chatsIsReady && selectedChat && messagesIsReady}>
                                    {ownUserIsReady && chatsIsReady && selectedChat && messagesIsReady &&

                                        <div
                                            className={"chatSection " + (selectedChat && messagesIsReady && "shadow-lg rounded")}
                                            style={{ height: '99%' }}
                                        >

                                            <div
                                                className="rounded mt-1 border d-flex"
                                                style={{
                                                    width: '100%',
                                                    /* height: 100px; */
                                                    // marginLeft: '25px'
                                                    margin: 'auto',
                                                    // height: '8vh'
                                                    height: '77px'
                                                }}
                                            >

                                                {ownUserIsReady && chatsIsReady && selectedChat &&
                                                    <>
                                                        {mobileDispaly.current &&
                                                            <Button
                                                                className=' border-0 back-button'
                                                                style={{ borderRadius: '0' }}
                                                                onClick={() => {
                                                                    setChatSectionShow(false);
                                                                    setContactSectionShow(true)
                                                                }}
                                                            >
                                                                <ArrowLeft color="black" size={30} />
                                                            </Button>
                                                        }
                                                        <div
                                                            //TODO
                                                            className='bg-white'
                                                            onClick={() => showProfileInfo()}
                                                            style={{ width: '100%' }}
                                                        >

                                                            <ProfileInfo
                                                                chat={selectedChatRef.current}
                                                                user={selectedChatRef.current.users[0]._id === ownUser._id ? selectedChatRef.current.users[1] : selectedChatRef.current.users[0]}

                                                            />
                                                        </div>
                                                    </>
                                                }

                                            </div>

                                            <div className="position-relative">

                                                <div className="position-absolute fixed-bottom">
                                                    <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={scrollToBottomShow}>

                                                        {scrollToBottomShow
                                                            && <Button className="mb-3 bg-transparent shadow-none border-0 outline-0 scrollIconBtn" onClick={handleScrollToBottomBtn}>
                                                                {/* scroll to bottom */}

                                                                <img src={scrollDownIcon} className="scrollIconBtn" />

                                                            </Button>
                                                        }
                                                    </Animated>
                                                </div>
                                                <div className="messageSection"
                                                    style={{
                                                        maxHeight: 'calc(91vh - 5.5rem)'
                                                    }}

                                                    ref={chatScrollRef} onScroll={handleMessagesScroll}
                                                >
                                                    {/* <div className="messageSection" onScroll={handleMessageScroll}> */}
                                                    {messages?.map((msg, i, messages) => {
                                                        let nextIsMe = false;
                                                        let nextIsUser = false;
                                                        let sameDay = false;
                                                        if (i < messages.length - 1) {
                                                            nextIsMe = messages[i + 1].sender === ownUser?._id;
                                                            nextIsUser = !nextIsMe;
                                                        }

                                                        if (i > 0) {
                                                            //check that current message and next message is in the same day or not
                                                            const createdAt = new Date(msg.createdAt);
                                                            const createdAt2 = new Date(messages[i - 1].createdAt);
                                                            {/* createdAt.getFullYear() === createdAt2.getFullYear() &&
                                                        createdAt.getMonth() === createdAt2.getMonth() &&
                                                        createdAt.getDate() === createdAt2.getDate() */}
                                                            if (
                                                                createdAt.getHours() === createdAt2.getHours()
                                                            ) {
                                                                sameDay = true;
                                                            }
                                                        }

                                                        return <div ref={scrollRef} key={msg._id || msg.tempId}>
                                                            {/* nextIsMe shows that next message belongs to ownUser or not */}
                                                            <>
                                                                {!sameDay && msg.createdAt &&
                                                                    <div className='d-flex justify-content-center mb-2'>
                                                                        <span
                                                                            className=' shadow-sm p-1 user-select-none'
                                                                            style={{ borderRadius: '10px' }}
                                                                        >
                                                                            {dateFormat(new Date(msg.createdAt || ''), "dddd, mmmm dS, yyyy")}
                                                                        </span>
                                                                    </div>
                                                                }
                                                                <Message
                                                                    nextIsMe={nextIsMe}
                                                                    nextIsUser={nextIsUser}
                                                                    me={ownUser?._id === msg.sender}
                                                                    msg={msg}
                                                                    reply={replyToMessage}
                                                                />
                                                            </>
                                                        </div>
                                                    })}


                                                </div>
                                            </div>

                                            {/* send section */}
                                            <div
                                                className=" bg-transparent"
                                                style={{
                                                    position: 'absolute',
                                                    width: '90%',
                                                    /* height: 100px; */
                                                    bottom: '10px',
                                                    marginLeft: '25px'
                                                }}
                                            >

                                                <InputGroup
                                                    className='d-flex'
                                                >
                                                    {/* <Picker style={{ position: 'absolute', bottom: '10px', left: '10px' }} set='apple' onSelect={(e) => setTypedText(prevtext => (prevtext + e.native))} title='Pick your emoji…' emoji='point_up' emojiTooltip={true} /> */}

                                                    <div
                                                        className='align-self-end'
                                                        style={{ width: 'calc(100% - 125px)' }}
                                                    >

                                                        <Toast
                                                            className='bg-white'
                                                            style={{
                                                                width: '100%',
                                                                borderRadius: '10px'
                                                            }}
                                                            onClick={() => console.log('toast clicked')}
                                                            show={riplySectionShow}
                                                        >
                                                            <div className='d-flex'>

                                                                <div
                                                                    className='align-self-center ms-2'
                                                                    style={{ width: '100%' }}
                                                                >




                                                                    <Card.Body
                                                                        className='ms-2 mt-1 mb-2 ps-2 pt-2 pb-2 d-flex'
                                                                        style={{
                                                                            cursor: 'pointer',
                                                                            borderLeft: '2px solid black'
                                                                        }}
                                                                    >
                                                                        {repliedMessage?.kind === 'IMAGE_MESSAGE' &&
                                                                            <Image
                                                                                src={repliedMessage?.url || `${URL}/message/getMedia/${repliedMessage?.chat}/${repliedMessage?._id}`}
                                                                                className='me-1'
                                                                                style={{ width: '2.5rem', height: '2.5rem' }}
                                                                            />
                                                                        }

                                                                        <Card.Text
                                                                            className='align-self-center'
                                                                            style={{}}
                                                                        >
                                                                            {repliedMessage?.text.substring(0, 20) + ' ...'}
                                                                        </Card.Text>
                                                                    </Card.Body>


                                                                    {/* {repliedMessage?.text.substring(0, 20)} */}
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    className="close ml-auto me-2 mt-1 mb-1"
                                                                    aria-label="Close"
                                                                    style={{ width: '2rem', height: 'auto' }}
                                                                    onClick={() => handleCancelRiply()}
                                                                >
                                                                    <span aria-hidden="true">&times;</span>
                                                                </button>
                                                            </div>
                                                        </Toast>


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
                                                    </div>



                                                    {!isRecording &&
                                                        <>
                                                            <input
                                                                type='file'
                                                                id='file'
                                                                ref={inputFile}
                                                                style={{ display: 'none' }}
                                                                onChange={handleFileSelect}
                                                                accept='image/*'
                                                            />
                                                            <Button
                                                                onClick={() => inputFile.current.click()}
                                                                className='bg-transparent border-0 ms-2 align-self-end'
                                                                style={{ width: '3rem', height: '3rem' }}
                                                            >
                                                                <FileAttachIcon />
                                                            </Button>
                                                            <Modal
                                                                aria-labelledby="contained-modal-title-vcenter"
                                                                centered
                                                                // show={true}
                                                                show={showSendImageModal}

                                                            >
                                                                <Modal.Header closeButton>
                                                                    <Modal.Title id="contained-modal-title-vcenter">
                                                                        Send Image
                                                                    </Modal.Title>
                                                                </Modal.Header>
                                                                <Modal.Body >
                                                                    <Container
                                                                        fluid
                                                                        className='d-flex justify-content-center'
                                                                    >
                                                                        <Row style={{ maxWidth: '20rem', maxHeight: '20rem' }}>
                                                                            {/* <Image ref={selectedImageRef} fluid /> */}
                                                                            <Image src={selectedImageUrl} fluid />

                                                                        </Row>
                                                                    </Container>
                                                                    <div className='chatPageStyles me-3 ms-3 mt-3'>
                                                                        <Row>
                                                                            <InputGroup>
                                                                                <FormControl as="textarea"
                                                                                    className="textarea"
                                                                                    onChange={handleTextareaChange}
                                                                                    onKeyDown={handleTextareaKeyPress}
                                                                                    // onChange={(e) => setTypedText(e.target.value)}
                                                                                    value={typedText}
                                                                                    placeholder="Add caption"
                                                                                    rows={chatTextareaRows.rows}
                                                                                // styles={{ marginRight: "10px" }}
                                                                                />
                                                                                <div className='d-flex ms-3 mb-0'>
                                                                                    <div
                                                                                        className='send-blob-cont bg-primary'
                                                                                        onClick={() => { messageTypeRef.current = 'IMAGE_MESSAGE'; handleSendMessage() }}>
                                                                                        {/* <SendIcon /> */}
                                                                                        <img className='send-img' src={sendIcon} />
                                                                                    </div>
                                                                                </div>
                                                                            </InputGroup>
                                                                        </Row>
                                                                    </div>
                                                                </Modal.Body>
                                                                <Modal.Footer>
                                                                    <Button onClick={() => setShowSendImageModal(false)}>Close</Button>
                                                                </Modal.Footer>
                                                            </Modal>
                                                        </>
                                                    }


                                                    {typedText.trim().length === 0 || isRecording ?
                                                        <div className='d-flex ms-3 mb-0 align-self-end'>
                                                            {isRecording
                                                                && <div className='d-inline blob-cont me-2 bg-danger' onClick={cancelRecording}>
                                                                    <CancelIcon />
                                                                </div>
                                                            }
                                                            <div className={'d-inline blob-cont ' + (isRecording ? ' blob blue bg-primary' : ' bg-white')} onClick={() => isRecording ? stopRecording() : startRecording()}>

                                                                {/* <Button className='blob red' style={{ width: '3rem', height: '3rem' }} className='rounded-circle' onClick={startRecording} disabled={isRecording} variant='danger'> */}

                                                                {isRecording ?
                                                                    <div>
                                                                        <img className='send-img' src={sendIcon} />
                                                                    </div>
                                                                    :
                                                                    <MicIcon />
                                                                }
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className='d-flex ms-3 mb-0 align-self-end'>
                                                            <div className='send-blob-cont bg-primary' onClick={handleSendMessage}>
                                                                {/* <SendIcon /> */}
                                                                <img className='send-img' src={sendIcon} />
                                                            </div>
                                                        </div>

                                                    }
                                                    {/* <Button onClick={handleSendMessage} className="shadow-none sendMsgBtn rounded ms-3 mb-0 text-white" variant="primary">
                                                    Send!
                                                </Button> */}
                                                </InputGroup>

                                            </div>
                                        </div>
                                    }
                                </Animated>
                            </Row>

                        </Col>
                    }

                    <Col lg={2}>
                        <Animated animationIn="slideInRight" animationOut="slideInLeft" isVisible={ownUserIsReady && chatsIsReady && selectedChat && messagesIsReady && profileInfoShow}>
                            {ownUserIsReady && chatsIsReady && selectedChat && messagesIsReady && profileInfoShow &&
                                <div className="profileSection">
                                    <Button
                                        onClick={() => setProfileInfoShow(false)}
                                    >
                                        cancel
                                    </Button>

                                    <Profile user={ownUser._id === selectedChat.users[0]._id ? selectedChat.users[1] : selectedChat.users[0]} ></Profile>
                                </div>
                            }
                        </Animated>
                    </Col>

                </Row>
            </Container>

            {/* <Modal show={showModal} onHide={() => console.log('message modal hided!')} animation={false}>
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
            </Modal> */}
        </>
    );
};

export default ChatPage;