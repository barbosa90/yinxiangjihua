module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var params = querystring.parse(ctx.request.querystring)
  var chunk = await queryUserPreorder(params)
  ctx.body = chunk
}


var queryUserPreorder = (params) => {
  let id = params.id
  return new Promise((resolve, reject) => {
    const config = require('../config')
    var conf = {}
    conf = config.mysql
    var mysql = require('mysql')
    var connection = mysql.createConnection(conf)
    connection.connect(function (err) {
      if (err != null) console.log(err)
    })
    var queryString = 'SELECT * FROM Pre_order WHERE id = ?'
    var params = [id];
    connection.query(queryString, params, function (err, rows, fields) {

      if (err != null) {
        reject(err)
      } else {
        resolve(rows)
      }

    });
    connection.end()
  })
}