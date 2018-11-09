// pages/map/map.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_latitude:0,
    user_longitude:0,
    covers:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var setLocation = this.setLocation
    wx.getLocation({
      success: function(res) {
        setLocation(res)
      },
    })
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

  setLocation: function (res){
    this.setData({
      user_latitude: res.latitude,
      user_longitude: res.longitude,
      covers: { 
        id: "map_user_" + app.globalData.baseUser.id,
        latitude: res.latitude,
        longitude: res.longitude,
        title: app.globalData.baseUser.nickname,
        iconPath: './marker_dot.png'
      }
    })
  }
})