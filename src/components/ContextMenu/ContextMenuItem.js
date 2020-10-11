import React from 'react';
import './ContextMenuItem.scss';

export default ({ onClick, children, id = null }) => {
    return (
        <div className='context-menu-item' onClick={(e) => onClick(e, id)}>
            { children }
        </div>
    )
}