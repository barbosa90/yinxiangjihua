module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var params = querystring.parse(ctx.request.querystring)
  var chunk = await query(params)
  ctx.body = chunk
}


var query = (params) => {
  var gid = params.gid

  return new Promise((resolve, reject) => {
    const config = require('../config')
    var conf = {}
    conf = config.mysql
    var mysql = require('mysql')
    var connection = mysql.createConnection(conf)
    connection.connect(function (err) {
      if (err != null) console.log(err)
    })

    var selectString = 'SELECT GRAPHS.GRAPH_BLOB,MERCH_CONTENT.MERCHID FROM GRAPHS,MERCH_CONTENT WHERE MERCH_CONTENT.GRAPHID = GRAPHS.ID AND MERCH_CONTENT.USED_IN = "swiper"';
    var paramsArr = []
    connection.query(selectString, paramsArr, function (err, rows, fields) {

      if (err != null) reject(err)

      else resolve(rows)
    });
    connection.end()
  })
}