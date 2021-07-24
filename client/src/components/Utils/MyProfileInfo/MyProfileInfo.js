import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import img from './../../../Images/no-profile.jpg'
import './styles.css';

const MyProfileInfo = () => {



    const [toggle, setToggle] = useState(true)
    const [name, setName] = useState('loading...')
    const [username, setUsername] = useState('loading...')

    const ownUser = useSelector(state=> state.userData.ownUser);
    const ownUserIsReady = useSelector(state=> state.userData.ownUserIsReady);

    useEffect(()=>{
        // console.log('recal in refresh')
        if(ownUserIsReady){
            setName(ownUser?.name);
            setUsername(ownUser?.username);
        }
    },[ownUserIsReady]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            // console.log('do validate');
            setToggle(true);
            //TODO: do some stuff to change the name of user
        }
    }


    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Tap to Edit
        </Tooltip>
    );


    return (
        <div className="d-flex align-items-center myProfileInfo rounded">
            <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
            >
                <div className="flex-shrink-0">
                    <img src={img} className="rounded-circle prof-img" alt="img" />
                </div>
            </OverlayTrigger>
            <div className="flex-grow-1 ms-3 shadow-lg testt rounded">
                name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {toggle ? (
                    <span onDoubleClick={() => { setToggle(false) }}>
                        {name}
                    </span>
                ) : (
                    <input
                        type='text'
                        onKeyPress={handleKeyPress}
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                )}
                <br />
                username:&nbsp;
                {toggle ? (
                    <span onDoubleClick={() => { setToggle(false) }}>
                        {username}
                    </span>
                ) : (
                    <input
                        type='text'
                        onKeyPress={handleKeyPress}
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                )}
            </div>
        </div>
    );
};

export default MyProfileInfo;