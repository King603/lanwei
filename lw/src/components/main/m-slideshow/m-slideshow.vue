<template>
  <view class="lunbo">
    <transition-group tag="ul" name="image" v-for="(href,index) in list" :key="index">
      <li :key="index" v-show="lunboIndex === index">
        <img :src="href" alt="#" />
      </li>
    </transition-group>
    <ul class="allbtn">
      <li
        v-for="(href,index) in list"
        :key="index"
        @click="changemark(index)"
        :class="{btncolor:btnNum===index}"
      ></li>
    </ul>
    <view class="leftbtn lunbobtn" @click="lunbo(-1)">{{left}}</view>
    <view class="rightbtn lunbobtn" @click="lunbo(1)">{{right}}</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      lunboIndex: 0,
      timer: null,
      btnNum: 0,
      jieliu: null,
      list: [
        "../../../static/slideshow/15997030153435087.jpg",
        "../../../static/slideshow/15997030155144010.jpg",
        "../../../static/slideshow/15997030158535490.jpg",
        "../../../static/slideshow/15997030163147931.jpg",
        "../../../static/slideshow/15997030164149198.jpg",
        "../../../static/slideshow/15997030166366239.jpg",
        "../../../static/slideshow/15997030166418974.jpg",
        "../../../static/slideshow/15997030167047529.jpg",
        "../../../static/slideshow/15997030169223234.jpg",
      ],
      left: "<",
      right: ">",
    };
  },
  methods: {
    stoplunbo() {
      clearInterval(this.timer);
      this.timer = null;
    },
    changemark(index) {
      this.stoplunbo();
      this.lunboIndex = index;
      this.btnNum = index;
      this.runlunbo();
    },
    lunbo(n) {
      // 防止用户狂点，加个函数节流
      this.stoplunbo();
      if (!this.jieliu) {
        this.jieliu = setTimeout(() => {
          this.lunboIndex += n;
          this.btnNum += n;
          switch (n) {
            case 1:
              if (this.lunboIndex >= this.list.length) {
                this.lunboIndex = 0;
                this.btnNum = 0;
              }
              break;
            case -1:
              if (this.lunboIndex < 0) {
                this.lunboIndex = this.list.length - 1;
                this.btnNum = this.list.length - 1;
              }
              break;
          }
          this.jieliu = null;
          this.runlunbo();
        }, 200);
      }
    },
    runlunbo() {
      this.timer = setInterval(() => {
        this.lunboIndex++;
        this.btnNum++;
        if (this.lunboIndex >= this.list.length) {
          this.lunboIndex = 0;
          this.btnNum = 0;
        }
      }, 3000);
    },
  },
  components: {},
  mounted() {
    let random = parseInt(Math.random() * this.list.length);
    this.lunboIndex = this.btnNum = random;
    this.runlunbo();
  },
};
</script>

<style scoped>
.lunbo {
  position: relative;
  width: 100%;
  height: 100px;
  overflow: hidden;
}
.lunbo img {
  display: block;
  width: 100%;
  height: 100px;
  position: absolute;
}
.lunbo .allbtn {
  position: absolute;
  bottom: 20px;
  left: calc(50% - 150px);
}
.lunbo .allbtn li {
  width: 10px;
  height: 10px;
  margin-right: 20px;
  background:rgba(255, 255, 255, 0.5);
  float: left;
  border-radius: 50%;
  opacity: 0.8;
  cursor: pointer;
}
.lunbo .allbtn .btncolor {
  background: #fff;
}
.lunbo .lunbobtn {
  position: absolute;
  width: 20px;
  height: 50px;
  font-size: 20px;
  line-height: 45px;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0.5;
  top: 25px;
  text-align: center;
  cursor: pointer;
}
.lunbo .rightbtn {
  right: 0;
}
.lunbo .image-enter-active {
  /* 过渡 */
  /* transform: translateX(0); */
  transition: all 0.5s ease;
}
.lunbo .image-leave-active {
  /* 过渡 */
  /* transform: translateX(-100%); */
  transition: all 0.5s ease;
}
.lunbo .image-enter {
  /* 开始进入动画的位置 */
  transform: translateX(100%);
}
.lunbo .image-leave-to {
  /* 结束消失的位置 */
  transform: translateX(-100%);
}
</style>