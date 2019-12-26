// components/lyric/lyric.js
let lyricHeight = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false,
    },
    lyric: String,
  },

  //组件数据字段监听器，用于监听 properties 和 data 的变化
  observers: {
    lyric(lrc){
      if(lrc == '暂无歌词'){
        this.setData({
          lrcList: [
            {
              lrc,
              time: 0,
            }
          ],
          nowLyricIndex: -1
        })
      }else {
        this._parseLyric(lrc)
      }
      // console.log(lrc)
      // this._parseLyric(lrc)
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    lrcList: [],
    nowLyricIndex: 0, //当前选中歌词的索引
    scrollTop: 0, //表示滚动条滚动的高度
  },

  //在lifetimes定义一个生命周期函数
  lifetimes: {
    ready(){
      //750rpx
      wx.getSystemInfo({
        success: function(res) {
          console.log(res)
          //screenWidth属性：获取屏幕宽度，单位px 
          //获取一行歌词的高度
          lyricHeight = res.screenWidth / 750 * 64
        },
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //实现歌词和歌曲时间相对应
    update(currentTime){
      console.log(currentTime)
      let lrcList = this.data.lrcList
      if(lrcList.length == 0){
        return
      }
      if (currentTime > lrcList[lrcList.length - 1].time) {
        if(this.data.nowLyricIndex != -1){
          this.setData({
            nowLyricIndex: -1,
            scrollTop: lrcList.length * lyricHeight,
          })
        }
      }
      for(let i = 0, len = lrcList.length; i<len; i++){
        if(currentTime <= lrcList[i].time){
          this.setData({
            nowLyricIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight
          })
          break
        }
      }
    },
    //解析歌词
    _parseLyric(sLyric){
      let line = sLyric.split('\n')
      // console.log(line)
      let _lrcList = []
      //循环遍历
      line.forEach((elem) => {
        let time = elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if (time !=null){
          let lrc = elem.split(time)[1]
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          // console.log(timeReg)
          //把时间转换成秒
          let time2Seconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) /1000
          _lrcList.push({
            lrc,
            time: time2Seconds,
          })
        }
      })
      this.setData({
        lrcList: _lrcList
      })
    }
  }
})
