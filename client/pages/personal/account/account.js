// pages/personal/personal.js
const app = getApp()
import request from '../../../utils/wxRequest.js'
const wxRequest = new request
const appconfig = require('../../../config.js')
const serverHost = appconfig.service.serverUri
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUri: serverHost,
    openid: '',
    globalUserInfo: null,
    hasUserInBase: false,
    session_key: '',
    baseUser: {},
    submitType: "update",
    submitLabel: "修改",
    genderPickerArea:['男','女'],
    genderPickerAreaIndex: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      serverUri: serverHost,
      openid: app.globalData.openid,
      session_key: app.globalData.session_key,
      globalUserInfo: app.globalData.userInfo,
      baseUser: {
        CITY: app.globalData.userInfo.city,
        PROVINCE: app.globalData.userInfo.province
      }
    })

    var serverUri = this.data.serverUri
    var useropenidJson = { openid: this.data.openid }
    var header = { 'content-type': 'application/json' }
    if (this.data.openid) {
      var queryOneUser = wxRequest.getRequest(serverUri + '/queryOneUser', useropenidJson, header)
      if (!app.globalData.hasUserInBase) {
        queryOneUser.then(this.queryOpenIdCallBack)
      } else {
        this.setData({
          baseUser: app.globalData.baseUser,
          hasUserInBase: true
        })
        var bu = this.data.baseUser
        var genderPickerAreaIndex = -1
        if (bu.GENDER == 'male') {
          genderPickerAreaIndex = 0
        } else {
          genderPickerAreaIndex = 1
        }
        this.setData({
          genderPickerAreaIndex: genderPickerAreaIndex
        })
      }
    }
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

  addUser: function (params) {
    var header = {}
    var addcode = wxRequest.getRequest(this.data.serverUri + '/addUser', params, header)
    var hasUserInBase_ = false
    var setHasUserInBase = this.setHasUserInBase
    addcode.then(
      function (e) {
        if (e.data.code == -1) {
          console.log(e.data.error)
          wx.showToast({
            title: "服务器繁忙，请稍候再试",
            duration: 800
          })
        } else {
          console.log(e)
          console.log(e.data)
          //if (e.data.code == 200) {
            hasUserInBase_ = true
            setHasUserInBase(hasUserInBase_)
            wx.showToast({
              title: "保存成功！",
              duration: 800
            })
          //}
          console.log('添加成功')
        }
      },
      function () {
        wx.showToast({
          title: "服务器繁忙，请稍候再试",
          duration: 800
        })
      }
    )
  },

  queryOpenIdCallBack: function (data) {
    if (data.data.length == 0 || data.data.code) {
      console.log('没有找到这个用户')
      this.setData({
        submitType: "form",
        submitLabel: "保存"
      })
    } else {
      console.log('找到了用户')
      app.globalData.hasUserInBase = true
      var bu = data.data[0]
      var genderPickerAreaIndex = -1
      if(bu.GENDER == 'male'){
        genderPickerAreaIndex = 0
      }else{
        genderPickerAreaIndex = 1
      }
      this.setData({
        hasUserInBase: true,
        baseUser: bu,
        genderPickerAreaIndex: genderPickerAreaIndex
      })
    }
  },

  formSubmit: function (e) {
    var formValue = e.detail.value
    if (formValue.reg_name.trim() == '' || formValue.reg_phone.trim() == '') {
      wx.showToast({
        mask: true,
        title: "请务必填写姓名和电话！",
        icon: 'none',
        duration: 800
      })
      return;
    }
    var intGender = formValue.gender
    var varcharGender = 'other'
    if (intGender == 1) {
      varcharGender = 'male'
    }
    else if (intGender == 2) {
      varcharGender = 'female'
    }
    var params = {
      reg_name: formValue.reg_name.trim(),
      reg_phone: formValue.reg_phone.trim(),
      nickname: this.data.globalUserInfo.nickName,
      openId: this.data.openid,
      avatarUrl: this.data.globalUserInfo.avatarUrl,
      gender: varcharGender,
      city: formValue.city.trim(),
      province: formValue.province.trim(),
      language: this.data.globalUserInfo.language,
      def_addr: formValue.def_addr,
      age: formValue.age.trim()
    }
    this.addUser(params)
  },

  formReset: function () {
    // console.log('form发生了reset事件')
  },

  setHasUserInBase: function (val) {
    this.setData({
      hasUserInBase: val,
      submitType: "update",
      submitLabel: "修改"
    })
    var useropenidJson = { openid: this.data.openid }
    wxRequest.getRequest(this.data.serverUri + '/queryOneUser', useropenidJson, {}).then(
      this.queryOpenIdCallBack
    )
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      prePage.changeMottoData()
    }
  },

  updateSubmit: function (e) {
    var formValue = e.detail.value
    if (formValue.age.trim() == '' || formValue.age.trim() == '' || formValue.reg_name.trim() == '' || formValue.reg_phone.trim() == '') {
      wx.showToast({
        mask: true,
        title: "请填写姓名、年龄、性别和电话！",
        icon: 'none',
        duration: 800
      })
      return;
    }
    var genderPickerAreaIndex = this.data.genderPickerAreaIndex
    var varcharGender = 'female'
    if (genderPickerAreaIndex == 0) {
      varcharGender = 'male'
    }
    else if (genderPickerAreaIndex == 1) {
      varcharGender = 'female'
    }
    var params = {
      reg_name: formValue.reg_name.trim(),
      reg_phone: formValue.reg_phone.trim(),
      city: formValue.city.trim(),
      province: formValue.province.trim(),
      id: this.data.baseUser.ID,
      nickname: this.data.globalUserInfo.nickName,
      avatarUrl: this.data.globalUserInfo.avatarUrl,
      gender: varcharGender,
      age: formValue.age.trim()
    }
    this.updateUser(params)
  },
  genderChange: function (e){
    this.setData({
      genderPickerAreaIndex: e.detail.value
    })
  },
  updateUser: function (params) {
    var header = {}
    var updatecode = wxRequest.getRequest(this.data.serverUri + '/updateUser', params, header)
    var updateBaseUser = this.updateBaseUser
    updatecode.then(
      function (e) {
        if (e.data.code == -1) {
          console.log(e.data.error)
          wx.showToast({
            title: "服务器繁忙，请稍候再试",
            duration: 800,
            icon:'none'
          })
        } else {
          if (e.data.affectedRows == 1) {
            updateBaseUser(params)
            wx.showToast({
              title: "修改成功！",
              duration: 800
            })
          }
        }
      },
      function () {
        wx.showToast({
          title: "服务器繁忙，请稍候再试",
          duration: 800
        })
      }
    )
  },
  updateBaseUser: function (params) {
    this.setData({
      baseUser: {
        REG_NAME: params.reg_name,
        REG_PHONE: params.reg_phone,
        CITY: params.city,
        GENDER:params.gender,
        AGE:params.age,
        PROVINCE: params.province
      }
    })
    app.globalData.baseUser = this.data.baseUser
  },
  address:function(){
    getAddress(this.data.baseUser.ID, this.data.serverUri).then(function(data){
      if (data.statusCode == 200){
        var addressesData = data.data[0]
        wx.navigateTo({
          url: '../address/address?addressesData=' + JSON.stringify(addressesData)
        })
      }else{
        console.log(data)
      }
    })
  }
})

function getAddress(userid, serverUri){
  var useropenidJson = { userid: userid }
  return wxRequest.getRequest(serverUri + '/queryAllAddressesByUser', useropenidJson, {})
}