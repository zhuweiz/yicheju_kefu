<template>
	<header class="w-100 h-100 flex">
		<div class="" style="width: 402px;min-width: 402px;">
			<img src="../../../static/img/login.png" />
		</div>
    <div class="rel" style="height:95px;width:100%">
      <!-- <div class="abs text-center" style="width:141px;height:46px;line-height:46px;top:23px;left:-32px; background:url(../../../static/img/topselectBg.png) no-repeat;">快速切换</div> -->
      <div class="abs text-center b-0" style="width:59px;height:20px;left:15%; background:url(../../../static/img/carBg.png) no-repeat;"></div>
			<div class="right p-t-25 p-r-30">
        <a class="right white r-100 block iconfont icon-guanji text-center f-26 c-p" style="width:46px;height:46px;line-height:46px;color:#FF6161;" @click="toLogin()"></a>
        <a class="right white r-100 block iconfont icon-zhuye text-center f-26 m-r-15 c-p" style="width:46px;height:46px;line-height:46px;color:#0D906E;" @click="toHome()"></a>
        <div class="right m-r-50">
          <a class="left r-100 white block text-center f-26" style="width:46px;height:46px;"><img src="../../../static/img/userImg.png" width="100%" height="100%"></a>
          <div class="left p-lr-5">
          <p>{{phone}}</p>
          <p style="line-height: 16px;">欢迎您回来</p>
          </div>
        </div>
		</div>
		</div>
		
		<div class="clear"></div>
	</header>
</template>

<script>
export default {
  name: "top",
  data() {
    return {
      //name: localStorage.getItem("userNAME"),
      phone: localStorage.getItem("phone"),
      userid:"",
      gid:"",
      gname:"",
      factoryList:[]
    };
  },
  created() {
   
  },
  mounted() {},
  methods: {
    toHome() {
      this.$router.push({
        path: "/"
      });
    },
    toLogin() {
      localStorage.removeItem("token");
      this.$router.push({
        path: "/login/login"
      });
    }
  }
};
</script>
<style scoped>
	
</style>
