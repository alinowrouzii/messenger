import React from 'react';
import img from "./../../../Images/no-profile.jpg";
import './styles.css'
const ProfileInfo = () => {
    return (

        <div class="d-flex align-items-center main-cont rounded">
            <div class="flex-shrink-0">
                <img src={img} class="rounded-circle prof-img" alt="img" />
            </div>
            <div class="flex-grow-1 ms-3">
                AliNowrouzi<br />
                <p>
                    online
                </p>
            </div>
        </div>

    );
};

export default ProfileInfo;