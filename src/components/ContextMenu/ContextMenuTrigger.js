import React from 'react';

export default ({ menuId, children, className }) => {

    const createEvent = (clickEvent) => {
        const { clientX, clientY } = clickEvent;
        const event = new CustomEvent(menuId, {
            detail: { x: clientX, y: clientY },
            bubble: true,
            cancelable: true
        });
        document.dispatchEvent(event);
    }
    let classList = ['context-menu-trigger'];
    if(className) classList.push(className);
    classList = classList.join(' ');
    return (
        <div className={classList} onClick={createEvent}>
            { children }
        </div>
    )
}