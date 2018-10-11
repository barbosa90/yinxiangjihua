module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var params = querystring.parse(ctx.request.querystring)
  var p = ctx.request
  var chunk = await getPaySign(params,p)
  ctx.body = chunk
}


var getPaySign = (params,p) => {
  return new Promise((resolve, reject) => {
    console.log(params)
    var prepayId = params.json.prepayId
    try{
      var timeStamp = new Date().getTime()
      var crypto = require("crypto")
      var nonceStr = randomStr(crypto,32)
      var paySign = md5(crypto,'appId=wx72c209e92fbd2ea3&nonceStr=' + nonceStr + '&package=prepay_id=' + prepayId + 'prepayid&signType=MD5&timeStamp=' + timeStamp + '&key=0aeaad70334bc747f8e97f7e5b2d4897')
     // paySign = MD5(appId = wxd678efh567hg6787 & nonceStr=5K8264ILTKCH16CQ2502SI8ZNMTM67VS & package=prepay_id = wx2017033010242291fcfe0db70013231072 & signType=MD5 & timeStamp=1490840662 & key=qazwsxedcrfvtgbyhnujmikolp111111) = 22D9B4E54AB1950F51E0649E8810ACD6
      paySign = paySign.toUpperCase()
      var result = {
        paySign: paySign,
        nonceStr: nonceStr,
        timeStamp: timeStamp.toString(),
        signType: 'MD5',
        returnp:p
      }
      resolve(result)
    }catch(err){
      if(reject) reject(err)
    }
  })
}

function md5(crypto,str) {
  var md5sum = crypto.createHash('md5')
  md5sum.update(str)
  str = md5sum.digest('hex')
  return str
}

function randomStr(crypto,size) {
  size = size || 32;
  var code_string = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  var max_num = code_string.length + 1;
  var new_pass = ''
  for (var i = 0; i < size; i++) {
    new_pass += code_string.charAt(Math.floor(Math.random() * max_num))
  }
  return new_pass
}
