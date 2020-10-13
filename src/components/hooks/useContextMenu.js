import React from 'react';

const { remote } = require('electron');
const { Menu } = remote;

export default (buildTemplate) => {
    return () => {
        const menu = Menu.buildFromTemplate(buildTemplate());
        menu.popup(remote.getCurrentWindow());
    }
}