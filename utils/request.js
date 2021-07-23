
// 发送ajax请求
// 1.封装功能函数
//     功能点明确
//     函数内部应该保留固定代码(静态的)
//     将动态的数据抽取成形参,由使用者根据自身情况动态的传入实参
//     一个良好的功能函数应该设置形参的默认值(ES6形参默认值)
// 2.封装功能组件
//    功能点明确
//    组件内部保留静态的代码
//    将动态的数据抽取成props参数由使用者根据自身情况以标签属性形式动态传入props数据
//    一个良好的组件应该设置组件的必要性和数据类型
//      props:{
//           msg:{
//             require:true,
//             default:默认值,
//             type:String
//           }
// }

import config from './config'
export default(url,data={},method='GET')=>{
  // 默认值
  // 异步任务
  return new Promise((resolve,reject)=>{
    // 1.new Promise 初始化promise实例的状态为pending
    wx.request({
      url:config.mobileHost+url,
      data,
      method,
      header:{
          // cookie:wx.getStorageSync('cookies')[0]
          cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item=>item.indexOf('MUSIC_U')!==-1):''
      },
      success:(res)=>{
        if(data.isLogin){
          //如果是登录请求，保存cookie
          wx.setStorage({
            key:'cookies',
            data:res.cookies
          })
        }
        resolve(res.data)
        // 修改promise的状态为成功状态resolved
      },
      fail:(err)=>{
        reject(err)
        // 修改promised的状态为失败状态rejected
      }
    })
  })
}