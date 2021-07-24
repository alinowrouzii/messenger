import React from 'react';
import { Card } from 'react-bootstrap';
import img from './../../../Images/no-profile.jpg';

import { format } from "timeago.js";
import './styles.css';


const Message = ({ me, msg }) => {

    return (
        <>
            {me ?
                <div>
                    <div className="d-flex align-items-center mb-3">
                        <div className="flex-grow-1 ms-1">
                            <Card
                                className="mb-2 shadow-lg p-3"
                                style={{ maxWidth: '18rem', float: 'right', marginRight: '20px', backgroundColor: "cyan" }}>
                                <Card.Body>
                                    <Card.Text>
                                        {msg.text}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Body>
                                    <Card.Text> {format(msg.createdAt)}</Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="flex-shrink-0">
                            <img src={img} className="rounded-circle prof-img" alt="img" />
                        </div>
                    </div>

                </div>
                :
                <div className="d-flex align-items-center mb-3">
                    <div className="flex-shrink-0">
                        <img src={img} className="rounded-circle prof-img" alt="img" />
                    </div>
                    <div className="flex-grow-1 ms-1">
                        <Card
                            className="mb-2 shadow-lg p-3 bg-green"
                            style={{ float: "left", maxWidth: '18rem', backgroundColor:"#f590f5" }}>
                            <Card.Body>
                                <Card.Text>
                                    {msg.text}
                                </Card.Text>
                            </Card.Body>
                            <Card.Body>
                                <Card.Text>{format(msg.createdAt)}</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            }
        </>

    );
};

export default Message;