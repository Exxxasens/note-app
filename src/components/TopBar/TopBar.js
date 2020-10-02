import React from 'react';
import './TopBar.scss';

export default ({ children }) => {
    return (
        <div className='top-bar'>
            { children }
        </div>
    )
}