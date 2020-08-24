<template>
	<div class="w-100 h-100">
		<ul style="overflow-y: auto; height: 90%;">
			<li :class="orderNavActive == index?'active':''" v-for="(item,index) in navList" :key="index" @click="toPages(index,item.link)">
				<div>
					<div class="k_msgcount2" v-if="index==6&&k2_msgcount>0"></div> <!-- 111 -->
					<i :class="['iconfont',item.icon]"></i>
					<p>{{item.name}}</p>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: "left",
		data() {
			return {
				orderNavActive: 0,
				navList: [{
						name: "首页",
						icon: "icon-shouye1",
						link: "/"
					},
					{
						name: "询价单管理",
						icon: "icon-2wodezhangdan18x20",
						link: "/home/enquiry"
					},
					{
						name: "修理厂审核",
						icon: "icon-2wodezhangdan18x20",
						link: "/home/business"
					},
					{
						name: "配件商审核",
						icon: "icon-2wodezhangdan18x20",
						link: "/home/parts"
					},
					{
						name: "连锁门店",
						icon: "icon-shouye1",
						link: "/home/chain"
					},
					{
						name: "平台推广",
						icon: "icon-shouye1",
						link: "/home/extension"
					},
					{
						name: "商品库",
						icon: "icon-shouye1",
						link: "/home/shop"
					},
					{
						name: "客服",
						icon: "icon-shouye1",
						link: "/home/service_chat"
					}
				],
				k2_msgcount: 0
			};
		},
		mounted() {
			if(this.$route.path == "/") {
				this.orderNavActive = 0
			}else if(this.$route.path == "/home/enquiry") {
				this.orderNavActive = 1
			}  else if(this.$route.path == "/home/business") {
				this.orderNavActive = 2
			} else if(this.$route.path == "/home/parts") {
				this.orderNavActive = 3
			} else if(this.$route.path == "/home/chain") {
				this.orderNavActive = 4
			} else if(this.$route.path == "/home/extension") {
				this.orderNavActive = 5
			} else if(this.$route.path == "/home/shop") {
				this.orderNavActive = 6
			}else if (this.$route.path == "/home/service_chat") {
				// 111
				this.orderNavActive = 7
			}
			
			this.rechat()
			
		},
		watch: {
			$route(to, from) {
				if(to.path == "/") {
					this.orderNavActive = 0
				}
				
				// 111
				if (to.path == "/home/service_chat") {
					localStorage.removeItem("k2_msgcount")
					this.k2_msgcount = 0
					this.orderNavActive = 6
				}
				// 111
				
			}
		},
		methods: {
			// 111
			rechat() {
				this.$root.eventHub.$on('eventName', (data) => {
					if (data.k2_msgcount) {
						var k2_msgcount = localStorage.getItem("k2_msgcount")
						if (k2_msgcount * 1 > 0) {
							this.k2_msgcount = data.k2_msgcount;
						}
					}
				})
			},
			// 111
			
			toPages(i, link) {
				this.orderNavActive = i
				this.$router.push({
					path: link
				});
			},
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			}
		}
	};
</script>
<style scoped>
	ul li {
		width: 100%;
		height: 120px;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #74A496;
		cursor: pointer;
	}
	
	ul li:hover {
		background: rgba(255, 255, 255, .1);
		color: #3AC29F;
	}
	
	ul li.active {
		background: rgba(255, 255, 255, 1);
		color: #3AC29F;
		position: relative;
	}
	
	ul li.active::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 20px 20px 0 0;
		border-color: #3AC29F transparent transparent transparent;
	}
	
	ul li i {
		font-size: 26px;
	}
	
	.k_msgcount2 {
		background-color: red;
		width: 16px;
		height: 16px;
		position: absolute;
		margin-left: 28px;
		margin-top: -28px;
		border-radius: 50%;
	}
	
</style>