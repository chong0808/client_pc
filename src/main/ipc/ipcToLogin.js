import FilesUrl from './../configs/filesUrl'
import win from './../utils/createWin'
import winConfigs from './../configs/winConfigs'
import Store from './../store/store'
// import api from './../../apiUrl'
const { ipcMain, globalShortcut } = require('electron')
const IPCLOGIN = require('./../../ipcCfg').LOGINIPC
// const axios = require('axios')

const indexOptions = winConfigs.indexOptions
const winURL = FilesUrl.index
// const Store = require('./../store/store');
const store = Store()

// 接收登陆
ipcMain.on(IPCLOGIN.LOGIN, (event, arg) => {
  const _mainRender = win(winURL, indexOptions)
  store.setState(arg)
  event.sender.send(IPCLOGIN.LOGIN, { success: true })
  globalShortcut.register('CommandOrControl+o', () => {
    _mainRender.webContents.openDevTools()
  })
})
