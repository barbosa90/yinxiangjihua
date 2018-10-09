// 登录授权接口
// module.exports = async (ctx, next) => {
//     // 通过 Koa 中间件进行登录之后
//     // 登录信息会被存储到 ctx.state.$wxInfo
//     // 具体查看：
//     if (ctx.state.$wxInfo.loginState) {
//         ctx.state.data = ctx.state.$wxInfo.userinfo
//         ctx.state.data['time'] = Math.floor(Date.now() / 1000)
//     }
// }

module.exports = async (ctx, next) => {
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var params = querystring.parse(ctx.request.querystring)
 
  var promise = await login(params)
  ctx.body = promise

}

var login = (params) => {
  return new Promise((resolve, reject) => {
    var request = require('request')
    request('https://api.weixin.qq.com/sns/jscode2session?appid=wx2be3c27f24305fe4&secret=965c3c5f305c54ce7df189c250f70559&js_code=' + params.code + '&grant_type=authorization_code', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body)
      }
    })
  })
}
