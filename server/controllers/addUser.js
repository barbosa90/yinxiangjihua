module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var params = querystring.parse(ctx.request.querystring)
  var chunk = await addUser(params)
  ctx.body = chunk

  
}


var addUser = (params) => {
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
  return new Promise((resolve, reject) => {
    const config = require('../config')
    var conf = {}
    conf = config.multiMysql
    var mysql = require('mysql')
    var connection = mysql.createConnection(conf)
    connection.connect(function (err) {
      if (err != null) console.log(err)
    })
    var insertUserString = 'INSERT INTO `User` (`nickname`, `reg_datetime`, `reg_name`, `reg_phone`, `points`, `vip_flag`, `lastLogin`, `openId`, `avatarUrl`, `gender`, `language`, `city`, `province`) VALUES (?, CURRENT_DATE(), ?, ?, "0", "0", CURRENT_TIME(),?,?,?,?,?,?);'
    var insertAddrString ='CALL createDefAddr(?,?,?);'
    var params = [nickname, reg_name, reg_phone, openId, avatarUrl, gender, language, city, province, def_addr, reg_phone, openId];
    connection.query(insertUserString + insertAddrString , params, function (err, result) {
      console.log(result)
      if (err != null) reject(err)
      else{
        resultData = {
          code: 200,
          msg: 'sql成功',
          data: result[0]//只返回第一个 也就是增加的user
        }
        resolve(resultData)
      }
      
    })
    connection.end()
  })
}
