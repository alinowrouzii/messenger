import React from 'react';
import { Card } from 'react-bootstrap';
import img from './../../../Images/no-profile.jpg';
import './styles.css';


const Message = (props) => {


    return (
        <>
            {props.me ?
                <div>
                    <div class="d-flex align-items-center mb-3">
                        <div class="flex-grow-1 ms-1">
                            <Card 
                            className="mb-2 shadow-lg p-3" 
                            style={{ maxWidth: '18rem', float: 'right', marginRight: '20px', backgroundColor:"cyan" }}>
                                <Card.Body>
                                    <Card.Text>
                                        {props.text}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Body>
                                    <Card.Text> 3 min ago</Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                        <div class="flex-shrink-0">
                            <img src={img} class="rounded-circle prof-img" alt="img" />
                        </div>
                    </div>

                </div>
                :
                <div class="d-flex align-items-center mb-3">
                    <div class="flex-shrink-0">
                        <img src={img} class="rounded-circle prof-img" alt="img" />
                    </div>
                    <div class="flex-grow-1 ms-1">
                        <Card className="mb-2 shadow-lg p-3 bg-white" style={{ float: "left", maxWidth: '18rem' }}>
                            <Card.Body>
                                <Card.Text>
                                    {props.text}
                                </Card.Text>
                            </Card.Body>
                            <Card.Body>
                                <Card.Text> 2 min ago</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            }
        </>

    );
};

export default Message;