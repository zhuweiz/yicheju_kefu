<template>
	<div>

		<el-row class="blue c-white fix top-0 left-0 w-100 z-99" style="height:95px;background: #0D906E;">
			<top></top>
		</el-row>
		
		<el-row class="fix l-0 h-100" style="top: 96px;width:110px;background:#475551;z-index: 99;">
			<left></left>
		</el-row>
		
		<div class="main w-100 fix" style="top:95px;padding-left: 110px; bottom: 37px;">
			<div class="w-100 h-100 tabBox">
				  <router-view/>
			</div>
		</div>
		
		<div class="w-100 c9 p-lr-15 f-12 fix b-0" style="left: 110px; height: 37px;line-height: 37px; background:rgba(244,244,244,1)"><copyright></copyright></div>
		
	</div>
</template>

<script>
	import top from "../components/top.vue";
	import left from "../components/left.vue";
	import copyright from "../components/copyright.vue";
	
	export default {
		name: "home",
		data() {
			return {
			};
		},
		components: {
			top,
			left,
			copyright
		},
		created() {
		
		},
		mounted() {
			//111
			var k_reload = localStorage.getItem("k2_reload")
				if(k_reload) {
					setTimeout((res)=>{
						this.$router.go(0);	
					},500)
					localStorage.removeItem('k2_reload')
				}
		},
		methods: {
			toadmin1() {
				this.$router.push({
					path: "../home/admin1"
				});
			},
			toadmin2() {
				this.$router.push({
					path: "../home/admin2"
				});
			}
		}
	};
</script>
<style scoped>


</style>