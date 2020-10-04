import React from 'react';
import { NavLink, Link, useHistory } from 'react-router-dom';
import useTouchBar from '../hooks/useTouchBar.js';
import './Menu.scss';

const menu = [
    { 
        label: 'Напоминания', icon: 'list', link: '/list/all',
        submenu: [
            { label: 'Все', link: '/list/all' },
            { label: 'Сегодня', link: 'today' },
            { label: 'Завтра', link: 'tomorrow' },
            { label: 'Эта неделя', link: 'week' },
            { label: 'Выполненные', link: 'done' }
        ]
    },
    { label: 'Календарь', icon: 'calendar_today', link: '/calendar' },
    { label: 'Настройки', icon: 'settings', link: '/settings' }
];

export default () => {
    const [menuItemId, setMenuItemId] = React.useState(null);
    const [submenuId, setSubmenuId] = React.useState(0);
    const history = useHistory();
    const submenu = menu[menuItemId] ?  menu[menuItemId]['submenu'] : null;

    const handleClick = (i) => {
        setMenuItemId(i);
        setSubmenuId(0);
    }
    const mapFn = ({ icon, link }, i) => (<MenuItem
        icon={icon}
        link={link}
        submenu={submenu}
        key={i}
        handleClick={handleClick}
        i={i}
        isSelected={i === menuItemId}
    />);

    const onTouchBarButtonClick = (link, i) => {
        if(i !== menuItemId) {
            setMenuItemId(i);
            setSubmenuId(0);
            history.push(link);
        }
    }
    const touchBarSelect = (i) => {
        history.push(submenu[i].link);
        setSubmenuId(i);
    }
    const createTouchBar = ({ TouchBarScrubber, TouchBarButton }) => {
        const buttons = menu.map(({ label, link }, i) => {
            let backgroundColor = menuItemId === i ? '#597aff' : null;
            return new TouchBarButton({ label, click: () => onTouchBarButtonClick(link, i), backgroundColor })
        })
        if(submenu) {
            const items = submenu.map(({ label }) => ({ label }));
            buttons.push(new TouchBarScrubber({ items, highlight: (i) => touchBarSelect(i) }));
        }
        return buttons;
    }

    const updateTouchBar = (touchBarItems) => {
        if(touchBarItems) {
            touchBarItems.forEach((item, i) => {
                let backgroundColor = (menuItemId === i) ? '#597aff' : null;
                item.backgroundColor = backgroundColor;
            }); 
        }
    }

    useTouchBar(
        React.useCallback(createTouchBar, [menuItemId]),
        React.useCallback(updateTouchBar, [menuItemId])
    );

    return (
        <div className='menu-wrapper'>
            <div>

            </div>
            <div className='menu-row'>
                <div className='menu'>
                    { menu.map(mapFn) }
                </div>
                { submenu ? <SubMenu list={submenu} selected={submenuId} onSelect={(i) => setSubmenuId(i)}/> : null }
            </div>
        </div>
    )
}

const MenuItem = ({ icon, link, handleClick, i, isSelected }) => {
    let classList = ['menu-item'];
    if(isSelected) classList.push('selected');
    classList = classList.join(' ');
    return (
        <Link to={link} className={classList} onClick={() => handleClick(i)} >
                { icon ? (<div className='icon'><span className="material-icons">{icon}</span></div>) : null }
        </Link>
    )
}

const SubMenu = ({ list, selected, onSelect }) => {
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