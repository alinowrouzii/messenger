import React from 'react';
import './styles.css'
import { Card, Image } from 'react-bootstrap';
import img from './../../../Images/no-profile.jpg'
const Profile = () => {
    return (
        <Card style={{ width: '18rem', padding: "20px", backgroundColor: "lightcyan", marginTop: "20px" }}>
            <Card.Img as={Image} variant="top" src={img} roundedCircle />
            <Card.Body>
                <Card.Title style={{ textAlign: "center" }}>
                    Walter white
                </Card.Title>
                <Card.Text style={{ textAlign: "left" }}>
                    <strong>
                        Username:
                    </strong> @AliNowrouzi
                </Card.Text>
                <Card.Text style={{ textAlign: "left" }}>
                    <strong>
                        Joined at:
                    </strong> 2 day ago
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