import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import img from "./../../../Images/no-profile.jpg";
import onlineIcon from "./../../../Images/online-icon.png";
import newMsgIcon from './../../../Images/new-msg-icon.png'
import './styles.css'
import { format } from 'timeago.js';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const ProfileInfo = (props) => {

    // storage.removeItem('persist:root');

    const ownUser = useSelector(state => state.userData.ownUser);
    const ownUserIsReady = useSelector(state => state.userData.ownUserIsReady);

    const onlineUsers = useSelector(state => state.userData.onlineUsers);

    const newMsgNotif = useSelector(state => state.messageData.newMessagesNotification);

    const chat = props.chat;

    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        setUserInfo(
            (ownUser?._id === chat.users[0]._id) ? chat.users[1] : chat.users[0]
        )
    }, [ownUserIsReady]);

    return (
        <div className="d-flex align-items-center main-cont rounded shadow-lg border-bottom border-2">
            <div className="flex-shrink-0 img-cont user-select-none">
                <img src={img} className="rounded-circle prof-img set-img-undragable" alt="img" />

                {onlineUsers?.some(u => u._id === userInfo?._id) &&
                    <img src={onlineIcon} className="online-icon set-img-undragable" alt="img" />}
            </div>
            <div className="flex-grow-1 ms-3">
                {ownUserIsReady ? userInfo?.name : "loading"}<br />
                <p>
                    {/* {onlineUsers?.some(u => u._id === userInfo?._id) && 'online'} */}

                </p>
            </div>
            {newMsgNotif.some(u=> userInfo?._id === u) &&
                <div className="flex-grow-1 ms-3 me-2">
                    <div className="float-end">
                        <img src={newMsgIcon} className="notif-icon set-img-undragable" alt="img" />
                    </div>
                </div>
            }
        </div>
    );
};

export default ProfileInfo;