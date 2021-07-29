import React from 'react';
import { Card } from 'react-bootstrap';
import img from './../../../Images/no-profile.jpg';

import { format } from "timeago.js";
import './styles.css';


const Message = ({ me, msg }) => {

    return (
        <>
            {me ?
                <div className="d-flex align-items-center mb-2">
                    <div className="flex-grow-1 ms-1">
                        <Card
                            className="shadow-lg me-3 text-white" 
                            style={{ maxWidth: '18rem', float: 'right', backgroundColor: "#3581eb" }}>
                            <Card.Body
                            className='ps-2 pt-1'
                            >
                                <Card.Text
                                
                                >
                                    {msg.text}
                                </Card.Text>
                            </Card.Body>
                            <Card.Body className="pb-1 pe-2 pt-0" >
                                    <Card.Text
                                        styles={{ fontSize: '15px' }}
                                        className='float-end user-select-none'
                                    >
                                        {format(msg.createdAt)}
                                    </Card.Text>
                                  
                                </Card.Body>
                        </Card>
                    </div>
                    <div className="flex-shrink-0">
                        <img src={img} className="rounded-circle prof-img border" alt="img" />
                    </div>
                </div>

                :
                    <div className="d-flex align-items-center mb-2">
                        <div className="flex-shrink-0 ms-2">
                            <img src={img} className="rounded-circle prof-img border" alt="img" />
                        </div>
                        <div className="flex-grow-1 ms-1">
                            <Card
                                className="shadow-lg bg-green"
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