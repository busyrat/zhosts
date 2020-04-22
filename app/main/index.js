const { app } = require('electron')
const handleIPC = require('./ipc')
const { create: createMainWindow } = require('./windows/control')

app.on('ready', () => {
  createMainWindow()
  handleIPC()
  require('./robot.js')()
})
