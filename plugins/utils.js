const {Readable} = require('stream')
const path = require('path')

async function readBody(stream){
    if(stream instanceof Readable){ // 只对流文件进行处理
        return new Promise((resolve,reject)=>{
            let res = ''
            stream.on('data',data=>{
                res += data
            })
    
            stream.on('end',()=>{
                resolve(res) // 内容解析完成抛出去
            })
        })
    } else {
        return stream.toString()
    }
}

function resolveVue(root){
    // vue3组成部分
    // runtime-dom   runtime-core  compiler  reactivity shared
    // 在后端中解析 .vue 文件  compiler-sfc

    // 编译是在后端实现，所有需要文件是commonjs规范的
    const compilerPkgPath = path.join(root,'node_modules','@vue/compiler-sfc/package.json')
    const compilerPkg = require(compilerPkgPath) // 获取的是json中的内容
    const compilerPath = path.join(path.dirname(compilerPkgPath),compilerPkg.main)


    const resolvePath = (name)=>path.resolve(root,'node_modules',`@vue/${name}/dist/${name}.esm-bundler.js`)
    const runtimeDomPath = resolvePath('compiler-dom')
    const runtimeCorePath = resolvePath('compiler-core')
    const reactivity = resolvePath('reactivity')
    const sharedPath = resolvePath('shared')

    // esmModule 模块

    return {
        compiler: compilerPath, // 用于后端进行编译的文件路径
        '@vue/compiler-dom': runtimeDomPath,
        '@vue/compiler-core': runtimeCorePath,
        '@vue/reactivity': reactivity,
        '@vue/shared': sharedPath,
        vue: runtimeDomPath
    }
}
exports.readBody = readBody
exports.resolveVue = resolveVue