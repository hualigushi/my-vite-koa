const Koa =require('koa')
const {serverStaticPlugin} = require('./plugins/serverPluginServerStatic')
const {moduleRewritePlugin} = require('./plugins/serverPluginModuleRewrite')
const {moduleResolvePlugin} = require('./plugins/serverPluginModuleResolve')
const {htmlRewritePlugin} = require('./plugins/serverPluginHtml')
const {vuePlugin} = require('./plugins/serverPluginVue')
function createServer(){
    const app = new Koa()
    const root = process.cwd() // 进程当前目录

    const context = {
        app,
        root
    }
    const resolvedPlugins = [ // 插件集合
        htmlRewritePlugin,
        // 3. 解析import语法，然后进行重写
        moduleRewritePlugin,
        // 2. 解析以 /@modules文件开头的内容，找到对应的结果
        moduleResolvePlugin,
        vuePlugin,
        // 1. 实现静态服务
        serverStaticPlugin, // 功能是读取文件，将文件的结果放到了ctx.body上
    ]
    resolvedPlugins.forEach(plugin=>plugin(context))
    return app

}

module.exports = createServer