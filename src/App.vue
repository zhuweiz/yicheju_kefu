<template>
	<div id="app">

		<audio controls="controls" :autoplay="autoplay" id="audio">
			<source src="../static/video/message.mp3"> 您的浏览器不支持 audio 元素。
		</audio>

		<div v-wechat-title="$route.meta.title"></div>
		<router-view></router-view>
	</div>
</template>
<script>
	import { chat_left_list } from "@/request/api";
	
	export default {
		name: "App",
		data() {
			return {
				autoplay: false
				// transitionName: null
			};
		},
		watch: {
			// $route(to, from) {
			//   this.transitionName = "animated fadeInLeft routTo";
			// }
		},
		created() {
			// let token = localStorage.getItem("token");
			// 	if(token){
			// 		this.$router.push({
			// 					path: "/login"
			// 		});
			// 	}
		},
		methods: {

			// 初始化
			socket_init() {
				var user_id = localStorage.getItem("k2_userId");
				if(user_id) {
					this.socketApi.sendSock({
						"type": "init",
						"user_id": user_id
					}, this.getConfigResult);

					var k_msgcount = localStorage.getItem("k2_msgcount")
					if(k_msgcount * 1 > 0) {
						const data = {
							k2_msgcount: 1
						}
						this.$root.eventHub.$emit('eventName', data)
					}
				}
			},

			//
			// 获得长链接消息
			getConfigResult(res) {
				if(res.type == "push") {
					var audio = document.querySelector("audio");
					audio.play();
					localStorage.setItem("k2_msgcount", 1);
					// 传值给left
					const data = {
						k2_msgcount: 1
					}
					this.$root.eventHub.$emit('eventName', data);
					
					//这是第一次加载到首页存储消息的 ， 如果有直接未读+1 ，没有任何缓冲或者没有该聊天室的缓存则调取接口缓存
					var k_msglistcount = localStorage.getItem("k2_msglist") ? JSON.parse(localStorage.getItem("k2_msglist")) : null;
					if(k_msglistcount) {
						for(var i = 0; i < k_msglistcount.length; i++) {
							console.log(k_msglistcount[i])
							if(k_msglistcount[i].from_user_id * 1 == res.to_user_id * 1 && k_msglistcount[i].to_user_id * 1 == res.user_id * 1) {
								k_msglistcount[i].unread = k_msglistcount[i].unread + 1;
							}
						}
						const k_msglist = JSON.stringify(k_msglistcount)
						localStorage.setItem("k2_msglist", k_msglist);
					} else {
						this.start(res.user_id, res.to_user_id)
					}
					
				}
				console.log(res)
			},

			//检测浏览器放大比例
			detectZoom() {
				var ratio = 0,
					screen = window.screen,
					ua = navigator.userAgent.toLowerCase();

				if(window.devicePixelRatio !== undefined) {
					ratio = window.devicePixelRatio;
				} else if(~ua.indexOf('msie')) {
					if(screen.deviceXDPI && screen.logicalXDPI) {
						ratio = screen.deviceXDPI / screen.logicalXDPI;
					}
				} else if(window.outerWidth !== undefined && window.innerWidth !== undefined) {
					ratio = window.outerWidth / window.innerWidth;
				}

				if(ratio) {
					ratio = Math.round(ratio * 100);
				}
				return ratio;
			},
			start(user_id, to_user_id) {
				
				var data2 = {
					user_id: localStorage.getItem("k2_userId")
				};
				chat_left_list(data2).then(res => {
					if(res.data.code == 200) {
						for(var i = 0; i < res.data.data.length; i++) {
							if(res.data.data[i].from_user_id * 1 == to_user_id * 1 && res.data.data[i].to_user_id * 1 == user_id * 1) {
								res.data.data[i].unread = res.data.data[i].unread * 1 + 1;
							}
							
							if(res.data.data[i].unread * 1 > 0) {
								localStorage.setItem("k2_msgcount", 1);
								const data = {
									k2_msgcount: 1
								}
								this.$root.eventHub.$emit('eventName', data)
							}
							
						}
						localStorage.setItem("k2_msglist", JSON.stringify(res.data.data));

					} else {
						this.$message.warning(res.data.msg);
					}

				});
			}

		},
		mounted() {

			//111
			//初始化
			this.socket_init();
			
			var size = this.detectZoom();
			//未读消息提示
			this.start()
			
			localStorage.setItem("Clientsize" , size)

		}
	};
</script>

<style>
	#app {
		border-top: 1px solid transparent;
	}
	
	.main {
		overflow-y: auto;
		overflow-x: hidden;
	}
	
	#audio {
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
	}
</style>