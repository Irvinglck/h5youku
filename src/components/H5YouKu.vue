<template>
  <div class="youku">
<!--    <button @click="changeDake()">切换按钮</button>-->
    <ul class="ul-pieces">
      <li class="pieces-li" v-for=" (item,index) in videoList " :key="index">
        <div class="videoWrap">
          <video-player class="video-player vjs-custom-skin"
                        ref="videoPlayer"
                        :playsinline="true"
                        :options="playerOptions[index]"
                        @play="onPlayerPlay($event,index)"

          ></video-player>
        </div>
        <div class="titleWrap">
          <p class="list-des">
            <em>[伴你无碍]</em><span class="list-des-content">{{item.videoName}}</span>
          </p>
          <span class="list-des-points">
            <img @click="shareHandler(item)" src="../../static/images/share.png">
          </span>
        </div>
      </li>
    </ul>
<!--    <mt-popup class="popup-alter" v-model="popupVisible" position="bottom" closeOnClickModal="false"-->
<!--              v-show="popupVisible">-->
<!--      <Slot class="icon-share-slot">-->
<!--        <div class="slot-title">分享</div>-->
<!--        <div class="slot-list">-->
<!--          <div class="slot-li">-->
<!--            <img class="slot-li-img" @click="shareUtils(item)"-->
<!--                 src="../../static/images/share/white/微信好友.png">-->
<!--          </div>-->
<!--          <div class="slot-li">-->
<!--            <img class="slot-li-img" @click="shareUtils(item)"-->
<!--                 src="../../static/images/share/white/朋友圈.png">-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="slot-cancel" @click="shareHandler()">取消</div>-->
<!--      </Slot>-->
<!--    </mt-popup>-->
  </div>

</template>

