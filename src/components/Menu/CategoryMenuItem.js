import React from 'react';
import { MenuItem } from '../Menu';
import useContextMenu from '../hooks/useContextMenu';

export default ({ setPopUpContent, ...rest }) => {
    const showContextMenu = useContextMenu(
        React.useCallback(() => [
                {
                    label: 'Удалить',
                    click: () => setPopUpContent()
                }
            ], [])
    );
    return (
        <React.Fragment>
            <MenuItem {...rest} onContextMenu={showContextMenu} />
        </React.Fragment>
    ) 
}