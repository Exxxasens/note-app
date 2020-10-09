import React from 'react';
import { Link } from 'react-router-dom';

export default ({ link, icon, children, selected, className, title, onSelect }) => {
    let classList = [];
    classList.push(className ? className : 'menu-item');
    if(selected) classList.push('active');
    classList = classList.join(' ');
    return (
        <>
            <Link to={link} className={classList} onClick={() => onSelect(children)}  >
                { icon ? <div className='icon'><span className="material-icons">{ icon }</span></div> : null }
                { title ? <div className='title'>{title}</div> : null }
            </Link>
        </>
    )
}