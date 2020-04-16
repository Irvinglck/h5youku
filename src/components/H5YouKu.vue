<template>
  <div>

    <ul class="ul-pieces">
      <li class="pieces-li">
        聊一下关于lck很帅这件小事
      </li>
      <li class="pieces-li pieces-li-list" v-for=" (item,index) in videoList " :key="index">
        <h1>
          <video-player class="video-player vjs-custom-skin"
                        ref="videoPlayer"
                        :playsinline="true"
                        :options="playerOptions[index]"
                        @play="onPlayerPlay($event,index)"
          ></video-player>
        </h1>
        <div>
          <p class="list-des">
            <span class="list-des-content">{{item.videoName}}</span>
            <span class="list-des-points"  >
              <img @click="shareHandler()" src="../../static/images/share.png">
              <mt-popup class="popup-alter" v-model="popupVisible" position="bottom" closeOnClickModal="false" v-show="popupVisible">
                  <Slot class="icon-share-slot">
                    <div class="slot-title content">分享</div>
                    <hr>
                    <div class="slot-list">
                        <span class="slot-li"><img class="slot-li-img" @click="shareUtils(item)" src="../../static/images/share/white/QQ好友.png"></span>
                        <span class="slot-li"><img class="slot-li-img" @click="shareUtils(item)" src="../../static/images/share/white/QQ空间.png"></span>
                        <span class="slot-li"><img class="slot-li-img" @click="shareUtils(item)" src="../../static/images/share/white/微信好友.png"></span>
                        <span class="slot-li"><img class="slot-li-img" @click="shareUtils(item)" src="../../static/images/share/white/微博.png"></span>
                        <span class="slot-li"><img class="slot-li-img" @click="shareUtils(item)" src="../../static/images/share/white/朋友圈.png"></span>
                    </div>
                     <hr>
                    <div class="slot-cancel content" @click="shareHandler()" >取消</div>
                  </Slot>
              </mt-popup>
            </span>
          </p>
        </div>
      </li>
    </ul>

  </div>

</template>

