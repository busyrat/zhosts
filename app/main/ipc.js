const { ipcMain } = require('electron')

module.exports = function () {
  ipcMain.handle('login', async () => {
    let code = Math.floor(Math.random() * (999999 - 100000) + 100000)
    return code
  })
}
