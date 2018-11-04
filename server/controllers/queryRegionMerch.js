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
  return new Promise((resolve, reject) => {
    const config = require('../config')
    var conf = {}
    conf = config.mysql
    var mysql = require('mysql')
    var connection = mysql.createConnection(conf)
    connection.connect(function (err) {
      if (err != null) console.log(err)
    })
    var locationstring = ' AND Merchandise.location = ?'

    if (params != null) {
      if (params.sl != null) {
        locationstring += ' AND Merchandise.subLocation = ?'
      }
      if (params.el != null) {
        locationstring += ' AND Merchandise.endLocation = ?'
      }
    }
    var queryString3 = 'SELECT a.*,Graphs.graph_blob FROM (SELECT distinct Merchandise.*, Merch_content.merchid,Merch_content.graphid FROM Merchandise ,Merch_content WHERE Merchandise.id = Merch_content.merchid ' + locationstring + ') a LEFT JOIN Graphs ON Graphs.id = a.graphid ORDER BY a.showTime LIMIT ?,?;'
    console.log(queryString3)
    //queryString = 'SELECT a.* FROM (' + queryString + ') a'
    var quantity = parseInt(params.quantity)
    var page = params.page
    var start = (page - 1) >= 0 ? (page - 1) : 0
    start = start * quantity
    var paramsUsed = [params.l, params.sl, params.el, start, quantity]

    connection.query(queryString3, paramsUsed, function (err, rows, fields) {

      if (err != null) reject(err)

      else resolve(rows)
    });
    connection.end()
  })
}