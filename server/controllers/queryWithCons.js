module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var query = require('../api/mysqlPool.js')
  var params = querystring.parse(ctx.request.querystring)
  var queryString = 'SELECT * FROM MERCHANDISE'
  var addString = ''
  if(params.filterType == 1){
    //地理位置(筛选)/非距离
    addString = ' WHERE LOCATION = ' + params.location
  } else if (params.filterType == 2) {
    //是否开售(筛选)
    addString = ' WHERE AVALTIME > ' + params.avalTime
  } else if (params.filterType == 3) {
    //使用时间(筛选)
    addString = ' WHERE SHOWTIME = ' + params.showTime
  } else if (params.filterType == 4) {
    //使用时间(排序)?
    addString = ' WHERE SHOWTIME = ' + params.showTime
  } else if (params.filterType == 5) {
    //发布时间(排序)
    addString = ' WHERE ADDTIME = ' + params.addTime
  }
    
  params = []
  var chunk = await query(queryString,params)
  ctx.body = chunk
}
