// pages/myOrderList/myOrderList.js
const app = getApp()
import request from '../../utils/wxRequest.js'
const wxRequest = new request
const appconfig = require('../../config.js')
import toast from '../../utils/toast.js'
const wxToast = new toast

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.queryOnesPreOrders(app.globalData.baseUser.ID)
    //this.queryOnesPaidOrders(app.globalData.baseUser.ID)
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
    this.queryOnesPreOrders(app.globalData.baseUser.ID)
    this.queryOnesPaidOrders(app.globalData.baseUser.ID)
    var prol = this.data.preOrderList
    var paol = this.data.paidOrderList
    if (prol != null && prol.length > 0 && paol != null && paol.length > 0 ){
      this.setData({
        msg:""
      })
    }else{
      this.setData({
        msg: "none"
      })
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
  queryOnesPaidOrders: function (userid) {
    var serverUri = app.globalData.serverUri
    var merchIdJson = { userid: userid }
    var header = { 'content-type': 'application/json' }
    var promise = wxRequest.getRequest(serverUri + "/queryUserPaidOrders", merchIdJson, header)
    promise.then(this.queryOnesPaidOrdersSuccessful)
  },
  queryOnesPaidOrdersSuccessful: function (result) {
    console.log(result)
    var orderArray = result.data
    for (var i = 0; i < orderArray.length; i++) {
      var order = orderArray[i]
      var paidTime = order.PAIDTIME
      var paidTimeDT = new Date(paidTime)
      var showPaidTime = paidTimeDT.toLocaleString()
      order.showPaidTime = showPaidTime

      var deadline = order.DEADLINE
      if(deadline == null){
        order.showDeadLine = "无过期时间"
      }
      var deadlineDT = new Date(deadline)
      var showDeadLine = deadlineDT.toLocaleString()
      order.showDeadLine = showDeadLine
      this.orderCheck(order,order.DEADLINE)
      console.log(order)
      // if (order.payStatus == 0) {
        //this.orderCheck(order)
        // var merchid = order.merchid
        // var currMerchRefillAmount = 0
        // if (refillMap.get(merchid) == null) {
        //   currMerchRefillAmount = 0
        //   refillMap.set(merchid, currMerchRefillAmount);
        // } else {
        //   currMerchRefillAmount = refillMap.get(merchid)
        // }
        // console.log(order.payStatus)
        // if (!order.avaliable && order.payStatus == 0) {
        //   currMerchRefillAmount++;
        //   refillMap.set(merchid, currMerchRefillAmount);
        // }
      // }
    }

    //this.changePaidOrderStatus(orderArray)
    // this.refillAll(refillMap)//上方
    this.setData({
      paidOrderList: result.data
    })
  },
  queryOnesPreOrders: function (userid) {
    var serverUri = app.globalData.serverUri
    var merchIdJson = { userid: userid }
    var header = { 'content-type': 'application/json' }
    var promise = wxRequest.getRequest(serverUri + "/queryUserPreOrders", merchIdJson, header)
    promise.then(this.queryOnesPreOrdersSuccessful)
  },
  queryOnesPreOrdersSuccessful:function(result){
    console.log(result)
    var orderArray = result.data
    var refillMap = new Map()
    for(var i = 0; i < orderArray.length; i++){
      var order = orderArray[i]
      var destroyTime = order.DESTROYTIME
      var destroyDT = new Date(destroyTime)
      var showDestroyTime = destroyDT.toLocaleString()
      order.showDestroyTime = showDestroyTime
      if (order.PAYSTATUS == 0){
        this.orderCheck(order, order.DESTROYTIME)
        var merchid = order.MERCHID
        var currMerchRefillAmount = 0
        if (refillMap.get(merchid) == null) {
          currMerchRefillAmount = 0
          refillMap.set(merchid, currMerchRefillAmount);
        } else {
          currMerchRefillAmount = refillMap.get(merchid)
        }
        if (!order.avaliable && order.PAYSTATUS == 0) {//0代表未支付状态，1代表支付完成，2代表未支付且已经恢复数量了（结束了，取消了）
          currMerchRefillAmount++;
          refillMap.set(merchid, currMerchRefillAmount);
        }
      }
    }
    console.log(refillMap)
    
    this.changePreOrderStatus(orderArray)
    this.refillAll(refillMap)//上方
    this.setData({
      preOrderList:result.data
    })
  },
  refillAll: function(map){
    var refillAmount = this.refillAmount
    map.forEach(function (item, key, mapObj) {
      var merchid = key
      var amount = map.get(key)
      refillAmount(merchid, amount)
    });
  },
  refillAmount: function (merchid, amountHold) {
    var updateData = {
      id: merchid,
      amount: amountHold
    }
    var amountUpdate = wxRequest.getRequest(app.globalData.serverUri + "/refillMerch", updateData, {})
    amountUpdate.then(this.amountUpdateSuccessful, this.amountUpdateFail)
    console.log("恢复商品可购买数量：" + amountHold)

  },
  amountUpdateSuccessful:function(data){
    console.log(data)
  },
  amountUpdateFail: function(err){
    console.log(err)
  },
  changePreOrderStatus: function (orderArray){
    var orderids = ''
    for (var i = 0; i < orderArray.length; i++) {
      var order = orderArray[i]
      if(order.avaliable){
        continue
      }
      if(orderids.length > 0){
        orderids += ','
      }
      orderids += order.ID
    }
    var data = {
      orderids: orderids,
      to: 2
    }

    var update = wxRequest.getRequest(app.globalData.serverUri + "/updatePreOrderStatus",data , {})
    update.then(this.updateStatusSuccessful, this.updateStatusFail)
  },
  updateStatusSuccessful:function(result){
    console.log(result)
  },
  updateStatusFail:function(err){
    console.log(err)
  },
  queryOneOrder: function (tapData){
    var orderid = tapData.currentTarget.dataset.orderid
    var t = tapData.currentTarget.dataset.type
    var data = {
      id: orderid
    }
    if(t == "pre"){
      var query = wxRequest.getRequest(app.globalData.serverUri + "/queryOnePreOrder", data, {})
      query.then(this.queryOnePreOrderSuccessful, this.queryOnePreOrderFail)
    }else{
      var query = wxRequest.getRequest(app.globalData.serverUri + "/queryOnePaidOrder", data, {})
      query.then(this.queryOnePaidOrderSuccessful, this.queryOneOrderFail)
    }
    
  },
  queryOnePreOrderSuccessful:function(result){
    var orderData = result.data[0]
    wx.navigateTo({
      url: '../myOrder/myOrder?t=pre&orderData=' + JSON.stringify(orderData)
    })
  },
  queryOnePaidOrderSuccessful: function (result){
    var orderData = result.data[0]
    wx.navigateTo({
      url: '../myOrder/myOrder?t=paid&orderData=' + JSON.stringify(orderData)
    })
  },
  orderCheck: function (order,time){
    if(time == null) {
      order.avaliable = true
      return
    }
    var DT = new Date(time)
    var avaliable = true
    if (DT.getTime() < new Date().getTime()) {
      avaliable = false
    }
    order.avaliable = avaliable
  }
})