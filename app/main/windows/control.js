const { BrowserWindow } = require('electron')
const path = require('path')

let win

function create(obj) {
  win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
    ...obj,
  })

  win.loadFile(path.resolve(__dirname, '../../renderer/pages/control/index.html'))
}

function send(channel, ...args) {
  win.webContents.send(channel, ...args)
}

module.exports = { create, send }
