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


app.listen(config.port, () => debug(`listening on port ${config.port}`))
console.log('server start')