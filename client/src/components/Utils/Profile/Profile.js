import React from 'react';
import './styles.css'
import { Card, Image } from 'react-bootstrap';
import { format } from 'timeago.js';
import img from './../../../Images/no-profile.jpg'
import { URL } from './../../../constants/index';
const Profile = (props) => {
    
    return (
        <div>
            <div className='justify-content-center d-flex'>
                <Image 
                variant="top"
                 src={`${URL}/user/getProfilePhoto/${props.user._id}`} 
                 roundedCircle
                  className='border mt-3' 
                      style={{width:'15rem', height:'15rem'}}
                  />
            </div>
            <div>

                <Card
                    style={{ width: 'auto', marginTop: "20px" }}
                    className="shadow-lg user-select-none bg-transparent"
                >
                    <Card.Body>
                        <Card.Title className='shadow-lg p-2 mb-2'>
                            <strong>
                                Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </strong>
                            {props.user.name}
                        </Card.Title>
                        <Card.Text
                            className='shadow-lg p-2 mb-2'
                            style={{ textAlign: "left" }}>
                            <strong>
                                Username:
                            </strong> @{props.user.username}
                        </Card.Text>
                        <Card.Text
                            className='shadow-lg p-2 mb-2'
                            style={{ textAlign: "left" }}>
                            <strong>
                                Joined at:&nbsp;&nbsp;
                            </strong> {format(props.user.createdAt)}
                        </Card.Text>
                        <Card.Text
                            className='shadow-lg p-2 mb-2'
                            style={{ textAlign: "left" }}>
                            <strong>
                                About:&nbsp;&nbsp;&nbsp;&nbsp;
                            </strong>
                            I'm ali nowrouzi
                        </Card.Text>

                    </Card.Body>
                    {/* <Card.Body
                        className='shadow-lg p-2'
                    >
                        <Card.Title>
                            <strong>
                                About:&nbsp;&nbsp;&nbsp;&nbsp;
                            </strong>
                            I'm ali nowrouzi
                        </Card.Title>

                    </Card.Body> */}
                </Card>
            </div>
        </div>

    );
};

export default Profile;