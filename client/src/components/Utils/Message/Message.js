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

const Message = ({ me, msg, nextIsMe, nextIsUser }) => {

    const text_message_type = 'TEXT_MESSAGE'
    const audio_message_type = 'AUDIO_MESSAGE'

    const msg_type = msg.kind

    useEffect(() => {
        if (msg.kind === 'IMAGE_MESSAGE') {
            console.log(`${URL}/message/getMedia/${msg.chat}/${msg._id}`)
        }
    });

    const [imageModalShow, setImageModalShow] = useState(false);


    // const handleDownloadImage = () => {
    //     const url =  `${URL}/message/getMedia/${msg.chat}/${msg._id}`
    //     const fileName = 'imagee'
    //     request.head(url, function (err, res, body) {
    //         console.log('content-type:', res.headers['content-type']);
    //         console.log('content-length:', res.headers['content-length']);

    //         request(url).pipe(fs.createWriteStream(fileName)).on('close', ()=>{
    //             console.log('downloaded!')
    //         });
    //     });
    // }

    const [imageIsLoaded, setImageIsLoaded] = useState(false);

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
                                            <Spinner as='span' animation="border" variant="warning" style={{ width: '1rem', height: '1rem' }} />
                                            :
                                            dateFormat(new Date(msg.createdAt || ''), "h:MM TT")
                                        }
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                            :
                            <Card
                                className="shadow-lg me-3 text-white my-card-cont"
                                style={{ maxWidth: '18rem', float: 'right', backgroundColor: "#3581eb" }}>
                                <Card.Body
                                    className='p-0 d-flex justify-content-center mb-0'
                                >
                                    {msg_type === audio_message_type ?
                                        <audio className='my-audio mb-0 pb-0' src={msg.url || `${URL}/message/getMedia/${msg.chat}/${msg._id}`} controls controlsList="nodownload" />
                                        :
                                        <>
                                            {/* {!imageIsLoaded &&
                                                <div
                                                    style={{
                                                        background: 'blue',
                                                        minWidth: '15rem',
                                                        minHeight: '15rem',
                                                        maxWidth: '100%', height: 'auto',
                                                        cursor: 'pointer',
                                                        borderTopLeftRadius: '10px',
                                                        borderTopRightRadius: '10px'
                                                    }}
                                                />
                                            } */}
                                            <Image
                                                className='mb-0 pb-0 '
                                                // className={'mb-0 pb-0 ' + (!imageIsLoaded && ' d-none')}
                                                // className='rounded'
                                                src={msg.url || `${URL}/message/getMedia/${msg.chat}/${msg._id}`}
                                                style={{
                                                    minWidth: '15rem',
                                                    minHeight: '15rem',
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

                                {msg.text.trim().length > 0 &&
                                    <Card.Body
                                        className="pt-1 ps-2 pb-0"
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
                                            <Spinner as='span' animation="border" variant="warning" style={{ width: '1rem', height: '1rem' }} />
                                            :
                                            dateFormat(new Date(msg.createdAt || ''), "h:MM TT")
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
                                        {dateFormat(new Date(msg.createdAt || ''), "h:MM TT")}
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                            :
                            <Card
                                className="shadow-lg user-card-cont"
                                style={{ float: "left", maxWidth: '18rem', backgroundColor: "#c5c5c3" }}>
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
                                                    minWidth: '15rem',
                                                    minHeight: '15rem',
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

                                {msg.text.trim().length > 0 &&
                                    <Card.Body
                                        className="pt-1 ps-2 pb-0"
                                    >
                                        {msg.text}
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
                        )}
                    </div>

                </div>
            }
        </>

    );
};

export default Message;