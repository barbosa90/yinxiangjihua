class toastLayer {
  constructor() {
  }

  toastSafe_short(title) {
    return new Promise((resolve, reject) => {
      wx.showToast({
        mask: true,
        title: title,
        icon: 'none',
        duration: 500
      })
    })
  }

  toastSafe_normal(title) {
    return new Promise((resolve, reject) => {
      wx.showToast({
        mask: true,
        title: title,
        icon: 'none',
        duration: 2000
      })
    })
  }
}

export default toastLayer