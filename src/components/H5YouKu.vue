<template>
  <div>
    <video-player class="video-player vjs-custom-skin"
                  ref="videoPlayer"
                  :playsinline="true"
                  :options="playerOptions"
    ></video-player>
  </div>

</template>

<script>
  export default {
    name: "H5YouKu",
    data() {
      return {
        msg: "一定可以",
        listData:[]
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
        //     src: "https://oss-jz.oss-cn-beijing.aliyuncs.com/bn2c/video/h5visual/banni.mp4"
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
    mounted(){
      this.$axios.get('/api/advance/getVideoList?pageNum=1&pageSize=10')
        .then(resp=>{
          console.log(resp)
          if(resp.code===200){
            this.listData=resp.data;
            console.log(resp.data)
            console.log(resp.data.data[0])
            for(let i=0;i<this.listData.length;i++){
              let arrs= {
                playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                autoplay: false, //如果true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                preload:'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '4:3', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [{
                  type: "video/mp4",//这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
                  src: resp.data.data[i]
                  // src: "http://1255423799.vod2.myqcloud.com/36c90d91vodcq1255423799/ac94ac665285890800080406198/7aGEzFsIRDwA.mp4"
                }
                ],
                poster: "../../static/images/test.jpg", //你的封面地址
                width: document.documentElement.clientWidth, //播放器宽度
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                  timeDivider: true,
                  durationDisplay: true,
                  remainingTimeDisplay: false,
                  fullscreenToggle: true  //全屏按钮
                }
              }
            }
          }
        })
        .catch(error=>{
          console.log(error)
        })
    },
    components: {},
  }
</script>

<style scoped>
  /*h1, h2 {*/
  /*font-weight: normal;*/
  /*}*/
  .video-js .vjs-icon-placeholder {
    width: auto;
    height: auto;
    display: block;
  }


</style>
