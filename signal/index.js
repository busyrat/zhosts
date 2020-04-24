const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8010 })

let code2ws = new Map()

wss.on('connection', (ws, request) => {
  let code = Math.floor(Math.random() * (999999 - 100000) + 100000)

  // 缓存映射
  code2ws.set(code, ws)

  ws.sendError = (msg) => ws.sendData('error', { msg })

  ws.sendData = (event, data) => {
    ws.send(JSON.stringify({ event, data }))
  }
  ws.on('message', (message) => {
    console.log(message)
    let parsedMessage = {}
    try {
      parsedMessage = JSON.parse(message)
    } catch (e) {
      ws.sendError('message, invalid')
      console.log('parse message error', e)
      return
    }
    let { event, data } = parsedMessage
    if (event === 'login') {
      ws.sendData('logined', { code })
    } else if (event === 'control') {
      let remote = +data.remote
      if (code2ws.has(remote)) {
        ws.sendData('controlled', { remote })
        ws.sendRemote = code2ws.get(remote).sendData
        code2ws.get(remote).sendRemote = ws.sendData
        ws.sendRemote('be-controlled', { remote: code })
      }
    } else if (event === 'forward') {
      ws.sendRemote(data.event, data.data)
    }
  })
  ws.on('close', () => {
    code2ws.delete(code)
    clearTimeout(ws._closeTimeout)
  })
  ws._closeTimeout = setTimeout(() => {
    ws.terminate()
  }, 10 * 60 * 1000)
})
