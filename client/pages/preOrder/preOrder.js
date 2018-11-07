// pages/preOrder/preOrder.js
const app = getApp()
import request from '../../utils/wxRequest.js'
import toast from '../../utils/toast.js'
const wxRequest = new request
const wxToast = new toast

Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxAmount:1,
    chooseAmount: 1,
    minimalAmount: 1,
    user: {},
    choosePoints: 0,
    totalCost: 0,
    cost: 0,
    addrData: {},
    orderParams:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var merchData = JSON.parse(options.merchData)
    this.setData({
      merchData: merchData,
      maxAmount: Number(merchData.amount),
      user:app.globalData.baseUser,
      totalCost: merchData.cost * 1 ,
      cost: merchData.cost
    })
    this.getAddress(app.globalData.baseUser.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("show")
    this.checkStatus(this.queryOneMerchAmount)

  },
  checkStatus: function (checkMerchAmount) {//session?
    if (app.globalData.baseUser.openId == app.globalData.openid) {
      checkMerchAmount()
    } else {
      wxToast.toastSafe_normal('服务器忙，获取个人信息失败')
    }
  },
  queryAmountFail: function (reject) {
    console.log(reject)
  },
  queryOneMerchAmount: function () {
    var queryData = {
      id: this.data.merchData.id
    }
    var amountQuery = wxRequest.getRequest(app.globalData.serverUri + "/queryOneMerchAmount", queryData, this.data.header)
    amountQuery.then(this.queryAmountSuccessful, this.queryAmountFail)
  },
  queryAmountSuccessful: function (resolve) {
    var amountData = resolve.data[0]
    var amount = amountData.amount
    if (amount > 0) {
      var md = this.data.merchData //刷新数量 
      md.amount = amount
      this.data.maxAmount = amount
      this.setData({
        merchData: md,
        maxAmount : amount
      })
    } else {
      setTimeout(
        function() {
          wx.navigateTo({
            url: '../index/index'
          })
        }, 1000
      )
      wxToast.toastSafe_normal('soldout')

    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getAddress: function(userid){
    var useropenidJson = { userid: userid }
    wxRequest.getRequest(app.globalData.serverUri + '/queryAllAddressesByUser', useropenidJson, {}).then(this.getAddressSuccessful)
  },
  getAddressSuccessful:function(data){
    if (data.statusCode == 200){
      this.setData({
        addrData:data.data[0]
      })
    }
  },
  decreaseAmount: function () {
    var am = this.data.chooseAmount - 1
    if (am <= 0) am = 1
    this.setData({ chooseAmount: am })
    this.recalculate() 
  },
  increaseAmount: function () {
    var am = this.data.chooseAmount + 1
    var max = this.data.maxAmount
    if (am >= max) am = max
    this.setData({ chooseAmount: am })
    this.recalculate() 
  },
  setChoose: function (e) {
    var sc = Number(e.detail.value)
    if (e.detail.value == '') sc = 1
    var max = this.data.maxAmount
    if (sc > max) {
      if (sc > max) wxToast.toastSafe_short('超过最大值！')
      sc = max
    }
    if (e.detail.value == '' || sc <= 0) {
      sc = 1 
      wxToast.toastSafe_short('不能再减少啦！')
    }
    this.setData({
      chooseAmount: sc
    })
    this.recalculate() //1积分1分钱  
  },
  setPoints: function (e) {
    var sp = Number(e.detail.value)
    if (sp == '') sp = 0
    var max = this.data.user.points
    if (max == 0) {
      e.detail.value = 0
      wxToast.toastSafe_short('无可用积分！')
      this.setData({ choosePoints: 0 })
      return;
    }
    if (sp > max) {
      if (sp > max) wxToast.toastSafe_short('拥有积分已全部使用！')
      sp = max
    }
    //如果积分超过了总价 积分基础规则
    var totally1 = this.data.chooseAmount * this.data.cost;
    if (sp > totally1) {
      wxToast.toastSafe_short('达到商品积分使用限额')
      sp = totally1
    }

    if (e.detail.value == '' || sp <= 0) {
      sp = 0
      wxToast.toastSafe_short('不能再减少啦！')
    }
    
    this.setData({
      choosePoints: sp 
    })
    this.recalculate()//totally1 - sp //1积分1分钱
    //console.log(' 使用积分规则没有定 、 例如下：1积分抵1分 ')
  },
  submit_preorder: function(e){
    if (!app.globalData.baseUser) {
      return
    }
    var formValue = e.detail.value
    var addr_phone = formValue.addr_phone
    var address,phone
    if (addr_phone == 'def'){
      address = this.data.addrData.def_address
      phone = this.data.addrData.def_phone
    }else{
      address = this.data.addrData['address' + addr_phone]
      phone = this.data.addrData['phone' + addr_phone]
    }
    var merchAmountLeft = this.data.maxAmount - this.data.chooseAmount
    var order = {
      userid: app.globalData.baseUser.id,
      merchid: this.data.merchData.id,
      discount: 0,
      points: app.globalData.baseUser.points - this.data.choosePoints,//剩余
      pointsUsed: this.data.choosePoints,
      merchCost: this.data.merchData.cost,
      finalCost: this.data.totalCost,
      address: address,
      phone: phone,
      amount:this.data.chooseAmount,
      merchAmountLeft: merchAmountLeft
    }
    this.setData({
      orderParams: order
    })
    var pickData = {
      merchid: this.data.merchData.id,
      amount: this.data.chooseAmount
    }
    this.pickOutMerch(pickData)
  },
  pickOutMerch: function (pickData){

    wxRequest.getRequest(app.globalData.serverUri + '/pickOutMerch', pickData, {}).then(this.pickOutMerchSuccessful, this.pickOutMerchFail)
  },
  pickOutMerchSuccessful: function (result){
    console.log(result)
    if (true) {
      wxRequest.getRequest(app.globalData.serverUri + '/createPreOrder', this.data.orderParams, {}).then(this.createOrderSuccessful, this.creatOrderFail)
    }else{
      wxToast.toastSafe_normal('服务器繁忙')
    }
  },
  pickOutMerchFail:function(err){
    console.log(err)
    wxToast.toastSafe_normal('服务器繁忙')
  },
  createOrderSuccessful:function(result){
    console.log(result)
    var pre_order_id = result.data[1][0].id
    var totalCost = this.data.totalCost
    var selfDestroy = result.data[1][0].destroyTime
    var amount = this.data.chooseAmount
    var merchid = this.data.merchData.id
    if (selfDestroy){
      wx.navigateTo({
        url: '../bill/bill?pre_order_id=' + pre_order_id + "&totalCost=" + totalCost + "&selfDestroy=" + selfDestroy + "&amount=" + amount + "&merchid=" + merchid
      })
    }else{
      return
    }
  },
  creatOrderFail:function(data){
    console.log(err)
    wxToast.toastSafe_normal('服务器繁忙')
  },
  recalculate: function (amount, cost, discount, discountType, choosePoints){
    var totally = this.data.chooseAmount * this.data.cost - this.data.choosePoints //1积分1分钱规则
    this.setData({
      totalCost: totally
    })
  }
})