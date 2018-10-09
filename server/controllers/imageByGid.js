module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var params = querystring.parse(ctx.request.querystring)
  var chunk = await query(params)
  console.log(ctx)
  ctx.body = chunk
  
}


var query = (params) => {
  var id = params.gid

  return new Promise((resolve, reject) => {
    const config = require('../config')
    var conf = {}
    conf = config.mysql
    var mysql = require('mysql')
    var connection = mysql.createConnection(conf)
    connection.connect(function (err) {
      if (err != null) console.log(err)
    })
    var selectString = 'SELECT graph_blob FROM Graphs WHERE id = ?;'
    var paramsArr = [id]

    connection.query(selectString, paramsArr, function (err, rows, fields) {

      if (err != null) resolve(err)

      else resolve(rows[0])

    });
    connection.end()
  })
}