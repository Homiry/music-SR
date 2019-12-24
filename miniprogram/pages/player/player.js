//获取从pages/miusiclist中获取的缓存数据
let musiclist = []

//正在播放歌曲的index
let nowPlayingIndex = 0
//获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false,  //false表示不播放
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // console.log(options)
      nowPlayingIndex = options.index
      musiclist = wx.getStorageSync('musiclist')
    //把实参传到下面去
    this._loadMusicDetail(options.musicId)
  },

  _loadMusicDetail(musicId){

    //下面的方法实现切换时先停止上一首再加载下一首的优化效果
    backgroundAudioManager.stop()

    let music = musiclist [nowPlayingIndex]
    console.log(music)
    wx.setNavigationBarTitle({
      title: music.name,
    })
    
    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false,
    })

    wx.showLoading({
      title: '歌曲加载中',
    })

    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'musicUrl',
        //前面的是event.musicId。后面的是传递给形参的实参数据（ES6的语法：前后两者即属性名和属性值一样可以简写为musicId）
        musicId: musicId,
      }
    }).then((res) => {
      console.log(res)
      console.log(JSON.parse(res.result))
      //
      let result = JSON.parse(res.result)
      backgroundAudioManager.src = result.data[0].url
      backgroundAudioManager.title = music.name
      backgroundAudioManager.coverImgUrl = music.al.picUrl
      backgroundAudioManager.singer = music.ar[0].name
      backgroundAudioManager.epname = music.al.name

      this.setData({
        isPlaying: true
      })
      wx.hideLoading()
    })
  },

  togglePlaying(){
    //如果正在播放ing
    if (this.data.isPlaying){
      backgroundAudioManager.pause()
    }else{
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },

  onPrev(){
    nowPlayingIndex--
    if (nowPlayingIndex < 0){
      nowPlayingIndex = musiclist.length - 1
    }
    //调用_loadMusicDetail（）方法
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },
  onNext(){
    nowPlayingIndex++
    if (nowPlayingIndex === musiclist.length){
      nowPlayingIndex = 0
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
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

  }
})