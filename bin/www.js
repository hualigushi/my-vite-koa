#! /usr/bin/env node


// 通过http启动一个服务
const createServer = require('../index')

// 创建一个Koa服务
createServer().listen(4001,()=>{
    console.log('server start 4000 port','http://localhost:4000')
})