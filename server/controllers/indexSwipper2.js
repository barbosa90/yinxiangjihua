module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var query = require('../api/mysqlPool.js')

  var params = []
  var chunk = await query('SELECT Graphs.graph_blob,Merch_content.merchid FROM Graphs,Merch_content WHERE Merch_content.graphid = Graphs.id AND Merch_content.used_in = "swiper"',params)
  ctx.body = chunk
}
