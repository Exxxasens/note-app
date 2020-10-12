import React from 'react';
import './Menu.scss';


export default ({ children, onSelect, onSubMenuSelect }) => {
    const [selected, setSelected] = React.useState(null);
    const handleSelect = (i, props) => {
        if(onSelect) onSelect(props);
        setSelected(i);
    }
    return (
        <>
            <div className='menu'>
                {React.Children.map(
                    children, 
                    (MenuItem, i) => React.cloneElement(MenuItem, 
                        { onSelect: (subMenu) => handleSelect(i, MenuItem.props, subMenu), selected: (i === selected), onSubMenuSelect }
                    )
                )}
            </div>
        </>
    )
}

/*

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

*/