const { app } = require('electron')
const handleIPC = require('./ipc')
const { create: createMainWindow } = require('./windows/main')

let mainWindow

app.on('ready', () => {
  let mainWindow = createMainWindow()
  handleIPC()
  require('./robot.js')()
})

module.exports = { mainWindow }
