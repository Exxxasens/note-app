import React from 'react';
import { NavLink } from 'react-router-dom';
import './Menu.scss';

export default () => {
    const list = [
        { label: 'Добавить', icon: 'add', link: '/create' },
        { label: 'Календарь', icon: 'calendar_today', link: '/calendar' },
        { label: 'Настройки', icon: 'settings', link: '/settings' }
    ];
    const mapFn = ({ label, icon, link }, i) => <MenuItem label={label} icon={icon} link={link} key={i} showLabel={false} />
    return (
        <div className='menu-wrapper'>
            <div>

            </div>
            <div className='menu-row'>
                <div className='menu'>
                    { list.map(mapFn) }
                </div>
            </div>
        </div>
    )
}

const MenuItem = ({ label, icon, link, showLabel = true, showIcon = true }) => {
    return (
        <NavLink to={link} className='menu-item' activeClassName='selected' >
                { icon && showIcon ? (<div className='icon'><span className="material-icons">{icon}</span></div>) : null }
                { label && showLabel ? <div>{ label }</div> : null }
        </NavLink>
    )
}