<script>
  import Vue from 'vue'
  import {Popup} from 'mint-ui'

  Vue.component(Popup.name, Popup)
  export default {
    name: 'H5YouKu',
    data () {
      return {
        popupVisible: false,//分享弹窗
        playerOptions: [],//播放列表
        videoList: [],//播放数据

        debug: true, // 开启调试模式
        appId: '', // 必填，公众号的唯一标识
        timestamp: '', // 必填，生成签名的时间戳
        nonceStr: '', // 必填，生成签名的随机串
        signature: '',// 必填，签名
        // playerOptions: {
        //   playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        //   autoplay: false, //如果true,浏览器准备好时开始回放。
        //   muted: false, // 默认情况下将会消除任何音频。
        //   loop: false, // 导致视频一结束就重新开始。
        //   preload:'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        //   language: 'zh-CN',
        //   aspectRatio: '4:3', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        //   fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        //   sources: [{
        //     type: "video/mp4",//这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
        //     src: ""
        //     // src: "https://oss-jz.oss-cn-beijing.aliyuncs.com/bn2c/video/h5visual/banni.mp4"
        //     // src: "http://1255423799.vod2.myqcloud.com/36c90d91vodcq1255423799/ac94ac665285890800080406198/7aGEzFsIRDwA.mp4"
        //   }
        //   ],
        //   poster: "../../static/images/test.jpg", //你的封面地址
        //   width: document.documentElement.clientWidth, //播放器宽度
        //   notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        //   controlBar: {
        //     timeDivider: true,
        //     durationDisplay: true,
        //     remainingTimeDisplay: false,
        //     fullscreenToggle: true  //全屏按钮
        //   }
        // }
      }
    },
    mounted () {
      this.$axios.get('/api/advance/getVideoList1?pageNum=1&pageSize=10')
        .then(resp => {
          console.log('location.href.split(\'#\')[0]----->', location.href.split('#')[0])
          console.log(resp)
          if (resp.data.code === 200) {
            this.videoList = resp.data.data
            console.log('this.videoList-----', this.videoList)
            for (let i = 0; i < this.videoList.length; i++) {
              let arrStr = {
                playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                autoplay: false, //如果true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [{
                  type: 'video/mp4',//这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
                  src: this.videoList[i].videoUrl,
                  // src: "https://oss-jz.oss-cn-beijing.aliyuncs.com/bn2c/video/h5visual/banni.mp4"
                  // src: "http://1255423799.vod2.myqcloud.com/36c90d91vodcq1255423799/ac94ac665285890800080406198/7aGEzFsIRDwA.mp4"
                }
                ],
                // poster: '../../static/images/test.jpg', //你的封面地址
                poster: this.videoList[i].thumbnail, //你的封面地址
                width: document.documentElement.clientWidth, //播放器宽度
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                  timeDivider: true,
                  durationDisplay: true,
                  remainingTimeDisplay: false,
                  fullscreenToggle: true  //全屏按钮
                }
              }
              this.playerOptions.push(arrStr)
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    methods: {
      //只允许播放一个视频
      onPlayerPlay (player, index) {
        let videoPlayerList = this.$refs.videoPlayer
        for (let i = 0; i < videoPlayerList.length; i++) {
          if (i != index) {
            videoPlayerList[i].player.pause()
          }
        }
      },
      //分享弹窗
      shareHandler () {
        this.popupVisible = !this.popupVisible
      },
      shareUtils (item) {
        this.popupVisible=false;
        console.log('item----------------->', item)
        this.$axios.get('/api/advance/getSignature1?url' + location.href.split('#')[0])
          .then(resp => {
            if (resp.data.data === 200) {
              localStorage.setItem('jsapi_ticket', resp.data.data.jsapi_ticket),
                this.appId = resp.data.data.appId, // 必填，公众号的唯一标识
                this.timestamp = resp.data.data.timestamp, // 必填，生成签名的时间戳
                this.nonceStr = resp.data.data.nonceStr, // 必填，生成签名的随机串
                this.signature = resp.data.data.signature// 必填，签名
              wx.config({
                debug: true,// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: this.appId,         // 必填，公众号的唯一标识，填自己的！
                timestamp: this.timestamp, // 必填，生成签名的时间戳，刚才接口拿到的数据
                nonceStr: this.nonceStr,   // 必填，生成签名的随机串
                signature: this.signature, // 必填，签名，见附录1
                jsApiList: [
                  'onMenuShareTimeline',
                  'onMenuShareAppMessage'
                ]
              })
              wx.ready(() => {
                //分享到朋友圈
                wx.onMenuShareTimeline({
                  title: item.videoName,   // 分享时的标题
                  link: item.videoUrl,     // 分享时的链接
                  imgUrl: item.thumbnail,    // 分享时的图标
                  success: function () {
                    console.log('分享成功')
                  },
                  cancel: function () {
                    console.log('取消分享')
                  }
                })
                wx.onMenuShareAppMessage({
                  title: '警句',
                  desc: '天狂比有雨，人狂必有祸，高调做事，低调做人',//'这件商品终于优惠了，每件只需'+pri_fx+'元',
                  link: '',
                  imgUrl: '',
                  type: '',
                  dataUrl: '',
                  success: function () {
                    console.log('分享成功')
                  },
                  cancel: function () {
                    console.log('取消分享')
                  }
                })
              })

            }
          }).catch(error => {
          return
        })
      }
    },
    components: {},
  }
</script>

<style scoped>
  /*h1, h2 {*/
  /*font-weight: normal;*/
  /*}*/
  .icon-share-slot{
    display: flex;
    flex-direction: column;
  }
  .content{
    width:58px;
    height:28px;
    font-size:30px;
    font-family:"PingFang SC", "Helvetica Neue", "Hiragino Sans GB", "Segoe UI", "Microsoft YaHei", "微软雅黑", sans-serif;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:45px;
  }
  .slot-list{
    display: flex;
    flex-direction: row;
    margin-right: 37px;
    margin-left: 45px;

  }
  .slot-li{

  }
  .slot-li-img{
    width: 50px;
    height: 50px;
  }
  .video-js .vjs-custom-skin {
    width: auto;
    height: auto;
    display: block;
  }

  .ul-pieces .pieces-li {
    padding: 0;
    margin: 0;
    list-style: none;
  }


</style>
