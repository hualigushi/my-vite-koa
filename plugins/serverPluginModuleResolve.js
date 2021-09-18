const modulesREG = /^\/@modules\//
const fs = require('fs').promises
const path = require('path')
const {resolveVue} = require('./utils')

function moduleResolvePlugin({app, root}){
    const vueResolved = resolveVue(root) // 根据当前运行vite的目录解析出一个表，包含vue中所有的模块

    app.use(async (ctx,next)=>{
        if(!modulesREG.test(ctx.path)){ // 处理当前请求的路径，判断是否以 @modules 开头
            return next()
        }

        // 将 @modules 替换掉
        const id = ctx.path.replace(modulesREG,'') // vue

        ctx.type = 'js' // 设置响应类型，响应结果是js类型
        // 应该去当前项目下查找vue对应的真实的文件
        const content =await fs.readFile(vueResolved[id],'utf-8')
        ctx.body = content // 返回读取出来的结果
    })
}
exports.moduleResolvePlugin=moduleResolvePlugin