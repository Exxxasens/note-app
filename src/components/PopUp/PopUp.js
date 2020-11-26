import React from 'react';
import './PopUp.scss';

export default ({ children }) => {
    return (
        <div className='popup-wrapper'>
            <div className='popup'>
                <div className='content'>
                    { children }
                </div>
            </div>
        </div>
    )
}