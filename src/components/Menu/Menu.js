import React from 'react';
import { NavLink } from 'react-router-dom';
import './Menu.scss';

const menu = [
    { 
        label: 'Напоминания', icon: 'list', link: '/list/',
        submenu: [
            { label: 'Все', link:'all' },
            { label: 'Сегодня', link: 'today' },
            { label: 'Завтра', link: 'tomorrow' },
            { label: 'Эта неделя', link: 'week' }
        ]
    },
    { label: 'Календарь', icon: 'calendar_today', link: '/calendar' },
    { label: 'Настройки', icon: 'settings', link: '/settings' }
];

export default () => {
    const [submenu, setSubmenu] = React.useState(null);
    const onSelect = (submenu) => setSubmenu(submenu); 
    const mapFn = ({ label, icon, link, submenu }, i) => (<MenuItem
        label={label}
        icon={icon}
        link={link}
        submenu={submenu}
        key={i}
        showLabel={false}
        handleClick={onSelect}
    />)

    return (
        <div className='menu-wrapper'>
            <div>

            </div>
            <div className='menu-row'>
                <div className='menu'>
                    { menu.map(mapFn) }
                </div>
                { submenu ? <SubMenu list={submenu}/> : null }
            </div>
        </div>
    )
}

const MenuItem = ({ label, icon, link, showLabel = true, showIcon = true, handleClick, submenu }) => {
    return (
        <NavLink to={link} className='menu-item' activeClassName='selected' onClick={() => handleClick(submenu)} >
                { icon && showIcon ? (<div className='icon'><span className="material-icons">{icon}</span></div>) : null }
                { label && showLabel ? <div>{ label }</div> : null }
        </NavLink>
    )
}

const SubMenu = ({ list }) => {
    const mapFn = ({ label, link }, i) => {
        return (
            <NavLink to={link} className='submenu-item' activeClassName='selected' key={i}>
                { label }
            </NavLink>
        )
    }
    return (
        <div className='right-side-menu'>
            { list.map(mapFn) }
        </div>
    )
}