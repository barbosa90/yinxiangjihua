module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var params = querystring.parse(ctx.request.querystring)
  var chunk = await queryOneUser(params)
  ctx.body = chunk
}


var queryOneUser = (params) => {
  let openid = params.openid
  return new Promise((resolve, reject) => {
    const config = require('../config')
    var conf = {}
    conf = config.mysql
    var mysql = require('mysql')
    var connection = mysql.createConnection(conf)
    connection.connect(function (err) {
      if (err != null) console.log(err)
    })
    var queryString = 'SELECT * FROM User WHERE openId = ?'
    var params = [openid];
    connection.query(queryString, params, function (err, rows, fields) {

      if (err != null) {
         reject(err)
      }else{
        resolve(rows)
      }
      
    });
    connection.end()
  })
}
