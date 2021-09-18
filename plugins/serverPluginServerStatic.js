const static = require('koa-static')
const path = require('path')

function serverStaticPlugin({app,root}){

    // 在当前项目目录启动静态服务
    app.use(static(root))
    // 在public文件夹启动静态服务
    app.use(static(path.join(root,'public')))
}

exports.serverStaticPlugin = serverStaticPlugin