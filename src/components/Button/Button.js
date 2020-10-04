import React from 'react';
import './Button.scss';

export default ({ children, ...rest }) => {
    return (
        <div className='btn-wrapper'>
            <button {...rest}>{children}</button>
        </div>
    )
}