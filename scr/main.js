//-------------------------------------------------------------------------//
//--------------------------- ( Imports ) ---------------------------//
//-------------------------------------------------------------------------//
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const process = require('process')
if (process.env.NODE_ENV !== 'production') {
   const ignored1 = /data|[/\\]\./; // all folder resorces => resources
   const ignored2 = /assets|[/\\]\./; // all folder resorces => resources
   // const ignored3 = /files\/img|[/\\]\./; //all folder files/img => files/img
   require('electron-reload')(__dirname, { ignored: [ignored1, ignored2] });
}


//---------------------------------------------------------------------//
//--------------------------- ( Variables ) ---------------------------//
//---------------------------------------------------------------------//
let mainWindow;


//---------------------------------------------------------------------//
//--------------------------- ( Functions) ---------------------------//
//---------------------------------------------------------------------//


// (FUN) Creates the main window.
const create_main_window = () => {
   mainWindow = new BrowserWindow({
      width: 600,
      height: 500,
      minWidth: 400,
      minHeight:500,
      resizable: true,
      frame: false,
      maximizable: false,
      transparent: true,
      opacity: 0.97,
      show: true,
      icon: path.join(__dirname, 'assets/img/icon.ico'),
      webPreferences: {
         // preload: path.join(__dirname, 'js/preload.js'),
         contextIsolation: false,
         nodeIntegration: true,
         enableRemoteModule: true,
      }
   })
   mainWindow.loadURL(path.join(__dirname, 'renderer/html/home.html'))

   mainWindow.on('closed', () => {
      console.log('App finalizada');
      if (process.platform !== 'darwin') {
         app.quit();
      }
   })

}

// (FUN) Bar button actions in the main window
const mainWindow_bar_actions = (event, data) => {
   // console.log(data);
   if (data === 'close') {
      mainWindow.close()
   }
   else if (data === 'minimize') {
      mainWindow.minimize()
   }
}


//---------------------------------------------------------------------//
//--------------------------- ( app Events ) --------------------------//
//---------------------------------------------------------------------//

// *** Aplication ready
app.on('ready', create_main_window)

// *** Every window app clossed
app.on('window-all-closed', () => {
   if (process.platform !== 'darwin') {
      app.quit();
   }
})

// *** Right click menu 
app.setUserTasks([
   {
       program: __dirname,
       arguments: '--new-window',
       iconPath: path.join(__dirname, 'assets/img/icon.ico'),
       iconIndex: 0,
       title: 'Ubicación',
       description: 'Create a new window'
   }
])

//---------------------------------------------------------------------//
//--------------------------- ( ipcEvents ) ---------------------------//
//---------------------------------------------------------------------//

// *** Bar buttons in main window pressed
ipcMain.on('window-bar', (event, data) => {
   // console.log(data);
   mainWindow_bar_actions(event, data);
})

// *** Data for the broker
ipcMain.on('ready-to-server', (event, data) => {
   console.log('ready-to-server! :', data);
})


