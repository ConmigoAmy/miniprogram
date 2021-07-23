// pages/songDetail/songDetail.js
// 获取全局实例
import PubSub from 'pubsub-js';
import moment from "moment";
import request from '../../utils/request'
const appInstance = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,//标识音乐的播放状态
    song:{},//歌曲详情对象
    musicId:'',
    musicLink:'',//音乐的链接
    currentTime:'00:00',//实时时长
    durationTime:'00:00',//总时长
    currentWidth:0,//实时进度条的宽度
    isLyric:false,//是否歌词页
    lyrics:[],
    lyricsTime:[],
    currentIndex:0,
    currentIndexMax:0,


    storyContent:[],
    marginTop:0,
    currentIndex222:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    // options:用来接收路由query传参的参数
    // console.log(options,JSON.parse(options.song))
    // 此时的options要转回js对象
    // 原生小程序中，路由传参要注意参数的长度。如果参数过长会自动截取掉。
    this.setData({
      musicId:options.id
    })
    this.getMusicInfo(options.id)
     // 自动播放
     this.musicPlay()
    //  this.getLyric()
    // 判断当前选中的音乐是否在播放
    // console.log(appInstance.globalData.isMusicPlay,appInstance.globalData.musicId)
    if(appInstance.globalData.isMusicPlay&&appInstance.globalData.musicId===this.data.musicId){
      // 修改当前页面音乐播放状态
      this.setData({
        isPlay:true
      })
    }


    // 解决问题：操作后台/系统的播放/暂停的时候 小程序检测不到实际状态
    // 监听音乐播放/暂停/停止/结束
    this.backgroundAudioManager= wx.getBackgroundAudioManager();
    this.backgroundAudioManager.onPlay(()=>{
       this.changePlayState(true)
      //  去修改全局音乐实例的状态
      // debugger
      appInstance.globalData.musicId=this.data.musicId;
      // this.setCurrentIndex();
    })
    this.backgroundAudioManager.onPause(()=>{
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onStop(()=>{
      this.changePlayState(false)
    })
    // 音乐自动结束
    this.backgroundAudioManager.onEnded(()=>{
      // 切换到下一首音乐，并且自动播放
      PubSub.publish('switchType','next')
      this.setData({
        currentWidth:0,
        currentTime:'00:00'

      })
    })
    // 监听音乐实时播放进度
    this.backgroundAudioManager.onTimeUpdate(()=>{
      // console.log('总时长',this.backgroundAudioManager.duration)
      // console.log('实时时长',this.backgroundAudioManager.currentTime)
      // 注意时间单位是s
      // console.log(this.backgroundAudioManager,Math.floor(Number(this.backgroundAudioManager.currentTime)))
      let currentTime= moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss')
      let currentWidth = (this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration)*450
      // console.log(Number(currentTime),Math.floor(Number(this.backgroundAudioManager.currentTime)),Math.ceil(Number(this.backgroundAudioManager.currentTime)))
      this.setData({
        currentIndex:Math.floor(Number(this.backgroundAudioManager.currentTime)),
        currentIndexMax:Math.ceil(Number(this.backgroundAudioManager.currentTime)),
        currentTime,
        currentWidth,
      })

      let that = this
      if (that.data.currentIndex222 >= 6) {//超过6行开始滚动
        that.setData({
          marginTop: (that.data.currentIndex222 - 6) * 20
        })
      }
      // 文稿对应行颜色改变
      if (that.data.currentIndex222!=that.data.storyContent.length - 1){//
        var j = 0;
        for (var j = that.data.currentIndex222; j < that.data.storyContent.length; j++) {
          // 当前时间与前一行，后一行时间作比较， j:代表当前行数
          if (that.data.currentIndex222 == that.data.storyContent.length - 2) {
           //最后一行只能与前一行时间比较
            if (parseFloat(that.backgroundAudioManager.currentTime) > parseFloat(that.data.storyContent[that.data.storyContent.length - 1][0])) {
              that.setData({
                currentIndex222: that.data.storyContent.length - 1
              })
              return;
            }
          } else {
            if (parseFloat(that.backgroundAudioManager.currentTime) > parseFloat(that.data.storyContent[j][0]) && parseFloat(that.backgroundAudioManager.currentTime) < parseFloat(that.data.storyContent[j + 1][0])) {
              that.setData({
                currentIndex222: j
              })
              return;
            }
          }
        }
      }
  
  
    })
   
    
  },
    
  parseLyric: function (text) {
    // debugger
    let result = [];
    console.log(text)
    var lines = text.split('\n'), //切割每一行
       pattern =/\[\d{2}:\d{2}\.\d{2,}\]/g, //匹配时间的正则表达式

       
    //去掉不含时间的行
    // while(!pattern.test(lines[0])) {
      lines = lines.slice(0);
    // };
    //上面用'\n'生成数组时，结果中最后一个为空元素，这里将去掉
    lines[lines.length - 1].length === 0 && lines.pop();
    lines.forEach(function (v /*数组元素值*/, i /*元素索引*/, a /*数组本身*/) {
      //提取出时间[xx:xx.xx]
      var time = v.match(pattern),
        //提取歌词
        value = v.replace(pattern, '');
      // 因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
      if(time){
        // debugger
        time.forEach(function (v1, i1, a1) {
          //去掉时间里的中括号得到xx:xx.xx
          var t = v1.slice(1, -1).split(':');
          //将结果压入最终数组
          result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
        });
      }
    });
    //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
    result.sort(function (a, b) {
      return a[0] - b[0];
    });
    return result;
  },
  //去除空白
  sliceNull: function (lrc) {
    var result = []
    for (var i = 0; i < lrc.length; i++) {
      if (lrc[i][1] == "") {
      } else {
        result.push(lrc[i]);
      }
    }
    // debugger
    return result
  },






  // 更改状态
  getisLyric(){
    this.setData({
      isLyric:!this.data.isLyric
    })
  },
    // 获取歌词
    async getLyric(){
      let lrc = await request('/lyric',{id:this.data.musicId})
      console.log(lrc)
      let that = this;
      this.setData({
        storyContent: that.sliceNull(that.parseLyric(lrc.lrc.lyric))
      })
      // let arr = lrc.lrc.lyric.split("\n")
      // // console.log(arr)
      // let timeArr = [], lrcArr = [];
      // arr.forEach(function (item, index) {
      //   var time = item.slice(item.indexOf("["), item.indexOf("]") + 1);
      //   time = that.dealLrcTime(time);
      //   timeArr.push(time);
      //   var lrc = item.substr(item.indexOf("]") + 1)+"\n";
      //   lrcArr.push(lrc);
      // })
      // this.setData({
      //   // geciData:lrc.lrc.lyric
      //   lyrics: lrcArr,
      //   lyricsTime:timeArr
      // })
    },
    dealLrcTime(time) {
      time = time.replace("[", "");
      time = time.replace("]", "");
      var arr = time.split(":");
      var relTime = parseInt(arr[0]) * 60 + parseInt(arr[1]);
      return relTime;
    },
  // 专门封装一个特意用来控制播放状态的功能函数
  changePlayState(isPlay){
    this.setData({
      isPlay
    })
    appInstance.globalData.isMusicPlay=isPlay;
  },

  // 点击切歌的回调函数（上一首和下一首）
  handleSwitch(event){
    // 获取一下切歌的类型
    let type=event.currentTarget.id;
    // 关闭当前正在播放的音乐
    this.backgroundAudioManager.stop()
    PubSub.subscribe('musicId',(msg,musicId)=>{
      // console.log(2,msg,musicId)
      // 获取音乐的详情信息
      this.getMusicInfo(musicId)
      this.musicControl(true,musicId)


      // 取消消息订阅,解决执行多次的问题 
      PubSub.unsubscribe('musicId');
    })
    // 发布消息数据给recommend页面
    PubSub.publish('switchType',type)
  },
  // 获取音乐详情
  async getMusicInfo(ids){
    let songData= await request('/song/detail',{ids:ids})
    let durationTime = moment(songData.songs[0].dt).format('mm:ss')
    // moment传入的时间单位恰好是ms
    this.setData({
      song:songData.songs[0],
      durationTime
    }) 
    // 动态更新歌曲名称
    wx.setNavigationBarTitle({
      title:this.data.song.name
    })
  },
  // 点击播放/暂停的回调函数
  musicPlay(){
    let isPlay=!this.data.isPlay;
    // this.setData({
    //   isPlay
    // })
    // let {musicId} = this.data.musicId
    let {musicId,musicLink} = this.data;
    this.musicControl(isPlay, this.data.musicId,musicLink)
    // this.setCurrentIndex();
    this.getLyric()
   
  },
  // 控制歌词
  // setCurrentIndex(){
  //   // debugger
  //   var timeId=wx.getStorageSync("timeId");
  //   console.log(timeId)
  //   if(timeId){
  //     clearInterval(timeId);
  //   }
  //   // debugger
  //   if(this.data.lyrics.length>0){
  //     console.log(this.data.lyrics)
  //     // var audio = this.data.audio;
  //     // var duration = audio.duration;
  //     var timeArr = this.data.lyricsTime;
  //     var currentTime = -1;
  //     var that = this;
  //     timeId = setInterval(() => {
  //       currentTime = that.data.currentTime;
  //       console.log(currentTime,timeArr)
  //       // debugger
  //       var currentIndex =that.findCurrentIndex(currentTime, timeArr);
  //       console.log(currentIndex)
  //      this.setData({
  //         currentIndex
  //       });

  //     }, 2000);
  //     wx.setStorageSync("timeId", timeId);
  //   }
    
  // },
// 找到当前播放时间
  // findCurrentIndex(curTime,timeArr) {
  //   // debugger
  //   // var timeArr = this.data.lyricsTime;
  //   var index = -1;
  //   console.log(timeArr)
  //   for (let i = 0; i < timeArr.length; ++i) {
  //     if (timeArr[i] == NaN) {
  //       continue;
  //     }
  //     if (curTime <= timeArr[i]) {
  //       index = i;
  //       // debugger
  //       break;
  //     }
  //   }
  //   return index;
    
  // },

  // 控制音乐播放/暂停的功能函数
  async musicControl(isPlay,musicId,musicLink){
      // 音乐播放,创建音频实例对象,要注意的是这里的是背景音乐（就是会有后台播放的音乐）
    // let backgroundAudioManager= wx.getBackgroundAudioManager();
    if(isPlay){
      // 获取音乐的播放链接
     if(!musicLink){
      let musicLinkData=await request('/song/url',{id:musicId});
       musicLink=musicLinkData.data[0].url;
       this.setData({
        musicLink
       })
     }
      this.backgroundAudioManager.src=musicLink;
      this.backgroundAudioManager.title=this.data.song.name
      // 一定要记得backgroundAudioManager对象上设置了src之后还需要涉资title才可以正常进行播放
    }else{
      // 暂停播放
      this.backgroundAudioManager.pause()
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

  }
})