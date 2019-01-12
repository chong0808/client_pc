'use strict'
import { app, globalShortcut } from 'electron'
import FilesUrl from './configs/filesUrl'
import win from './utils/createWin'
import winConfigs from './configs/winConfigs'

require('./ipc')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = FilesUrl.login
var loginOptions = winConfigs.loginOptions
app.on('ready', () => {
  mainWindow = win(winURL, loginOptions)
  globalShortcut.register('CommandOrControl+p', () => {
    mainWindow.webContents.openDevTools()
  })
})

app.on('activate', () => {
  if (mainWindow === null) {
    win(winURL, loginOptions)
  }
})
app.on('window-all-closed', () => {
  app.quit()
})
