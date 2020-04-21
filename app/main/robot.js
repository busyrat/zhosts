const { ipcMain } = require('electron')
const robot = require('robotjs')
const vkey = require('vkey')

function handleMouse({ clientX, clientY, screen, video }) {
  let x = (clientX * screen.width) / video.width
  let y = (clientY * screen.height) / video.height
  robot.moveMouse(x, y)
  robot.mouseClick()
}

function handleKey(data) {
  const modifiers = []
  if (data.meta) modifiers.push('meta')
  if (data.shift) modifiers.push('shift')
  if (data.alt) modifiers.push('alt')
  if (data.ctrl) modifiers.push('ctrl')
  const key = vkey[data.keyCode].toLowerCase()
  if (key[0] !== '<') {
    // 特殊字符
    robot.keyTap(key, modifiers)
  }
}

module.exports = function () {
  ipcMain.on('robot', (e, type, data) => {
    if (type === 'mouse') {
      handleMouse(data)
    } else if (type === 'key') {
      handleKey(data)
    }
  })
}
