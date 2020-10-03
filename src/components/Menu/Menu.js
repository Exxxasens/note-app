import React from 'react';
import { NavLink, Link, useHistory } from 'react-router-dom';
import useTouchBar from '../hooks/useTouchBar.js';
import './Menu.scss';

const menu = [
    { 
        label: 'Напоминания', icon: 'list', link: '/list/',
        submenu: [
            { label: 'Все', link: '/list/' },
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
    const [selectedId, setSelectedId] = React.useState(0);
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
                { submenu ? <SubMenu list={submenu} selected={selectedId} onSelect={(i) => setSelectedId(i)}/> : null }
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

const SubMenu = ({ list, selected, onSelect }) => {
    const history = useHistory();

    const updateTouchBar = (touchBarItems) => {
        touchBarItems.forEach((touchBarItem, i) => {
            touchBarItem.backgroundColor = i === selected ? '#597aff' : '#ffffff';
        });     
    }

    const createTouchBar = ({ TouchBarButton }) => {
        const touchBarMapFn = ({ label, link }, i) => {
            return new TouchBarButton({ 
                label, 
                backgroundColor: i === selected ? '#597aff' : '#ffffff',
                click: () => {
                    onSelect(i);
                    history.push(link);
                }
            });
        }
        return list.map(touchBarMapFn);
    }

    useTouchBar(
        React.useCallback(createTouchBar, [list]),
        React.useCallback(updateTouchBar, [selected])
    );


    const mapFn = ({ label, link }, i) => {
        let classList = ['submenu-item'];
        if(i === selected) classList.push('selected');
        classList = classList.join(' ');
        return (
            <Link to={link} className={classList} key={i} onClick={() => onSelect(i)}>
                { label }
            </Link>
        )
    }
    return (
        <div className='right-side-menu'>
            { list.map(mapFn) }
        </div>
    )
}