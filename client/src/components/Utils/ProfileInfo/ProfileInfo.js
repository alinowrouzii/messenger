import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import img from "./../../../Images/no-profile.jpg";
import onlineIcon from "./../../../Images/online-icon.png";
import newMsgIcon from './../../../Images/new-msg-icon.png'
import './styles.css'
import { format } from 'timeago.js';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { URL } from './../../../constants/index';

const ProfileInfo = ({ chat, user }) => {

    // storage.removeItem('persist:root');

    const ownUser = useSelector(state => state.userData.ownUser);
    const ownUserIsReady = useSelector(state => state.userData.ownUserIsReady);

    const onlineUsers = useSelector(state => state.userData.onlineUsers);

    const newMsgNotif = useSelector(state => state.messageData.newMessagesNotification);

    const typingUsers = useSelector(state => state.userData.typingUsers);


    // const [ userInfo, set userInfo] = useState(null);

    // useEffect(() => {
    //     set user(
    //         (ownUser?._id === chat.users[0]._id) ? chat.users[1] : chat.users[0]
    //     )
    // }, [ownUserIsReady]);


    // useEffect(() => {

    //     window.alert('type  user ' + typingUsers);
    // }, [typingUsers]);


    return (
        <div className="d-flex align-items-center main-cont rounded border-bottom p-1">
            <div className="flex-shrink-0 img-cont user-select-none">
                <img
                    src={`${URL}/user/getProfilePhoto/${user._id}`}
                    className="rounded-circle prof-img set-img-undragable"
                    alt="img" />


                {onlineUsers?.some(u => u._id ===  user?._id) &&
                    <img src={onlineIcon} className="online-icon set-img-undragable" alt="img" />
                }
            </div>
            <div className="flex-grow-1 ms-3">
                <div>
                    <strong>
                        {ownUserIsReady ?  user?.name : "loading"}
                    </strong>
                </div>

                {/* &nbsp;&nbsp;&nbsp;&nbsp;  */}
                <div className="user-select-none text-muted istyping-cont">
                    {typingUsers?.some(u => u ==  user?._id) &&
                        'is typing...'
                    }
                </div>

            </div>

            <div className="d-flex justify-content-center ms-3 me-2 notif-icon-cont-outer">
                <div className="float-end notif-icon-cont-inner align-self-center">
                    {newMsgNotif.some(u =>  user?._id === u) &&
                        <img src={newMsgIcon} className="notif-icon set-img-undragable notif-icon-cont" alt="img" />
                    }
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;