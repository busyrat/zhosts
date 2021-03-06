# zhost

## notes

```js
import { ipcRenderer } from 'electron'
```

会报错: TypeError: fs.existsSync is not a function

解决办法：

1. 告诉 webpack 不要打包

```js
const { ipcRenderer } = window.require('electron')
```

2. 修改 webpack 配置

```shell
yarn add customize-cra react-app-rewired -D
```

---

package.json 中的 scripts 只能按顺序执行命令，不能等待

concurrently 并行两个命令

wait on 等待完成

---

robotjs c++不能直接引用，需要编译

1. 手动方式

```js
npm rebuild --runtime=electron --disturl=http://atom.io/download/atom-shell --target=<electron version> --abi=<abi version>
// npm rebuild --runtime=electron --disturl=http://atom.io/download/atom-shell --target=8.2.3 --abi=72
```

abi_crosswalk 查找[表](https://github.com/mapbox/node-pre-gyp/blob/master/lib/util/abi_crosswalk.json)

2. 自动化方式

electron-rebuild

---

vkey 键盘键值 CODE 转换为字符

---

vscode 调试

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Main Process",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
      "windows": {
        "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron.cmd"
      },
      "args": ["."]
      // "outputCapture": "std"
    }
  ]
}
```

---

最简单的 P2P

控制端：

- 创建 RTCPeerConnection

- 发起连接 createOffer(得到 offer SDP)

- setLocalDescription(设置 offer SDP)

- 将控制端的 offer SDP 发送给傀儡端

傀儡端：

- 创建 RTCPeerConnection

- 添加桌面流 addstream

- setRemoteDescription(设置控制端 offer SDP)

- 响应连接 createAnswer(得到 answer SDP)

- setLocalDescription(设置 answaer SDP)

- 将傀儡端的 offer SDP 发送给控制端

控制端：

- setRemoteDescription(设置控制端 answer SDP)

---

SDP

Session Description Protocol 会话描述协议

---

NAT

Network Address Translation 网络地址转换

NAT 穿透 打洞

ICE

Interactive Connectivity Establishment 交互式连接创建

优先 STUN

NAT 会话穿越应用程序

备选 TURN

中继 NAT 实现的穿透

---

STUN 过程

控制端 TO STUN：

- 讯问地址 onIceCandidate (返回 IceEvent, 包含 IP+端口)

控制端 TO 傀儡端：

- 将 IceEvent 发送

傀儡端：

- 添加 ICE 代理， addIceCandidate

傀儡端 TO STUN：

- 讯问地址 onIceCandidate (返回 IceEvent, 包含 IP+端口)

傀儡端 TO 控制端 ：

- 将 IceEvent 发送

控制端：

- 添加 ICE 代理， addIceCandidate

---

WebSocket

基于 TCP 长连接通讯

全双工通讯，性能好，安全，扩展性

适用于：网游、支付、IM 等

第三方库：SocketIO、ws

websocket.org/echo.html 测试

---

sse

高级浏览器才有

服务端

---

RTCDataChannel

用处：用来传输数据用的

基于 P2P 传输，无服务端依赖；

基于 SCTP（传输层，有着 TCP、UDP 的优点：可靠、有序）

控制端：

pc.createDataChannel（在连接中新增数据通道）

傀儡端：

pc.ondatachannel（发现新数据通道传输）

e.channel.onmessage

控制端：

open 事件触发（数据通道成功）

傀儡端：

响应指令

## 媒体

轨（Track）

流（MediaStream）

一个流里面可能有多个轨

---

WebRTC 重要类

MediaStream

RTCPeerConnection

RTCDataChannel 非音视频通道

---

PeerConnection 调用过程

---

Web 服务器选型

NodeJS

Nginx

Apache

---

netstat -ntpl 查看所有 TCP 端口

长期挂起：

```shell
noHub node app.js &
# 或者
npm install -g forever
forever start app.js
```

---

serve-index 生成一个根目录

---

NAT Network Address Translator

STUN Simple Traversal of UDP Through NAT

TURN Traversal Using Relays around NAT
P2P 不通的情况下的保险

ICE Interactive Connectivity Establishment
把 STUN 和 TURN 打包在一起，取最优路径

---

NAT 产生的原因：

由于 IPv4 的地址不够

出于网络安全的原因：外网和内网分隔开

---

NAT 种类

完全锥形 NAT: Full Cone NAT，安全级别很低

地址限制锥形 NAT: Address Restricted Cone NAT，IP 地址限制，只信任发送过消息的源头

端口限制锥形 NAT: Port Restricted Cone NAT，IP 的基础上加上端口信任

对称型: NAT Symmetric NAT，几乎穿越不了

---

NAT 无法穿越

端口受限锥型 & 对称型
对称型 & 对称型

---

RFC STUN 规范

RFC3489/STUN

Simple Traversal of UDP Through NAT

RFC5389/STUN，在原基础上主要增加了 TCP

Session Traversal Utilities for NAT
