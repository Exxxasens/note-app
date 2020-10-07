import React from 'react';
import './ContextMenu.scss';

export default ({ children, menuId, position, onHide }) => {
    if(!menuId && position) {
        const { y, x } = position;
        return (
            <div className='context-menu-bg' onClick={onHide} >
                <div className='context-menu' style={{ position: 'absolute', top: y, left: x }}>
                    { children }
                </div>
            </div>
        )
    }
    const [show, setShow] = React.useState(false);
    const hideMenu  = () => {
        console.log('hide')
        if(show) setShow(false);
    }
    React.useEffect(() => {
        const handleEvent = (event) => {
            const { x, y } = event.detail;
            setShow({ x, y });
        }
        document.addEventListener(menuId, handleEvent);
        return () => document.removeEventListener(menuId, handleEvent);

    });

    if(!show) return null;

    let { x, y } = show;
    return (
        <div className='context-menu-bg' onClick={hideMenu}>
            <div className='context-menu' style={{ position: 'absolute', top: y, left: x }}>
                { children }
            </div>
        </div>
    )
}