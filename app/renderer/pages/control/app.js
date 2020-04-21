const peer = require('./peer-control')
peer.on('add-stream', play)

let video
function play(stream) {
  video = document.getElementById('screen-video')
  video.srcObject = stream
  video.onloadedmetadata = function () {
    video.play()
  }
}

window.onkeydown = function (e) {
  let data = {
    keyCode: e.keyCode,
    shift: e.shiftKey,
    meta: e.metaKey,
    control: e.ctrlKey,
    alt: e.altKey,
  }
  peer.emit('robot', 'key', data)
}
window.onmouseup = function (e) {
  let data = {}
  data.clientX = e.clientX
  data.clientY = e.clientY
  data.video = {
    width: video.getBoundingClientRect().width,
    height: video.getBoundingClientRect().height,
  }
  console.log(data)
  peer.emit('robot', 'mouse', data)
}
