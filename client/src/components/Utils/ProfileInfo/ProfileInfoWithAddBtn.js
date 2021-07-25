import React, { useEffect, useState } from 'react';
import { Alert, Button, Modal, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createChat, getChats } from '../../../actions/chat';
import img from "./../../../Images/no-profile.jpg";
import './styles.css'
const ProfileInfo = (props) => {

    const user = props.user;
    const ownUser = useSelector(state => state.userData.ownUser)

    const [added, setAdded] = useState(false);

    const [loading, setLoading] = useState(false);


    const [showModal, setShowModal] = useState(false);

    const chatMessageInfo = useSelector(state => state.chatsData.chatMessage);

    const dispatch = useDispatch();
    const handleAddUser = () => {
        if (!added) {
            setLoading(true);
            dispatch(createChat(user._id))
                .then(() => {
                    setAdded(true);
                    setLoading(false);
                    //to update chatList
                    dispatch(getChats);
                }).catch((err) => {
                    setLoading(false);
                    setShowModal(true);
                    console.log(err);
                });
        }
    }

    return (
        <div className="d-flex align-items-center main-cont rounded bg-info shadow-lg">
            <div className="flex-shrink-0 img-cont">
                <img src={img} className="rounded-circle prof-img" alt="img" />
            </div>
            <div className="flex-grow-1 ms-3">
                name: {user?.name}<br />
                <p>
                    username: @{user?.username}
                </p>
                <Button active={added}
                    disabled={added}
                    onClick={handleAddUser}
                    variant="warning"
                    className="mb-3 shadow-none">
                    {loading ?
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                        :
                        (added ? "Added!" : "Add to your chat+")}
                </Button>

                <Modal show={showModal} onHide={() => console.log('modal hided!')} animation={false}>
                    <Modal.Header>
                        <Modal.Title>Chat Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Alert variant="danger">
                            {chatMessageInfo}
                        </Alert>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>

    );
};

export default ProfileInfo;