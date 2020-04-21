const { app } = require('electron')
const handleIPC = require('./ipc')
const { create: createControlWindow } = require('./windows/control')

app.on('ready', () => {
  createControlWindow()
  handleIPC()
})