<script>
  import Vue from 'vue'
  import {Popup} from 'mint-ui'
  import wx from 'weixin-js-sdk'
  import darken from 'darken';

  Vue.component(Popup.name, Popup)
  export default {
    name: 'H5YouKu',
    data () {
      return {
        popupVisible: false,//分享弹窗
        playerOptions: [],//播放列表
        videoList: [],//播放数据
        appId: '', // 必填，公众号的唯一标识
        timestamp: '', // 必填，生成签名的时间戳
        nonceStr: '', // 必填，生成签名的随机串
        signature: '',// 必填，签名
        temp:false,
      }
    },
    created(){
      //挂在方法提供ios使用
      window.changeTheme=this.changeTheme;
      window.stopVideo=this.stopVideo;
    },
    mounted () {
      this.$axios.get('/api/advance/getVideoList?pageNum=1&pageSize=20')
        .then(resp => {
          console.log(resp)
          if (resp.data.code === 200) {
            this.videoList = resp.data.data
            console.log('this.videoList-----', this.videoList)
            for (let i = 0; i < this.videoList.length; i++) {
              let arrStr = {
                playbackRates: [], //播放速度0.7, 1.0, 1.5, 2.0
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
                  // src: "http://1255423799.vod2.myqcloud.com/36c90d91vodcq1255423799/ac94ac665285890800080406198/7aGEzFsIRDwA.mp4"
                }
                ],
                // poster: '../../static/images/test.jpg', //你的封面地址
                poster: this.videoList[i].thumbnail, //你的封面地址
                width: document.documentElement.clientWidth, //播放器宽度
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                  timeDivider: true,//true
                  durationDisplay: true,//true
                  remainingTimeDisplay: false,//false
                  fullscreenToggle: true  //全屏按钮true
                }
              }
              this.playerOptions.push(arrStr)
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
      //window.onscroll监听事件如何在页面离开时关闭
      // window.addEventListener('scroll', this.load)
      // window.addEventListener('scroll',()=>{
        // let scrollTop=document.documentElement.scrollTop||document.body.scrollTop ||document.querySelector('.element').scrollTop;
        // this.pageScroll()
        // console.log(scrollTop);
      // },true)
    },
    destroyed(){
      // window.removeEventListener('scroll', this.load);
      //浏览器切换
      // window.removeEventListener('webkitvisibilitychange', e => this.beforeunloadFn(e))
    },
    methods: {
      pageScroll(){
        let videoPlayerList = this.$refs.videoPlayer;
        for (let i = 0; i < videoPlayerList.length; i++) {
          videoPlayerList[i].player.pause()
        }
      },
      //ios暂停
      stopVideo(){
        let videoPlayerList = this.$refs.videoPlayer;
        for (let i = 0; i < videoPlayerList.length; i++) {
          videoPlayerList[i].player.pause()
        }
        return videoPlayerList.length;
      },
      //只允许播放一个视频
      onPlayerPlay (player, index) {
        let videoPlayerList = this.$refs.videoPlayer
        for (let i = 0; i < videoPlayerList.length; i++) {
          if (i != index) {
            videoPlayerList[i].player.pause()
          }
        }
      },
      //黑白切换
      changeTheme(flag){
          this.changeTemp(flag);
      },
      changeTemp(flag){
        const darkmode = new darken({
          variables: {
            "--sec-background-line" : ["#F7F8F9", "#3C3F41"],
            "--sec-background-font" : ["rgba(1,1,1,1)", "rgba(255,255,255,1)"],
            "--sec-background" : ["#F7F8F9", "#0C0C0C"],
          }
        });
        if(flag===1){
          darkmode.on()
        }else
          darkmode.off()

      },
      //分享弹窗
      shareHandler (item) {
        alert(JSON.stringify(item))
        let u = navigator.userAgent
        const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
        if (isiOS) {
          window.webkit.messageHandlers.sharewx.postMessage({"videoUrl":item.videoUrl,"thumbnail":item.thumbnail,"title":item.title,"videoName":item.videoName})
        } else {
          window.aj.runOnAndroidJavaScript(item.videoUrl,item.thumbnail,item.title,item.videoName)
        }
      },
      shareUtils1 (item) {
        this.popupVisible = false
        wx.checkJsApi({
          jsApiList: ['updateTimelineShareData', 'updateAppMessageShareData'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
          success: function (res) {
            alert('检测客户端版本是否支持指定JS接口' + JSON.stringify(res))
          }
        })
        this.$axios.get('/api/advance/getSignature?url=' + location.href.split('#')[0])
          .then(resp => {
            if (resp.data.code === 200) {
              alert('后台getSignature获取签名成功----->' + item.videoName + '--' + item.thumbnail + '----' + location.href.split('#')[0])
              localStorage.setItem('jsapi_ticket', resp.data.data.jsapi_ticket),
                this.appId = resp.data.data.appId, // 必填，公众号的唯一标识
                this.timestamp = resp.data.data.timestamp, // 必填，生成签名的时间戳
                this.nonceStr = resp.data.data.nonceStr, // 必填，生成签名的随机串
                this.signature = resp.data.data.signature// 必填，签名
              wx.config({
                appId: this.appId,         // 必填，公众号的唯一标识，填自己的！
                timestamp: this.timestamp, // 必填，生成签名的时间戳，刚才接口拿到的数据
                nonceStr: this.nonceStr,   // 必填，生成签名的随机串
                signature: this.signature, // 必填，签名，见附录1
                jsApiList: [
                  'updateAppMessageShareData',
                  'updateTimelineShareData'
                ]
              })
              wx.ready(() => {
                alert('wx.ready----this.appId-' + this.appId + '=this.timestamp=' + this.timestamp + '=this.nonceStr=' + this.nonceStr + '=this.signature=' + this.signature)
                //分享到朋友圈
                wx.updateTimelineShareData({
                  title: item.videoName,   // 分享时的标题
                  link: location.href.split('#')[0],     // 分享时的链接
                  imgUrl: item.thumbnail,    // 分享时的图标
                  success: function () {
                    alert('分享给朋友圈成功')
                  },
                  cancel: function () {
                    alert('分享给朋友圈失败')
                  }
                })
                //好友
                wx.updateAppMessageShareData({
                  title: item.videoName,
                  desc: '这是一个分享威微信好友的连接',//'这件商品终于优惠了，每件只需'+pri_fx+'元',
                  link: location.href.split('#')[0],
                  imgUrl: item.thumbnail,
                  type: video, //分享类型,music、video或link，不填默认为link
                  dataUrl: item.videoUrl,
                  success: function () {
                    alert('分享给朋友成功')
                  },
                  cancel: function () {
                    alert('分享给朋友成功')
                  }
                })
              })
              wx.error((res) => {
                alert('通过error接口处理失败验证------>' + res)
              })

            }
          }).catch(error => {
          alert('后台getSignature获取签名失败' + JSON.stringify(error))
        })
      }
    },
    components: {},
  }
</script>

<style scoped>
  html * {
    outline: 0;
    -webkit-text-size-adjust: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  body {
    font-size: 12px;
    font-family: 'Avenir,Microsoft YaHei', 'Helvetica', 'Simsun';
    background: #fff;
    color: #383E43;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
  }

  a, abbr, acronym, address, applet, article, aside, audio, b, big, blockquote, body,
  canvas, caption, center, cite, code, dd, del, details, dfn, div, dl, dt, em, embed,
  fieldset, figcaption,
  figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, html, i,
  iframe, img, ins, kbd, label, legend, li, mark, menu, nav, object, ol, output,
  p, pre, q, ruby, s, samp, section, small, span, strike, strong, sub, summary,
  table, tbody, td, tfoot, th, thead, time, tr, tt, u, ul, var,
  video, input, textarea {
    margin: 0;
    padding: 0;
    border: 0;
    vertical-align: baseline;
    word-wrap: break-word;
    background: transparent;
  }

  button, input, select, textarea {
    outline: none;
    border: none;
    background: none;
  }

  textarea {
    resize: none;
  }

  article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {
    display: block
  }

  li, ol, ul {
    list-style: none;
  }

  blockquote, q {
    quotes: none;
  }

  blockquote:after, blockquote:before, q:after, q:before {
    content: '';
    content: none;
  }

  b, strong {
    font-weight: 700;
  }

  i, em {
    font-style: normal;
  }

  img {
    vertical-align: middle;
    border: none;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: normal;
    font-size: 100%;
    line-height: 100%;
  }

  p {
    font-size: 100%;
    line-height: 100%;
  }

  a {
    color: #383E43;
    text-decoration: none;
    outline: none;
  }

  a:focus {
    outline: none;
  }

  a:active {
    border: none;
  }

  /*清浮动*/
  .clearfix:after {
    content: "";
    display: block;
    clear: both;
    height: 0;
  }

  .clearfix {
    zoom: 1;
  }

  a:link, a:hover, a:active, a:visited {
    text-decoration: none;
    border: none;
    outline: none;
  }
  .ul-pieces{
    background: var(--sec-background);
  }

  .pieces-li {
    /*border-bottom: 5px solid #ececec;*/
    border-bottom: 5px solid var(--sec-background-line);
    padding: 0 15px;
  }

  .videoWrap {
    height: 194px;
    width: 100%;
    margin-top: 15px;
  }

  .titleWrap {
    font-size: 16px;
    font-weight: bold;
    color: #010101;
    font-family: PingFang-SC;
    position: relative;
    height: 40px;
    text-align: left;
    margin: 10px 0 13px;
    letter-spacing: 2px;
  }

  .titleWrap .list-des {
    line-height: 20px;
    color: var(--sec-background-font);
  }

  .titleWrap .list-des em {
    padding-right: 9px;
  }

  .titleWrap .list-des-points {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  .titleWrap .list-des-points img {
    width: 3px;
    height: 15px;
  }

  .popup-alter {
    width: 100%;
    background: #fff;
    text-align: center;
  }

  .slot-title, .slot-cancel {
    line-height: 44px;
    font-size: 15px;
    color: #010101;
    border-bottom: 1px solid #F0EFF5;
  }

  .slot-list {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }

  .slot-list .slot-li {
    flex: 1;
  }

  .slot-list img {
    width: 45px;
    height: 45px;
  }

  .slot-cancel {
    border-bottom: none;
  }


</style>
