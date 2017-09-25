const {app, BrowserWindow} = require('electron')
const { autoUpdater } = require("electron-updater")
const log = require('electron-log')
const isDev = require('electron-is-dev')
const path = require('path')
const url = require('url')
const fs = require("fs")
const initPath = "C:\\Program Files\\CALS\\init.json"
let data 

const server = require("./server/server.js")
const PORT = server.PORT

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let updateWindow

const createUpdateWindow = () => {
  updateWindow = new BrowserWindow({
    width: 500,
    height: 250,
    closeable: false
  })
  updateWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'updateClient/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  log.info('App starting...')
  autoUpdater.checkForUpdates()
}

const createAppWindow = () => {
  updateWindow.hide()
  // Create the browser window and load the index.html of the app.
  mainWindow = new BrowserWindow({
    //browser window options here
    x: data.bounds.x,
    y: data.bounds.y,
    width: data.bounds.width,
    height: data.bounds.height
  })
  mainWindow.loadURL(`http://localhost:${PORT}`)
  // Emitted when the window is closed.
  mainWindow.on('close', function () {
    data = {
      bounds: mainWindow.getBounds()
    }
    fs.writeFileSync(initPath, JSON.stringify(data))
    mainWindow = null
    process.exit()
  })
}

const sendStatusToWindow = text => {
  log.info(text)
  updateWindow.webContents.send('message', text)
}

autoUpdater.logger = log

autoUpdater.logger.transports.file.level = 'info'

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...')
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.')
})
autoUpdater.on('update-not-available', (info) => {
  createAppWindow()
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater.')
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
  sendStatusToWindow(log_message)
})

autoUpdater.on('update-downloaded', (info) => {
  autoUpdater.quitAndInstall()  
})

app.on('ready', function()  {
  try {
    data = JSON.parse(fs.readFileSync(initPath, 'utf8'))
  }
  catch(e) {
  }
  createUpdateWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})