# miniprogram
# morningmusic
wx-miniprogram
2021-7-16  -  2021-7-23
仿网易云小程序，因为个人主体不允许上传音乐服务类小程序，所以上传到这儿来共勉。

# 项目采用网易云真实api：https://binaryify.github.io/NeteaseCloudMusicApi/ 

拉到代码以后，首先启动服务器：
# npm install

# npm start/node app.js
在项目里使用到了内网穿透，使用工具：钉钉，详细教程：https://www.it235.com/实用工具/内网穿透/pierce.html#钉钉穿透（简单）
# 启动内网穿透代码：ding.exe -config=./ding.cfg -subdomain=morningmusic 3000   （名字可自行设定，端口冲突的话需要去服务器更改哦）
PS.假设你不想使用内网穿透，可以在代码中找到/utils/config.js，在这里设置了两个url： 
  host:'http://localhost:3000',
  mobileHost:'http://morningmusic.vaiwan.com'
  内网穿透使用的第二个。你可以将/utils/request.js中28行的mobileHost更改为host即可不使用内网穿透。
  
  首页：
  ![image](https://user-images.githubusercontent.com/37031800/126748708-c170f23e-634f-4ea4-b79f-d06f9349d99f.png)
  视频：
  ![image](https://user-images.githubusercontent.com/37031800/126749377-7f470d35-6303-4db2-bfd6-63e185b9f446.png)（可以真实播放）
  搜索歌曲：
  ![image](https://user-images.githubusercontent.com/37031800/126749429-14d439df-ef28-4c83-a64f-37212fa9e74d.png)
![image](https://user-images.githubusercontent.com/37031800/126749505-2984e775-29cd-48c5-bee7-569fdfb60282.png)


  歌曲详情：
  ![image](https://user-images.githubusercontent.com/37031800/126748871-7f4d6861-a77f-4379-9475-f5cd7c9e1798.png)

  歌词：![image](https://user-images.githubusercontent.com/37031800/126749012-0f838841-255e-4589-9c8f-26b124f70d18.png)
  登录：![image](https://user-images.githubusercontent.com/37031800/126749054-c42aaad9-8eea-4f2d-b0f5-0a865ce78a2c.png)
  
  由于真机调试延迟有点久，下面的图片使用开发工具页面截图
  推荐：![image](https://user-images.githubusercontent.com/37031800/126749209-f4dea788-01d3-46f4-949b-bded621a3c74.png) 推荐页面实现了上一首下一首播放
  歌单：![image](https://user-images.githubusercontent.com/37031800/126749326-dc63f7a8-f7ff-4824-b2d7-547ca61ee562.png)
  
  等等。
