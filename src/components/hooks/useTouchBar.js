import React from 'react';
const { TouchBar, getCurrentWindow } = require('electron').remote;

export default (createTouchBarFn, touchBarUpdateFn) => {
    let touchBarItems = React.useMemo(() => {
        const items = createTouchBarFn(TouchBar);
        getCurrentWindow().setTouchBar(new TouchBar({ items }));
        return items;

    }, [createTouchBarFn]);

    React.useEffect(() => {
        if(touchBarItems && touchBarUpdateFn) touchBarUpdateFn(touchBarItems);
    }, [touchBarUpdateFn]);

    React.useEffect(() => {
        return () => {
            getCurrentWindow().setTouchBar(null);
        }
    }, []);

}