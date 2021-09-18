const {readBody} = require('./utils')
const {parse} = require('es-module-lexer') //解析import语法
const MagicString = require('magic-string')

function rewriteImports(source){
    // parse(source)
    // [
    //     { n: 'vue', s: 27, e: 30, ss: 0, se: 31, d: -1, a: -1 },
    //     { n: './App.vue', s: 49, e: 58, ss: 32, se: 59, d: -1, a: -1 },
    //     { n: './router', s: 80, e: 88, ss: 60, se: 89, d: -1, a: -1 },
    //     { n: './store', s: 109, e: 116, ss: 90, se: 117, d: -1, a: -1 }
    //   ]
    let imports = parse(source)[0]
    let magicString = new MagicString(source) // 将字符串变成对象
    
    if(imports.length){ // 说明有多个import

        for(let i=0;i<imports.length;i++){
            let {s,e} = imports[i]
            let id = source.substring(s,e)

            // 当前开头是  \  或者 . 不需要重写
            if(/^[^\/\.]/.test(id)) {
                id = `/@modules/${id}`
                magicString.overwrite(s,e,id)
            }
        }
    }
    return magicString.toString() // 将替换后的结果返回
    // 返回的结果增加了 /@modules 浏览器会再次发送请求，服务器要拦截带有 /@modules 前缀的请求进行处理
}
function moduleRewritePlugin({app,root}) {
    app.use(async (ctx, next)=>{
        await next()

        // 获取流中数据
        if(ctx.body && (ctx.response.is('ts')||ctx.response.is('js'))){
            let content = await readBody(ctx.body)
            const result = rewriteImports(content)
            ctx.set('Content-Type', 'text/javascript')
            ctx.body = result // 将内容重写并且返回
        }

        // 重写内容，将重写后的结果返回
    })
}

exports.moduleRewritePlugin = moduleRewritePlugin