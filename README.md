# bridge-project
including vue2、nodejs(express)

# 安装环境

> node版本：14.16.0
> npm版本配套：6.14.11

## 建议安装

> nvm：node版本管理，安装node时会安装配套的npm

nvm安装路径下有settings.txt文件，添加

- node_mirror: https://npm.taobao.org/mirrors/node/

- npm_mirror: https://npm.taobao.org/mirrors/npm/

第一个是node的下载地址，第二个是npm的下载地址

- nvm list ---- 查看所有已经安装的版本

- nvm list available ---- 查看网络上可以安装的版本

- nvm install v14.16.0 ---- 安装node

- nvm uninstall v14.16.0 ---- 卸载node

- nvm use v14.16.0 ---- 使用node

> nrm：npm源管理，每个npm安装的nrm不一样

nrm install -g nrm

- nrm ls ---- 显示所有源

- nrm add `<registry>` `<url>` ---- 添加可选源

- nrm use `<registry>` ---- 切换源

- nrm del `<registry>` ---- 删除源

- nrm test `<registry>` ---- 测试源响应时长