import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    palyMusicUrl: ' ',
    playTitle:' ',
    music:null,
    songDetail: null,
    playStatus: true,
    state: ' ',
  },
  playMusic: function () {
    // const music = wx.createInnerAudioContext()
    const music = wx.getBackgroundAudioManager()
    let that = this;
    that.setData({
      music: music
    });

    music.autoplay = true;
    music.src = this.data.palyMusicUrl;
    music.title=this.data.playTitle;
    // console.log(this.data.palyMusicUrl)
  
    
    music.onPlay(() => {
      that.setData({
        playStatus: true,
        state: ' '
      })
      this.setCurrentIndex();
    });
    music.onPause(() => {
      console.log('pause');
      that.setData({
        playStatus: false,
        state: 'paused'
      })
    });
    music.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

  },
  playOrpause: function() {
    // var that =this;
    if (this.data.playStatus) {
      this.data.music.pause();
      // console.log(this.data.playStatus);


    } else {
      // console.log(this.data.playStatus);
      this.data.music.play();
    }
  },
  onLoad: async function (options) {
    // console.log(options.title);
    // const url = `/song/detail?ids=${options.id}`;
    const url = `/song/url?id=${options.id}`;
    const res = await request.get(url);
    const res_songDetail= await request.get(songDetail);
    // const palyMusicUrl = res.data.data[0].url;
    //  console.log(res_lyric.data.lrc.lyric);
    //  console.log(res_songDetail.data.songs);
    this.setData({
      palyMusicUrl: res.data.data[0].url,
      playTitle: options.title,
      songDetail: res_songDetail.data.songs[0]
    });
    
     this.playMusic();
     this.dealLrc();
     
    // console.log(res.data);
    // this.time();
  }
})