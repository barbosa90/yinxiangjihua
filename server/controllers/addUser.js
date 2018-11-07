module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var query = require('../api/mysqlPool.js')

  var params = querystring.parse(ctx.request.querystring)
  let reg_name = params.reg_name
  let reg_phone = params.reg_phone
  let nickname = params.nickname
  let openId = params.openId
  let avatarUrl = params.avatarUrl

  let language = params.language
  let city = params.city
  let province = params.province
  let gender = params.gender
  let def_addr = params.def_addr
  params = [nickname, reg_name, reg_phone, openId, avatarUrl, gender, language, city, province, def_addr, reg_phone, openId];
  var insertUserString = 'INSERT INTO `User` (`nickname`, `reg_datetime`, `reg_name`, `reg_phone`, `points`, `vip_flag`, `lastLogin`, `openId`, `avatarUrl`, `gender`, `language`, `city`, `province`) VALUES (?, CURRENT_DATE(), ?, ?, "0", "0", CURRENT_TIME(),?,?,?,?,?,?);'
  var insertAddrString ='CALL createDefAddr(?,?,?);'
  var chunk = await query(insertUserString + insertAddrString,params)
  ctx.body = chunk
}