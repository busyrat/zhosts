zhost

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
