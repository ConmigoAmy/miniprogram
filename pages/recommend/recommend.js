// pages/recommend/recommend.js
import PubSub from 'pubsub-js';
import request from '../../utils/request'
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    month:'',
    recommendListData:[],
    index:0,//点击音乐的下标
    isAlbum:false,//轮播图专辑标识
    picUrl:'',//轮播图封面
    // blurPicUrl:''
    // playListData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      isAlbum:false
    })
    // 判断用户是否登录
    let userInfo=wx.getStorageSync('userInfo');
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon:'none',
        success:()=>{
             wx.navigateTo({
                 url:'/pages/login/login'
              })
        }
      })
    }
    // 更新日期状态
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth()+1
    })
    if(appInstance.globalData.isAlbum){
      let that = this
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.on('acceptDataFromOpenerPage', function(itemObject) {
        that.getAlbum(itemObject)
  
      })
      appInstance.globalData.isAlbum=false
    // }else{
    }else if(options.playListId){
      // 获取歌单详情
      this.getPlayListData(options.playListId)
    }
    else{
    this.getRecommendListData()
    }


    // 订阅来自songDetail页面发布的消息
    PubSub.subscribe('switchType',(msg,type)=>{
      let {recommendListData,index}= this.data;
      if(type==='pre'){{
        (index === 0 )&&(index = recommendListData.length)
        index-=1
      }}else{
        (index ===  recommendListData.length-1)&&(index = -1)
        index+=1
      }
      // 更新新的下标
      this.setData({
        index
      })
      let musicId=recommendListData[index].id;
      // 最后再将音乐id回传给songDetail页面
      PubSub.publish('musicId',musicId)
    })
  // }
  },
  
    // 获取歌单详情
    async getPlayListData(id){
      let playListData = await request('/playlist/detail',{id})
      console.log(playListData)
      this.setData({
        recommendListData:playListData.playlist.tracks,
        picUrl:playListData.playlist.coverImgUrl,
        isAlbum:true
      })
    },
    // 获取轮播图具体数据
    async getAlbum(itemObject){
      // 专辑
      let albumListData = await request('/album',{id:itemObject.id})
      // 在这里一定要注意的是通过emit传递过来的参数数据类型是对象
      this.setData({
        recommendListData:albumListData.songs,
        picUrl:albumListData.album.picUrl,
        isAlbum:true
        // blurPicUrl:albumListData.blurPicUrl
      })
 
 },
  // 跳转到歌曲详情页
  toSongDetail(event){
    // let song = event.currentTarget.dataset.song;
    let index = event.currentTarget.dataset.index;
    this.setData({
      index
    })
    // 路由传参，支持query传参方式，但是需要注意的是在路由中不允许有js的对象或者数组的，如果有，会自动使用Object.toString()方法将它强行转换成字符串

    wx.navigateTo({
      // url: '/pages/songDetail/songDetail?song='+JSON.stringify(song),
      url: '/pages/songDetail/songDetail?id='+event.currentTarget.dataset.id,
    })
  },
// 获取每日推荐
   async getRecommendListData(){
    let recommendListData=await request('/recommend/songs')
      this.setData({
        recommendListData:recommendListData.recommend
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

  }
})