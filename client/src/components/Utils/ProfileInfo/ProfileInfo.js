import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import img from "./../../../Images/no-profile.jpg";
import './styles.css'
const ProfileInfo = (props) => {

    const ownUser = useSelector(state => state.userData.ownUser);
    const ownUserIsReady = useSelector(state => state.userData.ownUserIsReady);

    const chat = props.chat;

    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        setUserInfo(
            (ownUser?._id === chat.users[0]._id) ? chat.users[1] : chat.users[0]
        )
    }, [ownUserIsReady]);
    
    return (
        <div className="d-flex align-items-center main-cont rounded shadow-lg border-bottom border-2">
            <div className="flex-shrink-0 img-cont">
                <img src={img} className="rounded-circle prof-img" alt="img" />
            </div>
            <div className="flex-grow-1 ms-3">
                {ownUserIsReady ? userInfo?.name : "loading"}<br />
                <p>
                    online
                </p>
            </div>
        </div>

    );
};

export default ProfileInfo;