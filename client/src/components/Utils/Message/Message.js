import React from 'react';
import { Card } from 'react-bootstrap';
import img from './../../../Images/no-profile.jpg';

import { format } from "timeago.js";
import './styles.css';


const Message = ({ me, msg, nextIsMe, nextIsUser }) => {

    return (
        <>
            {me ?
                <div className={"d-flex " + (nextIsMe ? " mb-1" : " mb-2")}>
                    <div className={"flex-grow-1 ms-1 " + (nextIsMe && ' my-msg-card-cont')}>
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
                                    {format(msg.createdAt)}
                                </Card.Text>

                            </Card.Body>
                        </Card>
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


                    </div>

                </div>
            }
        </>

    );
};

export default Message;