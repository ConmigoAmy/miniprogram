import request from '../../utils/request'
import PubSub from 'pubsub-js';
// pages/index/index.js
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      bannerList:[],//轮播图数据
      recommendList:[],//推荐歌单
      topList:[],//排行榜
      albumListData:[],//轮播图专辑数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let bannerListData=await  request('/banner',{type:1})
    let bannerListData1=bannerListData.banners.filter(item=>item.targetType!=3000)
    this.setData({
      bannerList:bannerListData1
    })
    let recommendListData=await request('/personalized',{limit:10})
    this.setData({
      recommendList:recommendListData.result
    })
    // 排行榜
    let index=0;
    let resultArr=[];
    while(index<5){
      let topListData=await request('/top/list',{idx:index++})
      let topListItem={
        name:topListData.playlist.name,
        tracks:topListData.playlist.tracks.slice(0,3),
        // splice会修改原数组
        // slice不会修改原数组
      }
      resultArr.push(topListItem)
      this.setData({
        topList:resultArr
      })
      // 边获取数据边存储数据,会增加渲染次数但是用户体验较好
    }
    // 对idx的分析:1.不同的idx会返回不同的数据
    // idx的取值范围:0-20 我们需要0-4,所以需要发送5次请求
  },
  // 去往排行榜详情歌曲
  toDetail(event){
    console.log(event)
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?id='+event.currentTarget.dataset.id,
    })
  },
  // 获取轮播图内容
  async getAlbum(event){
      if(event.currentTarget.dataset.targettype==10){
        // 专辑
        // PubSub.publish('fromBannerList',true)
        appInstance.globalData.isAlbum=true
        wx.navigateTo({
          url: '/pages/recommend/recommend',
      
          success:(res)=>{
            res.eventChannel.emit('acceptDataFromOpenerPage', { 
              'id': event.currentTarget.dataset.id
              // 'targetType': event.currentTarget.dataset.targettype
            })
          }
        })
      }else if(event.currentTarget.dataset.targettype==1){
        // 单曲
        wx.navigateTo({
          url: '/pages/songDetail/songDetail?id='+event.currentTarget.dataset.id,
      
          // success:(res)=>{
          //   res.eventChannel.emit('DataTosongDetail', { 
          //     'id': event.currentTarget.dataset.id
          //   })
          // }
        })
      }
      // else{
      //   wx.showModal({
      //     // cancelColor: 'cancelColor',
      //     title:'抱歉',
      //     content:'由于没找到对应接口，该功能暂不开放'
      //   })
      // }
  
  },
// 去往推荐歌单内容
  async toPlayList(event){
    console.log(event,event.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/recommend/recommend?playListId='+event.currentTarget.dataset.id,
    })
  },
  
  // 前往私人FM,后来更改为视频
  // pages/personalFM/personalFM
  toPersonalFM(){
    wx.navigateTo({
      url: '/pages/boke/boke',
    })
  },

  // 前往音乐搜索
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  // 前往歌单
  toGedan(){
    wx.navigateTo({
      url: '/pages/gedan/gedan',
    })
  },
  // 前往每日推荐

  toRecommend(){
    wx.navigateTo({
      url: '/pages/recommend/recommend',
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