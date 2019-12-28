// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow: Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGotUserInfo(event) {
      console.log(event)
      const useInfo = event.detail.userInfo
      //允许授权
      if (useInfo) {
        this.setData({
          modalShow: false
        })
        this.triggerEvent('loginsuccess', useInfo)
      } else {
        this.triggerEvent('loginfail')
      }
    }
  }
})