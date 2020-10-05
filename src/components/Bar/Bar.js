import React from 'react';
import './Bar.scss';

export default ({ children, className }) => {
    let classList = ['bar'];
    if(className) classList.push(className);
    classList = classList.join(' ');
    return (
        <div className={classList}>
            { children }
        </div>
    )
}