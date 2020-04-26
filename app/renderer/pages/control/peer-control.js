const EventEmitter = require('events')
const peer = new EventEmitter()

const { ipcRenderer } = require('electron')

const pc = new window.RTCPeerConnection({
  iceServers: [
    {
      urls: `stun:stun.freeswitch.org`,
    },
  ],
})

const dc = pc.createDataChannel('robotChannel', { reliable: false })
dc.onopen = function () {
  peer.on('robot', (type, data) => {
    dc.send(JSON.stringify({ type, data }))
  })
}

dc.onmessage = function (event) {
  console.log('message', event)
}

dc.onerror = (e) => {
  console.log('robot error', e)
}

pc.onicecandidate = function (e) {
  if (e.candidate) {
    ipcRenderer.send('forward', 'control-candidate', JSON.stringify(e.candidate))
  }
}

ipcRenderer.on('candidate', (e, candidate) => {
  console.log('ipc candidate, ', candidate)
  addIceCandidate(candidate)
})

let candidates = []
async function addIceCandidate(candidate) {
  if (candidate) {
    candidates.push(candidate)
  }
  if (pc.remoteDescription && pc.remoteDescription.type) {
    for (let i = 0; i < candidates.length; i++) {
      await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
    }
  }
}

window.addIceCandidate = addIceCandidate

async function createOffer() {
  const offer = await pc.createOffer({
    offerToReceiveAudio: false,
    offerToReceiveVideo: true,
  })
  await pc.setLocalDescription(offer)
  console.log('pc offer,' + JSON.stringify(offer))
  return pc.localDescription
}

createOffer().then((offer) => {
  ipcRenderer.send('forward', 'offer', { type: offer.type, sdp: offer.sdp })
})

async function setRemote(answer) {
  await pc.setRemoteDescription(answer)
}

window.setRemote = setRemote
ipcRenderer.on('answer', (e, answer) => {
  console.log('answer!!!!!!!!!!!!!!!!!!!!!!!: ', answer)
  setRemote(answer)
})

pc.onaddstream = function (e) {
  console.log('add-stream', e)
  peer.emit('add-stream', e.stream)
}

module.exports = peer
