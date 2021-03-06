var mysql = require("mysql")
const config = require('../config')
var conf = {}
conf = config.multiMysql
var pool = mysql.createPool(conf)

var query = function (sql, args) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err)
        resolve(err)
      } else {
        connection.query(sql, args, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}

module.exports = query