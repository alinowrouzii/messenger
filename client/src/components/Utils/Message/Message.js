import React from 'react';
import { Card, Spinner } from 'react-bootstrap';
import img from './../../../Images/no-profile.jpg';

import { format } from "timeago.js";
import './styles.css';
import { useEffect, useState } from 'react';
import { URL } from '../../../constants';
const Message = ({ me, msg, nextIsMe, nextIsUser }) => {

    const text_message_type = 'TEXT_MESSAGE'
    const audio_message_type = 'AUDIO_MESSAGE'

    const msg_type = msg.kind

    return (
        <>
            {me ?
                <div className={"d-flex " + (nextIsMe ? " mb-1" : " mb-2")}>
                    <div className={"flex-grow-1 ms-1 " + (nextIsMe && ' my-msg-card-cont')}>
                        {(msg_type === text_message_type ?
                            <Card
                                className="shadow-lg me-3 text-white my-card-cont"
                                style={{ maxWidth: '18rem', float: 'right', backgroundColor: "#3581eb" }}>
                                <Card.Body
                                    className='ps-2 pt-1'
                                >
                                    <Card.Text>
                                        {msg.text}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Body className="pb-1 pe-2 pt-0" >
                                    <Card.Text
                                        styles={{ fontSize: '15px' }}
                                        className='float-end user-select-none text-white-50'
                                    >
                                        {msg.pending ?
                                            <Spinner animation="border" variant="warning" style={{ width: '1rem', height: '1rem' }} />
                                            :
                                            format(msg.createdAt)
                                        }
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                            :
                            <Card
                                className="shadow-lg me-3 text-white my-card-cont"
                                style={{ maxWidth: '18rem', float: 'right', backgroundColor: "#3581eb" }}>
                                <Card.Body
                                    className='ps-2 pt-1'
                                >
                                    <audio className='my-audio mb-0' src={msg.url || `${URL}/message/getAudio/${msg.chat}/${msg._id}`} controls controlsList="nodownload" />

                                </Card.Body>
                                
                                {msg.text.trim().length > 0 &&
                                    <Card.Body
                                        className="pt-1 ps-2"
                                    >
                                        {msg.text}
                                    </Card.Body>
                                }

                                <Card.Body className="pb-1 pe-2 pt-0 mt-0" >
                                    <Card.Text
                                        styles={{ fontSize: '15px' }}
                                        className='float-end user-select-none text-white-50'
                                    >

                                        {msg.pending ?
                                            <Spinner animation="border" variant="warning" style={{ width: '1rem', height: '1rem' }} />
                                            :
                                            format(msg.createdAt)
                                        }
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        )}
                    </div>
                    {!nextIsMe && <div className="flex-shrink-0 mb-1 align-self-end">
                        <img src={img} className="rounded-circle prof-img border" alt="img" />
                    </div>}
                </div>

                :

                <div className={"d-flex " + (nextIsUser ? " mb-1" : " mb-2")} >
                    {!nextIsUser && <div className="flex-shrink-0 ms-2 align-self-end mb-1 ">
                        <img src={img} className="rounded-circle prof-img border" alt="img" />
                    </div>}
                    <div className={"flex-grow-1 " + (nextIsUser ? ' user-msg-card-cont' : ' ms-0')}>
                        {(msg_type === text_message_type ?
                            <Card
                                className="shadow-lg user-card-cont"
                                style={{ float: "left", maxWidth: '18rem', backgroundColor: "#c5c5c3" }}>
                                <Card.Body
                                    className="pt-1 ps-2"
                                >
                                    <Card.Text>
                                        {msg.text}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Body className="pb-1 pe-2 pt-0" >
                                    <Card.Text
                                        className='float-end text-muted user-select-none'
                                    >
                                        {format(msg.createdAt)}
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                            :
                            <Card
                                className="shadow-lg user-card-cont"
                                style={{ float: "left", maxWidth: '18rem', backgroundColor: "#c5c5c3" }}>
                                <Card.Body
                                    className="pt-1 ps-2"
                                >
                                    <audio className='user-audio' src={`${URL}/message/getAudio/${msg.chat}/${msg._id}`} controls controlsList="nodownload" />

                                </Card.Body>

                                {msg.text.trim().length > 0 &&
                                    <Card.Body
                                        className="pt-1 ps-2"
                                    >
                                        {msg.text}
                                    </Card.Body>
                                }
                                <Card.Body className="pb-1 pe-2 pt-0" >
                                    <Card.Text
                                        className='float-end text-muted user-select-none'
                                    >
                                        {format(msg.createdAt)}
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        )}
                    </div>

                </div>
            }
        </>

    );
};

export default Message;