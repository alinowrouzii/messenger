import React from 'react';
import './styles.css'
import { Card, Image } from 'react-bootstrap';
import { format } from 'timeago.js';
import img from './../../../Images/no-profile.jpg'
const Profile = (props) => {
    return (
        <Card
            style={{ width: 'auto', padding: "20px", backgroundColor: "cyan", marginTop: "20px" }}
            className="shadow-lg"
        >
            <Card.Img as={Image} variant="top" src={img} roundedCircle />
            <Card.Body>
                <Card.Title style={{ textAlign: "center" }}>
                    {props.user.name}
                </Card.Title>
                <Card.Text style={{ textAlign: "left" }}>
                    <strong>
                        Username:
                    </strong> @{props.user.username}
                </Card.Text>
                <Card.Text style={{ textAlign: "left" }}>
                    <strong>
                        Joined at:
                    </strong> {format(props.user.createdAt)}
                </Card.Text>
            </Card.Body>
            <Card.Body>
                <Card.Title style={{ textAlign: "center" }}>
                    About:
                </Card.Title>
                <Card.Text style={{ textAlign: "left" }}>
                    I'm ali nowrouzi
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default Profile;