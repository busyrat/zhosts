const { desktopCapturer, ipcRenderer } = window.require('electron')

const pc = new window.RTCPeerConnection({
  iceServers: [
    {
      urls: `stun:stun.freeswitch.org`,
    },
    {
      urls: 'turn:119.29.178.93',
      credential: 'busyrat',
      username: 'busyrat',
    },
  ],
})

async function getScreenStream() {
  const sources = await desktopCapturer.getSources({ types: ['screen'] })
  return navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: sources[0].id,
        maxWidth: window.screen.width,
        maxHeight: window.screen.height,
      },
    },
  })
}

pc.ondatachannel = (e) => {
  console.log('datachannel', e)
  e.channel.onmessage = (e) => {
    let { type, data } = JSON.parse(e.data)
    if (type === 'mouse') {
      data.screen = {
        width: window.screen.width,
        height: window.screen.height,
      }
    }
    ipcRenderer.send('robot', type, data)
  }
}

pc.onicecandidate = function (e) {
  if (e.candidate) {
    ipcRenderer.send('forward', 'puppet-candidate', JSON.stringify(e.candidate))
  }
}

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

ipcRenderer.on('offer', async (e, offer) => {
  let answer = await createAnswer(offer)
  ipcRenderer.send('forward', 'answer', { type: answer.type, sdp: answer.sdp })
})

async function createAnswer(offer) {
  let screenStream = await getScreenStream()
  pc.addStream(screenStream)

  await pc.setRemoteDescription(offer)
  await pc.setLocalDescription(await pc.createAnswer())
  // console.log('pc answer, ' + JSON.stringify(pc.localDescription))

  return pc.localDescription
}

window.createAnswer = createAnswer
