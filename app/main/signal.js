const WebSocket = require('ws')
const EventEmitter = require('events')
const signal = new EventEmitter()

const ws = new WebSocket('ws://119.29.178.93:8010')

ws.on('open', () => {
  console.log('connect success')
})

ws.on('message', (message) => {
  let data = {}
  try {
    data = JSON.parse(message)
  } catch (e) {
    console.log('parse error', e)
  }
  signal.emit(data.event, data.data)
})

function send(event, data) {
  ws.send(JSON.stringify({ event, data }))
}

function invoke(event, data, answerEvent) {
  return new Promise((resolve, reject) => {
    send(event, data)
    signal.once(answerEvent, resolve)
    setTimeout(() => {
      reject('timeout')
    }, 5000)
  })
}

signal.send = send
signal.invoke = invoke
signal.parse = (obj) => {
  let ret = {}
  try {
    ret = JSON.parse(obj)
  } catch (error) {
    console.log(error)
  }
  return ret
}
module.exports = signal
