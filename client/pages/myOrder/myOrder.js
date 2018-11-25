// pages/myOrder/myOrder.js
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
    order:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t = options.t
    var orderData = JSON.parse(options.orderData)
    var setOrderUnavaliable = this.setOrderUnavaliable
    if (t) {
      var destroyTime = orderData.DESTROYTIME
      var destroyDT = new Date(destroyTime)
      var showDestroyTime = destroyDT.toLocaleString()
      orderData.showDestroyTime = showDestroyTime
    }else{
      var destroyTime = orderData.DEADLINE
      var destroyDT = new Date(destroyTime)
      var deadline = destroyDT.toLocaleString()
      orderData.deadline = deadline
    }
    
    this.setData({
      order: orderData,
      t:t
    })
    var interval = 0
    if (t){
      interval = this.orderCheck(orderData, orderData.showDestroyTime)
    }else{
      interval = this.orderCheck(orderData, orderData.deadline)
    }
   
    setTimeout(function () {
      setOrderUnavaliable
    }, interval)
    
    
    console.log(orderData)
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

  orderCheck: function (order, time) {
    var destroyDT = new Date(time)
    var newdatetime = new Date()
    var avaliable = true
    if (destroyDT.getTime() < newdatetime.getTime()) {
      return 0;
    }
    // order.avaliable = avaliable
    // this.setData({
    //   order: order
    // })
    return newdatetime.getTime() - destroyDT.getTime()
  },

  setOrderUnavaliable:function(){
    var order = this.data.order
    order.avaliable = false
    this.setData({
      order:order
    })
  },

  cancelOrder: function (){
    var cf = this.cancelConfirmed
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          cf()
        } else if (sm.cancel) {
        }
      }
    })
  },
  cancelConfirmed:function(){
    var order = this.data.order
    var updateData = {
      id: order.MERCHID,
      amount: order.AMOUNT
    }
    console.log(updateData)
    var amountUpdate = wxRequest.getRequest(app.globalData.serverUri + "/refillMerch", updateData, {})
    amountUpdate.then(this.amountUpdateSuccessful, this.amountUpdateFail)
    console.log("恢复商品可购买数量：" + order.AMOUNT)
  },
  amountUpdateSuccessful:function(result){
      this.updateOrderStatus()
  },
  updateOrderStatus:function(){
    var orderids = this.data.order.ID
    var data = {
      orderids: orderids,
      to: 2
    }

    var update = wxRequest.getRequest(app.globalData.serverUri + "/updatePreOrderStatus", data, {})
    update.then(this.cancelOrderSuccessful, this.updateOrderFail)
  },

  cancelOrderSuccessful:function(){
    var order = this.data.order
    order.avaliable = false
    order.PAYSTATUS = 2
    this.setData({
      order:order
    })
    wxToast.toastSafe_normal('已关闭订单')
  },

  payOrder:function(){
    var order = this.data.order
    var pre_order_id = order.ID
    var totalCost = order.FINALCOST
    var selfDestroyTime = order.DESTROYTIME
    var amount = order.AMOUNT
    var merchid = order.MERCHID

    wx.navigateTo({
      url: '../bill/bill?pre_order_id=' + pre_order_id + "&totalCost=" + totalCost + "&selfDestroy=" + selfDestroyTime + "&amount=" + amount + "&merchid=" + merchid
    })
  }
})