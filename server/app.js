const Koa = require('koa')

const app = new Koa()

const debug = require('debug')('wechatTicket')

const response = require('./middlewares/response')

const bodyParser = require('koa-bodyparser')

const config = require('./config')





// 使用响应处理中间件

app.use(response)

// 解析请求体

app.use(bodyParser())

// 引入路由分发

const routes = require('koa-route')

const queryOneMerchById = require('./controllers/merchDetail')
const queryAllMerch = require('./controllers/queryAllMerch')
const queryIndexMerch = require('./controllers/queryIndexMerch')
const addUser = require('./controllers/addUser')
const queryOneUser = require('./controllers/queryOneUser')
const login = require('./controllers/login')
const updateUser = require('./controllers/updateUser')
const pickOutMerch = require('./controllers/pickOutMerch')
const queryOneMerchAmount = require('./controllers/queryOneMerchAmount')
const queryAllAddressesByUser = require('./controllers/queryAllAddressesByUser')
const createPreOrder = require('./controllers/createPreOrder')
const refillMerch = require('./controllers/refillMerch')
const getPaySign = require('./controllers/getPaySign')
const indexSwiper = require('./controllers/indexSwiper')
const imageByGid = require('./controllers/imageByGid')
const querySomeMerch = require('./controllers/querySomeMerch')
const queryRegionMerch = require('./controllers/queryRegionMerch')
const wxpayApi = require('./controllers/wxpayApi')
const queryOnesPreOrders = require('./controllers/queryOnesPreOrders')
const updatePreOrderStatus = require('./controllers/updatePreOrderStatus')
const queryOnePreOrder = require('./controllers/queryOnePreOrder')

//查询一个merch用id
app.use(routes.get('/weapp/onemerch',queryOneMerchById))
//查询所有merch
app.use(routes.get('/weapp/allmerch', queryAllMerch))

//查询几个merch
app.use(routes.get('/weapp/somemerch', querySomeMerch))
//条件查询merchs
app.use(routes.get('/weapp/regionmerch', queryRegionMerch))

app.use(routes.get('/weapp/queryIndexMerch', queryIndexMerch))
app.use(routes.get('/weapp/getIndexSwipers', indexSwiper))
app.use(routes.get('/weapp/imageByGid', imageByGid))
//增加一个用户
app.use(routes.get('/weapp/addUser', addUser))
//查找一个用户
app.use(routes.get('/weapp/queryOneUser', queryOneUser))
//登录
app.use(routes.get('/weapp/login', login))
//修改用户信息
app.use(routes.get('/weapp/updateUser', updateUser))
//获取最大可购买量
app.use(routes.get('/weapp/queryOneMerchAmount', queryOneMerchAmount))

app.use(routes.get('/weapp/queryAllAddressesByUser', queryAllAddressesByUser))



//建立临时订单
app.use(routes.get('/weapp/createPreOrder', createPreOrder))
app.use(routes.get('/weapp/pickOutMerch', pickOutMerch))

app.use(routes.get('/weapp/getPaySign', getPaySign))

app.use(routes.get('/weapp/refillMerch', refillMerch))
app.use(routes.get('/weapp/queryOnesPreOrders', queryOnesPreOrders))
app.use(routes.get('/weapp/updatePreOrderStatus', updatePreOrderStatus))
app.use(routes.get('/weapp/queryOnePreOrder', queryOnePreOrder))


app.use(routes.get('/weapp/wxpayApi', wxpayApi))
var appid = 'wx72c209e92fbd2ea3'
var appsecret = '0aeaad70334bc747f8e97f7e5b2d4897'
var mchid = '1499403456'//
var mchkey = '8r435jVd7yA0354nsvkxb4cN3x7Se4322'//
var wxurl = ''//'/weapp/getPaySign'//

// express.get('/weapp/wxpayApi', (req, res) => {        //首先拿到前端传过来的参数    
// let orderCode = req.query.orderCode    
// let money = req.query.money    
// let orderID = req.query.orderID
// console.log('APP传过来的参数是',orderCode+'----'+money+'------'+orderID+'----'+appid+'-----'+appsecret+'-----'+mchid+'-----'+mchkey)     //首先生成签名sign    appid    
// let mch_id = mchid    
// let nonce_str = wxpay.createNonceStr()    
// let timestamp = wxpay.createTimeStamp()
// let body = '测试微信支付'
// let out_trade_no = orderCode   
// let total_fee = wxpay.getmoney(money) 
// let spbill_create_ip = req.connection.remoteAddress
// let notify_url = wxurl
// let trade_type = 'APP'
// let sign = wxpay.paysignjsapi(appid,body,mch_id,nonce_str,notify_url,out_trade_no,spbill_create_ip,total_fee,trade_type,mchkey)     
// console.log('sign==',sign) //组装xml数据   
// var formData  = "<xml>"
// formData += "<appid>"+appid+"</appid>"//appid    
// formData  += "<body><![CDATA["+"测试微信支付"+"]]></body>"
// formData  += "<mch_id>"+mch_id+"</mch_id>";  //商户号    
// formData  += "<nonce_str>"+nonce_str+"</nonce_str>" //随机字符串，不长于32位。    
// formData  += "<notify_url>"+notify_url+"</notify_url>"
// formData  += "<out_trade_no>"+out_trade_no+"</out_trade_no>"
// formData  += "<spbill_create_ip>"+spbill_create_ip+"</spbill_create_ip>"
// formData  += "<total_fee>"+total_fee+"</total_fee>"
// formData  += "<trade_type>"+trade_type+"</trade_type>"
// formData  += "<sign>"+sign+"</sign>"
// formData  += "</xml>"
// console.log('formData===',formData)
// var url = 'https://api.mch.weixin.qq.com/pay/unifiedorder'
// request({url:url,method:'POST',body: formData},function(err,response,body){     
//   if(!err && response.statusCode == 200){         
//     console.log(body)
//     xmlreader.read(body.toString("utf-8"), function (errors, response) {       if (null !== errors) {                    
//       console.log(errors)                    
//       return            
//     }                
//     console.log('长度===', response.xml.prepay_id.text().length)
//      var prepay_id = response.xml.prepay_id.text()
//      console.log('解析后的prepay_id==',prepay_id)
//      //将预支付订单和其他信息一起签名后返回给前端                
//      let finalsign = wxpay.paysignjsapifinal(appid,mch_id,prepay_id,nonce_str,timestamp,mchkey)
//      res.json({'appId':appid,'partnerId':mchid,'prepayId':prepay_id,'nonceStr':nonce_str,'timeStamp':timestamp,'package':'Sign=WXPay','sign':finalsign})
//      })
//   }
//   })
// })

app.listen(config.port, () => debug(`listening on port ${config.port}`))
console.log('server start')