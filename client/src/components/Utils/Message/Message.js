import React from 'react';
import { Card, Image, Spinner, Modal, Button } from 'react-bootstrap';
import img from './../../../Images/no-profile.jpg';

import { format } from "timeago.js";
import './styles.css';
import { useEffect, useState } from 'react';
import { URL } from '../../../constants';
import fs from 'fs';
import request from 'request';
import dateFormat from "dateformat";
import { useSelector } from 'react-redux';

const Message = ({ me, msg, nextIsMe, nextIsUser, reply }) => {

    const text_message_type = 'TEXT_MESSAGE'
    const audio_message_type = 'AUDIO_MESSAGE'
    const image_message_type = 'IMAGE_MESSAGE'

    const msg_type = msg.kind

    const messages = useSelector(state => state.messageData.messages);

    useEffect(() => {
        if (msg.kind === 'IMAGE_MESSAGE') {
            console.log(`${URL}/message/getMedia/${msg.chat}/${msg._id}`)
        }
    });

    const [imageModalShow, setImageModalShow] = useState(false);

    const [imageIsLoaded, setImageIsLoaded] = useState(false);


    const [isMobile, setMobile] = useState(false);

    const [messageMaxWidth, setMessageMaxWidth] = useState('18rem')
    useEffect(() => {
        if (window.innerWidth < 450) {
            setMobile(true);
            setMessageMaxWidth('14rem');
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth < 450) {
                setMobile(true);
                setMessageMaxWidth('14rem');
            } else {
                setMobile(false);
                setMessageMaxWidth('18rem');
            }
        })
    }, []);
    return (
        <>
            {me ?
                <div className={"d-flex " + (nextIsMe ? " mb-1" : " mb-2")}>
                    <div className="flex-grow-1 ms-1 ">
                        <Card
                            className="shadow-lg me-3 text-white my-card-cont"
                            style={{
                                maxWidth: messageMaxWidth || '14rem',
                                float: 'right',
                                backgroundColor: "#3581eb"
                            }}>

                            {/* TODO: conditionally render reply section if message has reply */}
                            {/* Like: msg.reply */}

                            {msg.repliedMessage &&
                                <Card.Body
                                    className='ms-2 mt-1 ps-2 pt-2 pb-2 d-flex'
                                    style={{
                                        cursor: 'pointer',
                                        borderLeft: '2px solid white'
                                    }}
                                >
                                    {messages.find(m => m._id === msg.repliedMessage)?.kind === image_message_type &&
                                        <Image
                                            src={messages.find(m => m._id === msg.repliedMessage)?.url || `${URL}/message/getMedia/${msg.chat}/${messages.find(m => m._id === msg.repliedMessage)?._id}`}
                                            className='me-2'
                                            style={{ width: '2.5rem', height: '2.5rem' }}
                                        />
                                    }

                                    <Card.Text
                                        className='align-self-center'
                                        style={{}}
                                    >
                                        {messages.find(m => m._id === msg.repliedMessage)?.text.substring(0, 20) + ' ...'}
                                    </Card.Text>
                                </Card.Body>
                            }

                            {!msg.pending
                                && <Card.Body
                                    className='p-0 m-0 mt-0 ms-2 mb-1'
                                >
                                    <Card.Text
                                        className='d-inline text-white-50'
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => reply(msg)}
                                    >
                                        reply
                                    </Card.Text>
                                </Card.Body>
                            }


                            {/* Implement voice and audio */}

                            {(msg_type === audio_message_type || msg_type === image_message_type) &&
                                <Card.Body
                                    className='p-0 d-flex justify-content-center mb-0'
                                >
                                    {msg_type === audio_message_type ?
                                        <audio className='my-audio mb-0 pb-0' src={msg.url || `${URL}/message/getMedia/${msg.chat}/${msg._id}`} controls controlsList="nodownload" />
                                        :
                                        <>
                                            <Image
                                                className='mb-0 pb-0 '
                                                // className={'mb-0 pb-0 ' + (!imageIsLoaded && ' d-none')}
                                                // className='rounded'
                                                src={msg.url || `${URL}/message/getMedia/${msg.chat}/${msg._id}`}
                                                style={{
                                                    minWidth: isMobile ? '14rem' : '15rem',
                                                    minHeight: isMobile ? '14rem' : '15rem',
                                                    maxWidth: '100%', height: 'auto',
                                                    cursor: 'pointer',
                                                    borderTopLeftRadius: '10px',
                                                    borderTopRightRadius: '10px'
                                                }}
                                                onClick={() => setImageModalShow(true)}
                                                onLoad={() => setImageIsLoaded(true)}
                                            />

                                            <Modal
                                                show={imageModalShow}
                                                aria-labelledby="contained-modal-title-vcenter"
                                                centered
                                                size='lg'
                                            >
                                                <Modal.Body className='d-flex justify-content-center'>
                                                    <Image
                                                        className='rounded border border-secondary'
                                                        src={msg.url || `${URL}/message/getMedia/${msg.chat}/${msg._id}`}
                                                        style={{ maxWidth: '100%', height: 'auto' }}
                                                        onClick={() => setImageModalShow(true)}
                                                    />
                                                </Modal.Body>

                                                <Modal.Footer>
                                                    <Button onClick={() => setImageModalShow(false)}>Close</Button>
                                                </Modal.Footer>

                                            </Modal>
                                        </>
                                    }
                                </Card.Body>

                            }

                            {/* Implement voice and audio */}


                            {msg.text.trim().length > 0 &&

                                <Card.Body
                                    className='ps-2 pt-1 mb-0'
                                >
                                    <Card.Text>
                                        {msg.text}
                                    </Card.Text>
                                </Card.Body>
                            }
                            <Card.Body className="pb-1 pe-2 pt-0" >
                                <Card.Text
                                    styles={{ fontSize: '15px' }}
                                    className='float-end user-select-none text-white-50'
                                >
                                    {msg.pending ?
                                        <Spinner as='span' animation="border" variant="warning" style={{ width: '1rem', height: '1rem' }} />
                                        :
                                        dateFormat(new Date(msg.createdAt || ''), "h:MM TT")
                                    }
                                </Card.Text>

                            </Card.Body>
                        </Card>

                    </div>
                    {/* {!nextIsMe && <div className="flex-shrink-0 mb-1 align-self-end">
                        <img src={img} className="rounded-circle prof-img border" alt="img" />
                    </div>} */}
                </div>

                :

                <div className={"d-flex " + (nextIsUser ? " mb-1" : " mb-2")} >
                    {/* {!nextIsUser && <div className="flex-shrink-0 ms-2 align-self-end mb-1 ">
                        <img src={img} className="rounded-circle prof-img border" alt="img" />
                    </div>} */}
                    <div className='flex-grow-1  ms-2'>
                        <Card
                            className="shadow-lg user-card-cont"
                            style={{ float: "left", maxWidth: messageMaxWidth || '14rem', backgroundColor: "#c5c5c3" }}>


                            {/* TODO: conditionally render reply section if message has reply */}
                            {/* Like: msg.reply */}

                            {msg.repliedMessage &&
                                <Card.Body
                                    className='ms-2 mt-1 ps-2 pt-2 pb-2 d-flex'
                                    style={{
                                        cursor: 'pointer',
                                        borderLeft: '2px solid black'
                                    }}
                                >

                                    {messages.find(m => m._id === msg.repliedMessage)?.kind === image_message_type &&
                                        <Image
                                            src={messages.find(m => m._id === msg.repliedMessage)?.url || `${URL}/message/getMedia/${msg.chat}/${messages.find(m => m._id === msg.repliedMessage)?._id}`}
                                            className='me-2'
                                            style={{ width: '2.5rem', height: '2.5rem' }}
                                        />
                                    }

                                    <Card.Text
                                        className='align-self-center'
                                        style={{}}
                                    >
                                        {/* some text with substring with some length */}
                                        {messages.find(m => m._id === msg.repliedMessage)?.text.substring(0, 20) + ' ...'}
                                    </Card.Text>
                                </Card.Body>
                            }

                            <Card.Body
                                className='p-0 m-0 mt-0 ms-2 mb-1'
                            >
                                <Card.Text
                                    className='d-inline text-dark'
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => reply(msg)}
                                >
                                    reply
                                </Card.Text>
                            </Card.Body>



                            {(msg_type === audio_message_type || msg_type === image_message_type) &&

                                <Card.Body
                                    className="p-0 d-flex justify-content-center mb-0"
                                >

                                    {msg_type === audio_message_type ?
                                        <audio className='user-audio mb-0 pb-0' src={`${URL}/message/getMedia/${msg.chat}/${msg._id}`} controls controlsList="nodownload" />
                                        :
                                        <>
                                            <Image
                                                className='pb-0 mb-0'
                                                src={msg.url || `${URL}/message/getMedia/${msg.chat}/${msg._id}`}
                                                style={{
                                                    minWidth: isMobile ? '14rem' : '15rem',
                                                    minHeight: isMobile ? '14rem' : '15rem',
                                                    maxWidth: '100%',
                                                    height: 'auto',
                                                    cursor: 'pointer',
                                                    borderTopLeftRadius: '10px',
                                                    borderTopRightRadius: '10px'
                                                }}
                                                onClick={() => setImageModalShow(true)}
                                            />
                                            <Modal
                                                show={imageModalShow}
                                                aria-labelledby="contained-modal-title-vcenter"
                                                centered
                                                size='lg'
                                            >
                                                <Modal.Body className='d-flex justify-content-center'>
                                                    <Image
                                                        className='rounded border border-secondary'
                                                        src={msg.url || `${URL}/message/getMedia/${msg.chat}/${msg._id}`}
                                                        style={{ maxWidth: '100%', height: 'auto' }}
                                                        onClick={() => setImageModalShow(true)}
                                                    />
                                                </Modal.Body>

                                                <Modal.Footer>
                                                    <Button onClick={() => setImageModalShow(false)}>Close</Button>
                                                </Modal.Footer>

                                            </Modal>
                                        </>

                                    }

                                </Card.Body>
                            }

                            {msg.text.trim().length > 0 &&
                                <Card.Body
                                    className="pt-1 ps-2"
                                >

                                    <Card.Text>
                                        {msg.text}
                                    </Card.Text>
                                </Card.Body>
                            }

                            <Card.Body className="pb-1 pe-2 pt-0" >
                                <Card.Text
                                    className='float-end text-muted user-select-none'
                                >
                                    {dateFormat(new Date(msg.createdAt || ''), "h:MM TT")}
                                </Card.Text>

                            </Card.Body>
                        </Card>

                    </div>

                </div>
            }
        </>

    );
};

export default Message;