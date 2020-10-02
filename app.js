const { app, BrowserWindow , Menu } = require('electron');
const url = require('url');
const path = require('path');

class NoteApp {
    constructor(mainWindowOptions) {
        this.mainWindowOptions = mainWindowOptions;
    }

    isMac = (process.platform === 'darwin');
    isProduction = (process.env.NODE_ENV === 'production');
    electronApp = app;
    mainWindow = null;

    createMainWindow = () => {
        this.mainWindow = new BrowserWindow(this.mainWindowOptions || { width: 1200, height: 800, webPreferences: { devTools: true }});
    }

    onReady = (callback) => {
        this.electronApp.on('ready', callback);
        return this;
    }

    start = async (callback) => {
        this.onReady(() => {
            this.createMainWindow();
            callback();
        });
        return this;
    }

    loadFile = (window, filePath) => {
        const fileUrl = url.format({ 
            pathname: path.join(__dirname, ...filePath),
            protocol: 'file:',
            slashes: true
        });
        return window.loadURL(fileUrl);
    }

    setMenu = (menuTemplate) => {
        return Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
    }

    getMenu = () => Menu.getApplicationMenu();

}

const noteApp = new NoteApp({ title: 'My Notes', autoHideMenuBar: true });

noteApp.start(() => {
    noteApp.loadFile(noteApp.mainWindow, ['static', 'index.html']);
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
    noteApp.setMenu(menuTemplate);
});
