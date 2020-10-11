const { app, BrowserWindow, Menu, nativeTheme } = require('electron');
const path = require('path');
const url = require('url');
let mainWindow;

function setMenu (menuTemplate) {
    return Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
}

function loadFile(window, filePath) {
    const fileUrl = url.format({ 
        pathname: path.join(__dirname, ...filePath),
        protocol: 'file:',
        slashes: true
    });
    return window.loadURL(fileUrl);
}

app.on('ready', () => {
    mainWindow = new BrowserWindow({ 
        title: 'My Notes',
        autoHideMenuBar: true,
        height: 800,
        width: 1000,
        minHeight: 600,
        minWidth: 800,
        vibrancy: 'menu',
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            worldSafeExecuteJavaScript: true
        }
    });
    loadFile(mainWindow, ['static', 'index.html'])
        .then(() => console.log('padge loaded'))
        .catch(() => console.log('cannot load page'));
    const menuTemplate = [
        { 
            label: 'Приложение',
            submenu: [
                { role: 'toggledevtools' },
                { role: 'reload' },
                { role: 'Quit', label: 'Выход' }
            ]
        }
    ]
    
    setMenu(menuTemplate);
    nativeTheme.themeSource = 'light';
});