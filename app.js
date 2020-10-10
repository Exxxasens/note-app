const { app, BrowserWindow, Menu, ipcMain, TouchBar, nativeTheme } = require('electron');
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
        vibrancy: 'header',
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            worldSafeExecuteJavaScript: true
        }
    });
    loadFile(mainWindow, ['static', 'index.html']);
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

    const { TouchBarButton } = TouchBar;

    ipcMain.on('set-touch-bar', (_, touchBarItems) => {
        touchBarItems = touchBarItems.map(item => {
            const { type, options } = item;
            if(type === 'button') return new TouchBarButton(options);
        });


        const touchBar = new TouchBar({
            items: touchBarItems
        });

        mainWindow.setTouchBar(touchBar);
    });
    console.log(nativeTheme.shouldUseDarkColors);
    nativeTheme.themeSource = 'light';
});