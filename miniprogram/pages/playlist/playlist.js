// pages/playlist/playlist.js
const MAX_LIMIT = 15
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrls: [{
      url: 'http://a1.qpic.cn/psc?/V102yepq3ijS35/NsnpM1uFKDYfpy9CWgdxx56ZJtH4*zeIXemoSSyqJ8fkhFqYAOd6IZnx7CT5yU9tShL*DAh.4KFKZkSij8Kqqw!!/m&ek=1&kp=1&pt=0&bo=gAc4BIAHOAQRGS4!&tl=3&vuin=1733865392&tm=1578132000&sce=60-4-3&rf=0-0',
      },
      {
        url: 'http://m.qpic.cn/psc?/V102yepq3ijS35/ETWql2gUF22pNmiMBc.OAWL3vtdDCjSQIuosTq.Lh4J9efyyghrjZ4pUOoEgXZMIySJI*vuA5bu2DxVW8iGll8se8te.zY58..vWdVV8430!/b&bo=uQM0ArkDNAIRGS4!&rf=viewer_4',
      },
      {
        url: 'http://m.qpic.cn/psc?/V102yepq3ijS35/ETWql2gUF22pNmiMBc.OARg.GxxKT9osE0nIh5SkYrviRwdesTuUp4x4F4JaNOYTCADD2Vby4tWXo4ogKlVBgu6lEFhEoZfWrws8Udk3FUA!/b&bo=gAc4BIAHOAQRGS4!&rf=viewer_4',
      }
    ],
    playlist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._getPlaylist()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      playlist: []
    })
    this._getPlaylist()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this._getPlaylist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  _getPlaylist() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        start: this.data.playlist.length,
        count: MAX_LIMIT,
        $url: 'playlist', 
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        // playlist: res.result.data
        playlist: this.data.playlist.concat(res.result.data)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  }
})
