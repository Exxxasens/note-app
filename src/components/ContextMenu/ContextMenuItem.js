import React from 'react';
import './ContextMenuItem.scss';

export default ({ onClick, children }) => {
    return (
        <div className='context-menu-item' onClick={onClick}>
            { children }
        </div>
    )
}