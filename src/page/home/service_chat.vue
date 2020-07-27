<style type="text/css" scoped="scoped">
	.k_new {
		width: 1150px;
		height: 760px;
		margin: auto;
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		z-index: 100;
		bottom: 0;
		/*border:1px solid #000000;*/
		box-shadow: 0 0 1px #CCCCCC;
		/*border-radius: 1px;*/
		background-color: #fff;
	}
	
	@media screen and (max-width: 1366px) {
		.k_new {
			zoom: 0.64;
			top: 10%;
		}
	}
	
	.k_new2 {
		zoom: 0.7;
	}
	
	.k_new_left_tit {
		width: 350px;
		position: fixed;
		background-color: #eeeae9;
		z-index: 10;
	}
	
	.k_new_left {
		width: 350px;
		/*overflow: auto;*/
		overflow: auto;
		box-sizing: content-box;
		float: left;
		height: 100%;
		background-color: #eeeae9;
		/*border:1px solid red;*/
	}
	
	.k_new_right {
		width: 800px;
		height: 100%;
		float: right;
		background-color: #f5f5f5;
		/*border:1px solid red;*/
	}
	
	::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
		border-radius: 1px;
		background-color: #fff;
	}
	/*定义滑块 内阴影+圆角*/
	
	::-webkit-scrollbar-thumb {
		border-radius: 5px;
		-webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, .3);
		background-color: #fff;
	}
	
	::-webkit-scrollbar {
		width: 1px;
		height: 1px;
		background-color: #fff;
	}
</style>

<template>
	<div v-if="servers">
		<audio controls="controls" :autoplay="autoplay" id="audio">
			<source src="../../../static/video/message.mp3"> 您的浏览器不支持 audio 元素。
		</audio>

		<div class="k_new" :class="{'k_new2' : k_new2 }">
			<div class="k_new_left">
				<div class="k_new_left_a">

					<div class="k_new_left_tit">
						<div class="k_title">会话中 <span v-if="chat_count>0">（{{chat_count}}）</span></div>
						<div>
							<el-input v-model="search_content" placeholder="搜索用户昵称" class="chat_input"></el-input>
						</div>
					</div>
					<div style="height: 120px;"></div>
					<div>

						<div v-if="kefu" style="background-color: #d9d9d9;padding-bottom: 10px;" class="k_list" @click="kefu_cli">
							<div class="k_list_avatar">
								<img src="../../assets/head.png" />
							</div>
							<div class="k_list_a">
								<div class="k_list_a_a">客服</div>
								<div class="k_list_a_b"></div>
							</div>
							<div class="clear"></div>
							<div class="k_list_b">
								<div class="k_list_b_a">暂无内容</div>
								<div class="k_list_b_b">
									<span class="k_type3">离线中</span>
								</div>
							</div>
							<div style="height: 10px;"></div>
							<div class="clear"></div>
						</div>

						<div v-for="(it,index) in item_search" :key="index" class="k_list" :class="{'check_bgc':bgci==index}" @click="cli_bgc(index , it)">
							<div class="k_list_avatar">
								<img :src="it.avatar" :onerror="defaultImg" />
							</div>

							<div class="k_list_a">
								<div class="k_list_a_a" v-if="it.is_top==1">客服</div>
								<div class="k_list_a_a" v-if="it.is_top!=1">{{it.real_name?it.real_name:"暂无"}}</div>
								<div class="k_list_a_b">{{it.time}}</div>
							</div>
							<div class="clear"></div>
							<div class="k_list_b">

								<div class="k_list_b_a" v-if="it.message_type<=1&&it.content.split('.wav').length<2||it.message_type==null&&it.content.split('.wav').length<2">{{it.content}}</div>
								<div class="k_list_b_a" v-if="it.message_type==2">[图片]</div>
								<div class="k_list_b_a" v-if="it.message_type==3">[视频]</div>
								<div class="k_list_b_a" v-if="it.message_type==4||it.message_type==5">[文件]</div>
								<div class="k_list_b_a" v-if="it.content.split('.wav').length>1">[录音]</div>

								<div class="k_list_b_b">
									<span v-if="it.status==1" class="k_type">会话中</span>
									<span v-if="it.status==2" class="k_type2">结束会话</span>
									<span v-if="it.status==3" class="k_type3">转接</span>
								</div>
							</div>
							<div class="clear"></div>
							<div class="k_list_count" v-if="it.unread>0">
								{{it.unread}}
							</div>
						</div>

					</div>
				</div>
			</div>

			<div class="k_new_right" v-if="chatList">

				<div class="k_chat_body_title">
					<div class="k_chat_body_zs" v-if="chatmsg.is_top==1">客服 （{{chatmsg.real_name}}）</div>
					<div class="k_chat_body_zs" v-else>{{chatmsg.real_name}}</div>

					<div class="k_chat_body_zs2">
						<!-- <span @click="overchat()">结束会话</span> -->
					</div>
				</div>

				<div class="k_chat_body_list" ref="box">
					<div class="k_chat_body_more" @click="more">{{more_title}}</div>

					<div v-for="(it,index) in chat_list" :key="index" v-if="chat_list">
						<div :class="{'list_left':it.user_id!=user_id,'list_right':it.user_id==user_id}" v-if="it.type!=0">
							<img :src="it.head_img" :onerror="defaultImg" />
							<div v-html="it.content" v-if="it.type==1"></div>
							<!-- @click="k_img(it)" -->
							<div v-else-if="it.type==2" >
											  <el-image
                       class="k_img"
                        :src="it.content"
                        :preview-src-list="it.content.split(',')"
                      ></el-image>
							</div>

							<div v-else-if="it.type==3" class="video">
								<video :src="it.content" controls :poster="it.last_name"></video>
							</div>

							<div v-else-if="it.type==4||it.type==5" class="file">
								<img src="../../../static/img/file.png" class="file_img" />
								<div class="file_div">
									<div>{{it.last_name?it.last_name:"文件"}}</div>
									<div>
										<a :href="it.content"> 下载</a>
									</div>
								</div>
							</div>

							<div v-else class="file" @click="yuyin_check(it , index)">
								<div v-if="it.user_id!=user_id">
									<img src="../../../static/img/yinpin.png" class="yinpin" />
									<span style="padding-left:10px;float:right; margin-top:5px;margin-right: 5px;">
									{{it.type.split("卍")[1]}} "</span>
								</div>
							</div>

						</div>
						<div class="list_left_time" v-if="it.type==0">
							{{it.content}}
						</div>
						<div class="clear"></div>
					</div>

				</div>

				<div style="background-color:#FFFFFF;height: 210px;">
					<div style="height:40px;overflow: hidden;text-indent: 10px;padding-top: 10px;">
						<el-upload class="upload-demo" :action="actionurl" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" :on-exceed="handleExceed" :on-success="handleAvatarSuccess">
							<img src="../.././../static/img/img.png" class="img" />
						</el-upload>
					</div>
					<textarea value="" @keydown="listen($event)" v-model="sendmsg" placeholder="请输入内容" class="sendmsg" ref="send_msg" />
					<el-button type="primary" class="send" @click="send">发送</el-button>
					<div class="clear"></div>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import {
		chat_left_list,
		getTalkHistory,
		saveSingleTalk,
		startToSingleTalk,
		clearUnread,
		getBusiness,
		auditGarage,
		resetPassword,
		updateQrCode,
		salesmanList,
		changeGarageInfo
	} from "../../request/api.js";
	import moment from "moment";

	//1是type: 1 =在线 2离线   3已转接
	export default {
		data() {
			return {
				num: 0,
				chatmsg: "",
				user_info: "",
				user_id: "",
				to_user_id: "",
				chat_id: "",
				k_page: 1,
				k_count: 1,
				k_page_size: 10,
				input: '',
				userlist_true: false,
				more_title: "点击加载更多",
				// chat_count:0,
				servers: false,
				chatList: false,
				search_content: "",
				autoplay: false,
				item: [],
				defaultimg: '', //错误显示默认图
				message_type: 1, //1是消息  0是时间  'image':2;  'video': 3;  'mp3';4  'data';5
				actionurl: "/chat/index/index/upload?token=" + localStorage.getItem("k2_token"),
				defaultImg: 'this.src="' + require('../../assets/head.png') + '"',
				chat_list: [],
				imageUrl: "",
				userlist: [],

				bgci: -1,
				fileList: [],
				name_search: "",
				last_name: "", //文件名
				tableData: [],
				list: [],
				editPartsForm: [],
				orderNavActive: 0,
				dialogVisible2: false,
				maxHeight: undefined,
				search: {
					name: ""
				},
				pageLength: null,
				size: 10,
				page: 0,
				dialogVisible: false,
				src: "",
				// editPartsForm: {}, //修改修理厂
				uploadInfo: {},
				sendmsg: "",
				// 
				value: "",
				type: 1, //消息类型 1是信息

				yuyin_url: "",
				servers: true,
				kefu: false,
				k_new2: false,
				time_tanfer_time: "",
				index_i: -1, //这是获取历史一条历史的字段

			}
		},
		methods: {
			          listen(event) {
      console.log(event);
      if (event.keyCode === 13) {
        this.send(); // 发送文本
        event.preventDefault(); // 阻止浏览器默认换行操作
        return false;
      }
    },
			kefu_cli() {
				this.$message.warning("暂无在线客服");
			},
			yuyin_check(it, index) {
				this.yuyin_url = new Audio(it.content);
				this.yuyin_url.play();
			},
			// --------------------------
			k_img(it) {
				this.$alert('<img src="' + it.content + '" style="max-height: 400px;max-width: 400px;">', '图片显示', {
					dangerouslyUseHTMLString: true
				});
			},
			socket_init() {
				this.socketApi.sendSock({
					"type": "init",
					"user_id": this.user_id
				}, this.getConfigResult);
			},
			onDivInput(e) {
				this.sendmsg = e.target.innerHTML;
			},
			cli_bgc(index, it) {
				console.log(it)
				this.bgci = index;
				this.chatmsg = it
				this.chatList = true;
				this.chat_id = it.id;
				this.user_info = it
				this.to_user_id = it.to_user_id;
				this.chat_list = [];
				this.k_page = 1;
				this.getTalkHistory();
				this.clearUnread(index, it.id, it.to_user_id)
			},
			overchat2() {
				this.chatList = false;
				//				this.servers = false;
				this.chatmsg = "";
				this.yuyin_url.pause();

			},
			overchat() {
				this.chatList = false;
				//				this.servers = false;
				this.yuyin_url.pause();
				const data = {
					"type": "end_talk",
					"user_id": this.user_id,
					"to_user_id": this.to_user_id,
					"talk_id": this.chatmsg.id
				}

				this.socketApi.sendSock(data, this.getConfigResult);

				//将会话状态改为结束
				for(var i = 0; i < this.item.length; i++) {
					if(this.item[i].id == this.chatmsg.id) {
						this.item[i].status = 2
					}
				}

				this.chatmsg = "";
				this.sendmsg = ""
			},
			// 转接
			transfer() {
				this.servers = !this.servers;
				this.userlist = ""
				this.socketApi.sendSock({
					"type": "get_user",
					"user_id": this.user_id
				}, this.getConfigResult);

			},
			//获取转接列表
			transfer_cli(it) {
				console.log(it);
				this.socketApi.sendSock({
					"type": "change_user",
					"user_id": it.id,
					talk_id: this.chatmsg.id,
					"to_user_id": this.chatmsg.to_user_id
				}, this.getConfigResult);
				// 被转接
				this.servers = false;
				this.chatList = false;
				this.$message({
					message: '转接成功',
					type: 'success'
				});
				this.start()

			},

			start() {
				const data = {
					user_id: this.user_id
				};
				chat_left_list(data).then(res => {
					this.item = [];

					if(res.data.code == 200) {

						for(var i = 0; i < res.data.data.length; i++) {
							if(res.data.data[i].real_name != null) {
								this.item.push(res.data.data[i])
							}
						}

						// 存储聊天列表
						//先获得，如果原来有则覆盖unread ，再存储
						var k_msglistcount = JSON.parse(localStorage.getItem("k2_msglist"));
						if(k_msglistcount) {
							for(var i = 0; i < this.item.length; i++) {
								for(var j = 0; j < k_msglistcount.length; j++) {
									if(this.item[i].id == k_msglistcount[j].id && this.item[i].to_user_id == k_msglistcount[j].to_user_id) {
										this.item[i].unread = k_msglistcount[j].unread;
										this.item[i].content = k_msglistcount[j].content
										this.item[i].time = k_msglistcount[j].time
									}
								}
							}

							//存储最后一条消息
							for(var i = 0; i < this.item.length; i++) {
								this.index_i = i;
								console.log(this.index_i)
								this.chat_id = this.item[i].id;
								this.k_page = 1;
								this.getTalkHistory(this.index_i);
							}

						} else {
							//获取列表的最后一条消息，后台没数据，只能前端调取
							for(var i = 0; i < this.item.length; i++) {
								this.index_i = i;
								console.log(this.index_i)
								this.chat_id = this.item[i].id;
								this.k_page = 1;
								this.getTalkHistory(this.index_i);
							}
						}

						//						if(this.item.length > 0) {
						//							this.user_info = this.item[0];
						//						}
						//
						//						const k_msglist = JSON.stringify(this.item)
						//						localStorage.setItem("k2_msglist", k_msglist);

					} else {
						this.$message.warning(res.data.msg);
					}

				});
			},
			//清除未读
			clearUnread(index, id, to_user_id) {
				const data = {
					id: this.chat_id
				};
				clearUnread(data).then(res => {
					if(res.data.code == 200) {
						this.item[index].unread = 0;

						// 清除缓存的未读数
						var k_msglistcount = JSON.parse(localStorage.getItem("k2_msglist"));
						if(k_msglistcount) {
							for(var i = 0; i < k_msglistcount.length; i++) {
								if(id == k_msglistcount[i].id && k_msglistcount[i].to_user_id == to_user_id) {
									k_msglistcount[i].unread = 0
								}
							}
						}
						localStorage.setItem("k2_msglist", JSON.stringify(k_msglistcount));

					} else {
						this.$message.warning(res.data.msg);
					}
				});
			},

			//上传
			handleAvatarSuccess(response, file, fileList) {
				console.log(response);
				this.message_type = response.data.data_type;
				this.sendmsg = response.data.url;
				this.last_name = response.data.last_name;
				this.send()
				this.sendmsg = "";
				this.message_type = 1;
				console.log(this.data_type)
			},
			// 获取历史消息
			getTalkHistory(index_i) {
				const data = {
					id: this.chat_id,
					page: this.k_page,
					page_size: this.k_page_size
				};
				getTalkHistory(data).then(res => {
					if(res.data.code == 200) {
						this.k_count = res.data.count ? res.data.count : 1
						for(var i = 0; i < res.data.data.length; i++) {
							this.chat_list.unshift(res.data.data[i])
						}
						if(this.k_page < 2) {
							this.scrolltop()
						}
						
						
						//这是显示最后一条信息并缓存
						if(index_i > -1) {
							try {
								if(res.data.data[0].type == 0) {
									this.item[index_i].content = res.data.data[1].content
								} else {
									this.item[index_i].content = res.data.data[0].content;
								}
							} catch(e) {}
							localStorage.setItem("k2_msglist", JSON.stringify(this.item));
						}

						

					} else {
						this.$message.warning(res.data.msg);
					}
				});
			},

			//转时间格式
			time_tanfer(shijian) {
				console.log(shijian)
				let date = new Date(shijian);
				let y = date.getFullYear();
				let MM = date.getMonth() + 1;
				MM = MM < 10 ? ('0' + MM) : MM;
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				let h = date.getHours();
				h = h < 10 ? ('0' + h) : h;
				let m = date.getMinutes();
				m = m < 10 ? ('0' + m) : m;
				let s = date.getSeconds();
				s = s < 10 ? ('0' + s) : s;
				//				return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
				return MM + '-' + d + ' ' + h + ':' + m + ':' + s;
			}, // 发送信息
			//转时间格式
			time_tanfer(shijian) {
				console.log(shijian)
				let date = new Date(shijian);
				let y = date.getFullYear();
				let MM = date.getMonth() + 1;
				MM = MM < 10 ? ('0' + MM) : MM;
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				let h = date.getHours();
				h = h < 10 ? ('0' + h) : h;
				let m = date.getMinutes();
				m = m < 10 ? ('0' + m) : m;
				let s = date.getSeconds();
				s = s < 10 ? ('0' + s) : s;
				//				return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
				return MM + '-' + d + ' ' + h + ':' + m + ':' + s;
			},
			// 发送信息
			send() {
				var content = ""
				if(this.sendmsg == "") {
					this.$message({
						message: '内容不得为空！',
						type: 'warning'
					});
					return false
				}
				if(this.chatmsg == "") {
					this.$message({
						message: '请选择聊天！',
						type: 'warning'
					});
					return false
				}
				this.time_tanfer_time = this.time_tanfer(Math.round(new Date()))
				try {
					const num = this.chat_list.length;
					const created_at = this.chat_list[num - 1].created_at; //15分钟后的时间是 +15*60
					const nowtime = Math.round(new Date() / 1000)
					const jiantime = nowtime - created_at;
					//600是10 分钟
					console.log(jiantime);
					//传文件不传时间，否则出错
					if(this.message_type == 1 && jiantime > 600) {
						content = new Date().toLocaleString();
						this.message_type = 0 //0是时间
					} else {
						content = this.sendmsg

					}
				} catch(e) {
					content = this.sendmsg
				}

				const data = {
					"type": "push",
					"user_id": this.user_id,
					"to_user_id": this.to_user_id,
					"message_type": this.message_type,
					"last_name": this.last_name,
					"talk_id": this.chatmsg.id,
					"talk_status": this.chatmsg.status, //1 会话中 2结束会话
					"created_at": Math.round(new Date() / 1000),
					"head_img": JSON.stringify(localStorage.getItem("userInfo")).avatar ? JSON.stringify(localStorage.getItem("userInfo")).avatar : "/static/img/head.png",
					"content": content
				}
				this.socketApi.sendSock(data, this.getConfigResult);
				var data_chat = {
					single_talk_id: this.chatmsg.id,
					content: content,
					type: this.message_type,
					user_id: this.user_id,
					last_name: this.last_name,
					created_at: Math.round(new Date() / 1000),
					"head_img": JSON.stringify(localStorage.getItem("userInfo")).avatar ? JSON.stringify(localStorage.getItem("userInfo")).avatar : "/static/img/head.png",
				}
				console.log(data_chat)
				this.chat_list.push(data_chat);
				this.saveSingleTalk(data_chat);

				//将会话状态改为会话中
				for(var i = 0; i < this.item.length; i++) {
					if(this.item[i].id == this.chatmsg.id) {
						this.item[i].status = 1;
						this.item[i].message_type = this.message_type;
						this.item[i].content = content
						this.item[i].time = this.time_tanfer_time

					}
				}

				//存储聊天信息
				var k_msglist = localStorage.getItem("k2_msglist") ? JSON.parse(localStorage.getItem("k2_msglist")) : "";
				if(k_msglist != "") {
					for(var i = 0; i < k_msglist.length; i++) {
						if(k_msglist[i].id == this.chatmsg.id) {
							k_msglist[i].status = 1;
							k_msglist[i].message_type = this.message_type;
							k_msglist[i].content = content;
							k_msglist[i].time = this.time_tanfer_time

						}
					}
				}
				localStorage.setItem("k2_msglist", JSON.stringify(k_msglist));

			},
			//保存消息
			// 获取历史消息
			saveSingleTalk(data) {
				saveSingleTalk(data).then(res => {
					if(res.data.code == 200) {
						if(this.message_type == 0) {
							// 如果是时间再传值
							this.message_type = 1;
							this.sendmsg = this.$refs.send_msg.value
							this.send();
						}
						this.sendmsg = ""
						this.scrolltop()
					} else {
						this.$message.warning(res.data.msg);
					}
				});
			},
			//更多
			more() {
				if(this.chat_list.length * 1 >= this.k_count) {
					this.more_title = "暂无数据哦，亲！"
					return false
				} else {
					this.k_page++;
					this.getTalkHistory();
				}
			},
			// 下拉
			scrolltop() {
				clearTimeout(sett)
				var sett = setTimeout(() => {
					this.$nextTick(() => {
						let list = this.$refs.box;
						try {
							list.scrollTop = list.scrollHeight
						} catch(e) {}
					})
				}, 100)
			},
			//创建聊天室
			startToSingleTalk(data) {
				startToSingleTalk(data).then(res => {
					if(res.data.code == 200) {

					} else {
						this.$message.warning(res.data.msg);
					}
				});
			},
			// 获得长链接消息 接收
			getConfigResult(res) {
				if(res.type == "push") {
					var audio = document.querySelector('#audio');
					try {
						audio.play();
						var k_item = ""; //置顶1
						var index = 0;

					} catch(e) {

					}
					if(this.chatmsg == "") {
						for(var i = 0; i < this.item.length; i++) {
							if(this.item[i].to_user_id == res.user_id) {
								this.item[i].unread = this.item[i].unread * 1 + 1;
								this.item[i].content = res.content;
								index = i //置顶2
								k_item = this.item[i]; //置顶3
								this.item.splice(index, 1) //置顶4
							}
						}
					}
					var k_itemmsg = ""; //置顶5
					// 增加未读数 每次存缓存
					const k_msglist = JSON.parse(localStorage.getItem("k2_msglist"));
					if(k_msglist) {
						for(var i = 0; i < k_msglist.length; i++) {
							if(k_msglist[i].to_user_id == res.user_id) {
								k_msglist[i].unread = k_msglist[i].unread * 1 + 1;
								k_msglist[i].content = res.content
								k_msglist[i].message_type = res.message_type;
								k_msglist[i].time = this.time_tanfer(res.created_at * 1000); //接收存储时间

								k_itemmsg = k_msglist[i]; //置顶6
								k_msglist.splice(i, 1) //置顶7

								//置顶8
								if(this.chatmsg.to_user_id * 1 == res.user_id * 1) {
									this.bgci = 0
								}

							}
						}

						console.log(k_msglist)

						k_msglist.unshift(k_itemmsg) //置顶9

						localStorage.setItem("k2_msglist", JSON.stringify(k_msglist))
						this.item = k_msglist;

						// 消息提醒
						var k_msgcount = 1;
						localStorage.setItem("k2_msgcount", k_msgcount);
						// 传值给left
						const data = {
							k2_msgcount: k_msgcount
						}
						this.$root.eventHub.$emit('eventName', data)

						//置顶10
						if(this.chatmsg.to_user_id * 1 != res.user_id * 1) {
							return false;
						}

					}

					res.type = res.message_type;
					this.chat_list.push(res);
					this.scrolltop();

					if(this.item.length < 1) {
						this.start()
					}

				} else if(res.type == "get_user") {
					// 获取转接人
					this.userlist = res.data;
					if(res.data.length < 1) {
						this.userlist_true = true
					}
				} else if(res.type == "change_user") {
					// 被转接
					// this.servers = false;
					this.$message({
						message: res.content,
						type: 'success'
					});
					this.start()
				} else if(res.type == "end_talk") {
					// 结束聊天
					this.start()
				}
				console.log(res)
			},

			// -----------------
			dialogVisibleQ() {
				this.$refs.addFormRef.resetFields();
				this.$refs.uploadImg.clearFiles();
				this.$refs.uploadImg2.clearFiles();
				this.editPartsForm.doorPic = "";
				this.editPartsForm.businessLicensePic = "";
				this.dialogVisible2 = false;
			},
			//提交修改

			init() {
				const data = {
					size: this.size,
					page: this.page,
					status: this.orderNavActive,
					name: this.search.name
				};
				getBusiness(data).then(res => {
					// console.log(res.data);
					const result = res.data;
					this.pageLength = result.pageInfo.total + 10;
					this.tableData = result.data;
				});
			},
			nextPage(page) {
				this.page = page - 1;
				this.init();
			},
			orderTab(index) {
				this.orderNavActive = index;
				this.page = 0;
				this.init();
			},
			viewPhoto(url) {
				this.src = url;
				this.dialogVisible = true;
			},
			getRow(row) {
				this.uploadInfo = row;
			},

			handleRemove(file, fileList) {
				console.log(file, fileList);
				console.log(1);
			},
			handlePreview(file) {
				console.log(file);
				console.log(2);
			},
			handleExceed(files, fileList) {
				console.log(3);
				this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			beforeRemove(file, fileList) {
				console.log(4);
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			// ---------------

			handleEnterThing() {
				if(this.value != "") {
					this.socketApi.sendSock(QQi, this.getConfigResult);
				}
			},

		},
		created() {
			this.init();
			this.user_id = localStorage.getItem("k2_userId");
			this.socketApi.getSock(this.getConfigResult);
		},
		mounted() {
			this.maxHeight = $(".tabBox").height() - 230;
			// this.socket_init();
			this.start();
			var size = localStorage.getItem("Clientsize")
			if(size > 100) {
				this.k_new2 = true
			}
		},
		computed: {
			chat_count() {
				var num = 0;
				for(var i = 0; i < this.item.length; i++) {
					num = num + this.item[i].unread * 1
				}
				return num
			},
			item_search() {
				return this.item.filter(k => {
					return k.real_name.match(this.search_content)
				})
			}

		}
	}
</script>

<style scoped="scoped">
	.yinpin {
		width: 20px;
		height: 20px;
		margin-top: 5px;
		cursor: pointer;
	}
	
	#audio {
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
	}
	
	div[contenteditable]:empty:not(:focus):before {
		content: attr(placeholder);
		color: #aaa;
	}
	
	.el-row {
		margin-bottom: 20px;
		&:last-child {
			margin-bottom: 0;
		}
	}
	
	.el-col {
		border-radius: 4px;
		margin-left: 30px;
		margin-top: 20px;
	}
	
	.bg-purple {
		border: 1px solid #d3dce6;
		padding-bottom: 20px;
	}
	
	.bg-purple-light {
		border-top: 1px solid #eeeeee;
	}
	
	.grid-content {
		border-radius: 4px;
		min-height: 36px;
	}
	
	.row-bg {
		padding: 10px 0;
		background-color: #f9fafc;
	}
	
	.k_left {
		width: 100px;
		height: 100%;
	}
	
	.k_title {
		width: 100%;
		text-align: center;
		line-height: 50px;
		height: 50px;
		font-size: 18rpx;
		background-color: #f0f0f0;
	}
	
	.chat_input {
		width: 90%;
		display: block;
		margin: auto;
		margin-top: 10px;
	}
	
	.k_type {
		color: #04B404;
	}
	
	.k_type2 {
		color: #d6d4cd;
	}
	
	.k_type3 {
		color: #b40909;
	}
	
	.k_list {
		width: 100%;
		height: auto;
		border-top: 1px solid #eeeeee;
		position: relative;
		transition: .3s;
		padding-bottom: 10px;
	}
	
	.k_list:hover {
		background-color: #f4f4f4;
		cursor: pointer;
	}
	
	.check_bgc {
		background-color: #f4f4f4;
	}
	
	.k_list_count {
		position: absolute;
		right: 10px;
		top: 10px;
		border-radius: 50%;
		background-color: red;
		color: #FFFFFF;
		text-align: center;
		width: 22px;
		line-height: 22px;
		font-size: 12px;
		height: 22px;
		height: 22px;
	}
	
	.k_list_avatar {
		float: left;
		width: 45px;
		height: 45px;
		border-radius: 4px;
		overflow: hidden;
		margin-top: 15px;
		margin-left: 5px;
	}
	
	.k_list_avatar img {
		width: 100%;
		height: 100%;
	}
	
	.k_list_a {
		width: 100%;
		padding-top: 10px;
	}
	
	.k_list_a>div {
		float: left;
		margin-top: 3px;
		height: 30px;
	}
	
	.k_list_a_a {
		width: 36%;
		font-size: 14px;
		text-indent: 6px;
		overflow: hidden;
		white-space: nowrap;
		font-weight: bold;
		text-overflow: ellipsis;
	}
	
	.k_list_a_b {
		width: 40%;
		font-size: 10px;
		overflow: hidden;
		white-space: normal;
		color: #ddd7cf;
		text-align: right;
		text-overflow: ellipsis;
	}
	
	.k_list_b {
		float: right;
		width: 85%;
		margin-top: -25px;
	}
	
	.k_list_b>div {
		float: left;
	}
	
	.k_list_b_a {
		width: 70%;
		font-size: 12px;
		text-indent: 6px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	.k_list_b_b {
		width: 25%;
		font-size: 10px;
		overflow: hidden;
		white-space: normal;
		text-align: right;
		text-overflow: ellipsis;
	}
	
	.img {
		width: 30px;
		height: 30px;
	}
	
	.orderUl li {
		float: left;
		padding: 4px 18px;
		border-radius: 5px;
		cursor: pointer;
		margin-left: 10px;
		transition: 0.5s;
		font-size: 16px;
	}
	
	.yinye {
		float: left;
		width: 80px;
		padding: 0 12px 0 0;
		text-align: right;
		vertical-align: middle;
	}
	
	.orderUl li:hover {
		background: rgba(0, 0, 0, 0.1);
		transition: 0.5s;
	}
	
	.orderUl li.active {
		background: #3ac29f;
		color: #fff;
	}
	
	.xiugai {
		margin-bottom: 8px;
		width: 125px;
		margin-left: 8px;
	}
	
	.gu_title {
		text-align: center;
		line-height: 30px;
		height: 32px;
		font-size: 15px;
		font-weight: bold;
		border-bottom: 1px solid #ececec;
	}
	
	.gu_list tr td {
		padding: 5px 0;
	}
	
	.gu_list tr td:nth-child(1) {
		width: 80px;
		text-align: right;
	}
	
	.gu_list tr td:nth-child(2) {
		width: 120px;
	}
	
	.p-20 {
		padding: 2px 0;
	}
	
	.order {
		font-size: 13px;
		height: 35px;
		line-height: 35px;
	}
	
	.k_chat {
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 10;
		margin: auto;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
	}
	
	.k_chat_hide {
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: rgba(0, 0, 0, 0.1);
	}
	
	.k_chat_body {
		width: 600px;
		height: 610px;
		margin: auto;
		border-radius: 8px;
		box-shadow: 0 0 3px #ccc;
		position: absolute;
		left: 0;
		right: 0;
		top: 20%;
		background-color: #FFFFFF;
	}
	
	.k_chat_body_title {
		width: 100%;
		border-bottom: 1px solid #f0f1f3;
		height: 50px;
		line-height: 50px;
	}
	
	.k_chat_body_zs {
		width: 200px;
		float: left;
		text-indent: 10px;
	}
	
	.k_chat_body_zs2 {
		width: 200px;
		text-align: right;
		float: right;
		margin-right: 10px;
	}
	
	.k_chat_body_zs2>span {
		cursor: pointer;
		margin-right: 10px;
		color: #0099FF;
	}
	
	.userlist {
		width: 200px;
		height: 300px;
		position: absolute;
		right: 30px;
		top: 55px;
		border-radius: 5px;
		background-color: #FFFFFF;
		box-shadow: 0 0 20px #e6e2e2;
	}
	
	.userlist_a {
		width: 100%;
		height: 50px;
		line-height: 50px;
		color: #000000;
		text-align: center;
		border-bottom: 1px solid #d9d7d6;
	}
	
	.userlist_b {
		overflow: auto;
		height: 250px;
		width: 100%;
	}
	
	.userlist_list {
		width: 100%;
		height: 50px;
		line-height: 50px;
		border-bottom: 1px solid #f0efee;
	}
	
	.userlist_list_kf {
		width: 85px;
		text-indent: 5px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: center;
		color: #14d8ff;
		float: left;
	}
	
	.userlist_list_name {
		width: 100px;
		text-indent: 5px;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		float: left;
	}
	
	.k_chat_body_list {
		width: 100%;
		margin: auto;
		height: 502px;
		overflow-y: auto;
		border-bottom: 1px solid #f3eeee;
	}
	
	.k_chat_body_list>div {
		margin: 20px 0;
	}
	
	.k_chat_body_more {
		text-align: center;
		line-height: 35px;
		font-size: 10px;
		cursor: pointer;
		color: #cbcbcb;
	}
	
	.list_left {
		width: 400px;
		float: left;
	}
	
	.list_left>div {
		float: left;
		max-width: 300px;
		word-wrap: break-word;
		margin-left: 3px;
		border-radius: 4px;
		padding: 3px 5px;
		background-color: #FFFFFF;
		color: #000000;
		margin-top: 5px;
	}
	
	.list_left>img {
		float: left;
		width: 40px;
		height: 40px;
		border-radius: 4px;
		margin-left: 10px;
		margin-right: 5px;
	}
	
	.list_right {
		width: 400px;
		float: right;
	}
	
	.k_img {
		max-width: 100px;
		max-height: 100px;
	}
	
	.list_right>div {
		float: right;
		word-wrap: break-word;
		max-width: 300px;
		background-color: #9eea6a;
		border-radius: 4px;
		padding: 3px 5px;
		color: #000000;
		margin-top: 5px;
	}
	
	.list_right>img {
		width: 40px;
		height: 40px;
		border-radius: 4px;
		float: right;
		margin-left: 5px;
		margin-right: 10px;
	}
	
	.list_left_time {
		text-align: center;
		width: 220px;
		margin: auto;
		font-size: 12px;
		height: 26px;
		line-height: 26px;
		margin-top: 10px;
		border: 6px;
		background-color: #ececec9e;
		margin-bottom: 10px;
	}
	
	.set_ui {
		width: 90%;
		height: 40px;
		margin: auto;
		line-height: 80px;
	}
	
	.sendmsg {
		width: 90%;
		border: none;
		height: 100px;
		/*border-bottom: 1px solid #e7e7e7;*/
		margin: auto;
		resize: none;
		display: block;
		outline: none;
		margin-top: 10px;
	}
	
	.send {
		margin-top: 10px;
		float: right;
		margin-right: 5%;
	}
	
	.video video {
		width: 140px;
		height: 120px;
	}
	
	.file {
		background-color: #FFFFff;
	}
	
	.file_img {
		width: 50px;
		height: 50px;
		float: left;
		margin-top: 10px;
		margin-right: 20px;
	}
	
	.file_div {
		float: left;
		font-size: 12px;
	}
	
	.file_div>div:nth-child(1) {
		color: #000000;
	}
	
	.file_div a {
		color: #0dc4ec;
	}
</style>

<!--<template>
	<div>

		<audio controls="controls" :autoplay="autoplay" id="audio">
			<source src="../../../static/video/message.mp3"> 您的浏览器不支持 audio 元素。
		</audio>
		<el-row>
			<el-col :span="5">
				<div class="grid-content bg-purple">
					<div class="k_title">会话中 <span v-if="chat_count>0">（{{chat_count}}）</span></div>
					<div>
						<el-input v-model="search_content" placeholder="搜索用户昵称" class="chat_input"></el-input>
					</div>
					<div style="height: 15px;"></div>

					<div>
						<div v-for="(it,index) in item_search" :key="index" class="k_list" :class="{'check_bgc':bgci==index}" @click="cli_bgc(index , it)">
							<div class="k_list_a">
								<div class="k_list_a_a">{{it.real_name}}</div>
								<div class="k_list_a_b">{{it.time}}</div>
							</div>
							<div class="clear"></div>
							<div class="k_list_b">

								<div class="k_list_b_a" v-if="it.message_type<=1&&it.content.split('.wav').length<2||it.message_type==null&&it.content.split('.wav').length<2">{{it.content}}</div>
								<div class="k_list_b_a" v-if="it.message_type==2">[图片]</div>
								<div class="k_list_b_a" v-if="it.message_type==3">[视频]</div>
								<div class="k_list_b_a" v-if="it.message_type==4">[文件]</div>
								<div class="k_list_b_a" v-if="it.content.split('.wav').length>1">[录音]</div>

								<div class="k_list_b_b">
									<span v-if="it.status==1" class="k_type">会话中</span>
									<span v-if="it.status==2" class="k_type2">结束会话</span>
									<span v-if="it.status==3" class="k_type3">转接</span>
								</div>

							</div>
							<div class="clear"></div>
							<div class="k_list_count" v-if="it.unread>0">
								{{it.unread}}
							</div>
						</div>
					</div>
				</div>
			</el-col>
			<el-col :span="17">
				<div class="grid-content bg-purple-light">
					<div class="p-20" style="background:rgba(229,246,247,1);">
						<el-row :gutter="10">
							<div class="gu_title">客户详情</div>
							<table class="gu_list">
								<tr>
									<td>用户名：</td>
									<td>{{user_info.real_name}}</td>
									<td>门店名称:</td>
									<td>{{user_info.product_name}}</td>
								</tr>
								<tr>
									<td>手机号：</td>
									<td>{{user_info.phone}}</td>
									<td>门店状态:</td>
									<td>
										<span v-if="user_info.product_status==1" style="color: #528f59;">审核通过</span>
										<span v-else-if="user_info.product_status==0" style="color: #a5a2a1;">未审核</span>

									</td>
								</tr>
								<tr>
									<td>城市：</td>
									<td>{{user_info.address}}</td>
									<td></td>
									<td></td>
								</tr>
							</table>
						</el-row>
					</div>


					<div style="display: none;">

						<div class="order">
							订单信息
						</div>

						<el-table :data="tableData" :max-height="maxHeight" style="width: 100%" id="printBox">
							<el-table-column prop="date" label="订单编号" width="80">
								<template slot-scope="scope">{{scope.row.id}}</template>
							</el-table-column>
							<el-table-column prop="name" label="购买时间">
								<template slot-scope="scope">{{scope.row.name}}</template>
							</el-table-column>
							<el-table-column label="订单商品">
								<template slot-scope="scope">{{scope.row.city}}</template>
							</el-table-column>
							<el-table-column label="商品数量">
								<template slot-scope="scope">{{scope.row.address}}</template>
							</el-table-column>
							<el-table-column label="订单价格">
								<template slot-scope="scope">{{scope.row.legalPerson}}</template>
							</el-table-column>
							<el-table-column label="订单状态">
								<template slot-scope="scope">{{scope.row.legalPersonPhone}}</template>
							</el-table-column>
							<el-table-column label="商品商家">
								<template slot-scope="scope">
									<el-image style="width:70px; height:60px" :src="scope.row.businessLicensePic" fit="fill" @click="viewPhoto(scope.row.businessLicensePic)"></el-image>
								</template>
							</el-table-column>

						</el-table>
						<div class="p-tb-10 text-center">
							<el-pagination :hide-on-single-page="pageLength === 0" background layout="prev, pager, next" :page-size="size" @current-change="nextPage" :total="pageLength"></el-pagination>
						</div>
						<el-dialog title="图片查看" center :visible.sync="dialogVisible" :modal="false" width="50%">
							<div style="text-align:center;">
								<el-image :src="src"></el-image>
							</div>
							<span slot="footer" class="dialog-footer">
								<el-button type="success" @click="dialogVisible = false">确 定</el-button>
							</span>
						</el-dialog>
					</div>

				</div>
			</el-col>
		</el-row>
	
		<div class="k_chat" v-if="chatList">
			<div class="k_chat_hide" @click="overchat2()"></div>
			<div class="k_chat_body">
				<div class="k_chat_body_title">
					<div class="k_chat_body_zs">{{chatmsg.real_name}}</div>
					<div class="k_chat_body_zs2"> <span @click="transfer"> 转接</span> <span @click="overchat()">结束会话</span></div>
				
					<div class="userlist" v-if="servers">
						<div class="userlist_a">重新分配</div>
						<div class="userlist_b">
							<div v-for="(it,index) in userlist" :key="index" class="userlist_list" @click="transfer_cli(it)">
								<div class="userlist_list_kf">客服{{index+1}}</div>
								<div class="userlist_list_name">
									{{it.name}}
								</div>
							</div>
							<div class="userlist_true" v-if="userlist_true">暂无其他在线客服</div>
						</div>
					</div>
				</div>

				<div class="k_chat_body_list" ref="box">
					<div class="k_chat_body_more" @click="more">{{more_title}}</div>
					<div v-for="(it,index) in chat_list" :key="index" v-if="chat_list">
						<div :class="{'list_left':it.user_id!=user_id,'list_right':it.user_id==user_id}" v-if="it.type!=0">
							<img :src="it.head_img" />
							<div v-html="it.content" v-if="it.type==1"></div>
							<div v-else-if="it.type==2" @click="k_img(it)">
								<img :src="it.content" class="k_img" />
							</div>

							<div v-else-if="it.type==3" class="video">
								<video :src="it.content" controls></video>
							</div>

							<div v-else-if="it.type==4" class="file">
								<img src="../../../static/img/file.png" class="file_img" />
								<div class="file_div">
									<div>{{it.last_name?it.last_name:"文件"}}</div>
									<div>
										<a :href="it.content"> 下载</a>
									</div>
								</div>
							</div>

							<div v-else class="file" @click="yuyin_check(it , index)">
								<div v-if="it.user_id!=user_id">

									<img src="../../../static/img/yinpin.png" class="yinpin" />
									<span style="padding-left:10px;float:right; margin-top:5px;margin-right: 5px;">
									{{it.type.split("卍")[1]}} "</span>
								</div>
							</div>
						</div>
						<div class="list_left_time" v-if="it.type==0">
							{{it.content}}
						</div>
						<div class="clear"></div>
					</div>
				</div>

				<div>
					<div style="height:30px;overflow: hidden;text-indent: 10px;margin-top: 10px;">
						<el-upload class="upload-demo" :action="actionurl" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" :on-exceed="handleExceed" :on-success="handleAvatarSuccess">
							<img src="../../../static/img/img.png" class="img" />
						</el-upload>
					</div>
					<textarea value="" v-model="sendmsg" placeholder="请输入内容" class="sendmsg" ref="send_msg" />


					<el-button type="primary" class="send" @click="send">发送</el-button>
				</div>

			</div>
		</div>
	</div>
</template>

<script>
	import {
		chat_left_list,
		getTalkHistory,
		saveSingleTalk,
		startToSingleTalk,
		clearUnread,
		getBusiness,
		auditGarage,
		resetPassword,
		updateQrCode,
		salesmanList,
		changeGarageInfo
	} from "../../request/api.js";
	import moment from "moment";

	//1是type: 1 =在线 2离线   3已转接
	export default {
		data() {
			return {
				num: 0,
				chatmsg: "",
				user_info: "",
				user_id: "",
				to_user_id: "",
				chat_id: "",
				k_page: 1,
				k_count: 1,
				k_page_size: 10,
				input: '',
				userlist_true: false,
				more_title: "点击加载更多",
				// chat_count:0,
				servers: false,
				chatList: false,
				search_content: "",
				autoplay: false,
				item: [],
				defaultimg: '', //错误显示默认图
				message_type: 1, //1是消息  0是时间  'image':2;  'video': 3;  'mp3';4  'data';5
				actionurl: "/chat/index/index/upload?token=" + localStorage.getItem("k2_token"),
				chat_list: [],
				imageUrl: "",
				userlist: [],

				bgci: 0,
				fileList: [],
				name_search: "",
				last_name: "", //文件名
				tableData: [],
				list: [],
				editPartsForm: [],
				orderNavActive: 0,
				dialogVisible2: false,
				maxHeight: undefined,
				search: {
					name: ""
				},
				pageLength: null,
				size: 10,
				page: 0,
				dialogVisible: false,
				src: "",
				// editPartsForm: {}, //修改修理厂
				uploadInfo: {},
				sendmsg: "",
				// 
				value: "",
				type: 1, //消息类型 1是信息

				yuyin_url: ""

			}
		},
		methods: {
			yuyin_check(it, index) {
				this.yuyin_url = new Audio(it.content);
				this.yuyin_url.play();
			},
			// --------------------------
			k_img(it) {
				this.$alert('<img src="' + it.content + '" style="max-height: 400px;max-width: 400px;">', '图片显示', {
					dangerouslyUseHTMLString: true
				});
			},
			socket_init() {
				this.socketApi.sendSock({
					"type": "init",
					"user_id": this.user_id
				}, this.getConfigResult);
			},
			onDivInput(e) {
				this.sendmsg = e.target.innerHTML;
			},
			cli_bgc(index, it) {
				console.log(it)
				this.bgci = index;
				this.chatmsg = it
				this.chatList = true;
				this.chat_id = it.id;
				this.user_info = it
				this.to_user_id = it.to_user_id;
				this.chat_list = [];
				this.k_page = 1;
				this.getTalkHistory();
				this.clearUnread(index, it.id, it.to_user_id)
			},
			overchat2() {
				this.chatList = false;
				this.servers = false;
				this.chatmsg = "";
				this.yuyin_url.pause();
				
			},
			overchat() {
				this.chatList = false;
				this.servers = false;
				this.yuyin_url.pause();
				const data = {
					"type": "end_talk",
					"user_id": this.user_id,
					"to_user_id": this.to_user_id,
					"talk_id": this.chatmsg.id
				}

				this.socketApi.sendSock(data, this.getConfigResult);

				//将会话状态改为结束
				for(var i = 0; i < this.item.length; i++) {
					if(this.item[i].id == this.chatmsg.id) {
						this.item[i].status = 2
					}
				}

				this.chatmsg = "";
				this.sendmsg = ""
			},
			// 转接
			transfer() {
				this.servers = !this.servers;
				this.userlist = ""
				this.socketApi.sendSock({
					"type": "get_user",
					"user_id": this.user_id
				}, this.getConfigResult);

			},
			//获取转接列表
			transfer_cli(it) {
				console.log(it);
				this.socketApi.sendSock({
					"type": "change_user",
					"user_id": it.id,
					talk_id: this.chatmsg.id,
					"to_user_id": this.chatmsg.to_user_id
				}, this.getConfigResult);
				// 被转接
				this.servers = false;
				this.chatList = false;
				this.$message({
					message: '转接成功',
					type: 'success'
				});
				this.start()

			},

			start() {
				const data = {
					user_id: this.user_id
				};
				chat_left_list(data).then(res => {
					if(res.data.code == 200) {

						// this.item = res.data.data;
						// if(this.item.length>0){
						// 	this.user_info = this.item[0];
						// }

						for(var i = 0; i < res.data.data.length; i++) {
							if(res.data.data[i].real_name != null) {
								this.item.push(res.data.data[i])
							}
						}

						// 存储聊天列表
						//先获得，如果原来有则覆盖unread ，再存储
						var k_msglistcount = JSON.parse(localStorage.getItem("k2_msglist"));
						if(k_msglistcount) {
							for(var i = 0; i < this.item.length; i++) {
								for(var j = 0; j < k_msglistcount.length; j++) {
									if(this.item[i].id == k_msglistcount[j].id && this.item[i].to_user_id == k_msglistcount[j].to_user_id) {
										this.item[i].unread = k_msglistcount[j].unread
									}
								}
							}
						}

						if(this.item.length > 0) {
							this.user_info = this.item[0];
						}

						const k_msglist = JSON.stringify(this.item)
						localStorage.setItem("k2_msglist", k_msglist);

					} else {
						this.$message.warning(res.data.msg);
					}

				});
			},
			//清除未读
			clearUnread(index, id, to_user_id) {
				const data = {
					id: this.chat_id
				};
				clearUnread(data).then(res => {
					if(res.data.code == 200) {
						this.item[index].unread = 0;

						// 清除缓存的未读数
						var k_msglistcount = JSON.parse(localStorage.getItem("k2_msglist"));
						if(k_msglistcount) {
							for(var i = 0; i < k_msglistcount.length; i++) {
								if(id == k_msglistcount[i].id && k_msglistcount[i].to_user_id == to_user_id) {
									k_msglistcount[i].unread = 0
								}
							}
						}
						localStorage.setItem("k2_msglist", JSON.stringify(k_msglistcount));

					} else {
						this.$message.warning(res.data.msg);
					}
				});
			},

			//上传
			handleAvatarSuccess(response, file, fileList) {
				console.log(response);
				this.message_type = response.data.data_type;
				this.sendmsg = response.data.url;
				this.last_name = response.data.last_name;
				this.send()
				this.sendmsg = "";
				this.message_type = 1;
				console.log(this.data_type)
			},
			// 获取历史消息
			getTalkHistory() {
				const data = {
					id: this.chat_id,
					page: this.k_page,
					page_size: this.k_page_size
				};
				getTalkHistory(data).then(res => {
					if(res.data.code == 200) {
						this.k_count = res.data.count ? res.data.count : 1
						for(var i = 0; i < res.data.data.length; i++) {
							// this.chat_list.push(res.data.data[i])
							this.chat_list.unshift(res.data.data[i])
						}
						if(this.k_page < 2) {
							this.scrolltop()
						}

					} else {
						this.$message.warning(res.data.msg);
					}
				});
			},
			// 发送信息
			send() {
				var content = ""
				if(this.sendmsg == "") {
					this.$message({
						message: '内容不得为空！',
						type: 'warning'
					});
					return false
				}
				if(this.chatmsg == "") {
					this.$message({
						message: '请选择聊天！',
						type: 'warning'
					});
					return false
				}

				try {
					const num = this.chat_list.length;
					const created_at = this.chat_list[num - 1].created_at; //15分钟后的时间是 +15*60

					console.log(created_at)

					const nowtime = Math.round(new Date() / 1000)
					const jiantime = nowtime - created_at;
					//600是10 分钟
					console.log(jiantime)
					if(jiantime > 600) {
						this.message_type = 0 //2是时间
						content = new Date().toLocaleString();
					} else {
						content = this.sendmsg
					}
				} catch(e) {
					content = this.sendmsg
				}

				const data = {
					"type": "push",
					"user_id": this.user_id,
					"to_user_id": this.to_user_id,
					"message_type": this.message_type,
					"last_name": this.last_name,
					"talk_id": this.chatmsg.id,
					"talk_status": this.chatmsg.status, //1 会话中 2结束会话
					"created_at": Math.round(new Date() / 1000),
					"head_img": JSON.stringify(localStorage.getItem("userInfo")).avatar ? JSON.stringify(localStorage.getItem("userInfo")).avatar : "/static/img/head.png",
					"content": content
				}
				this.socketApi.sendSock(data, this.getConfigResult);
				var data_chat = {
					single_talk_id: this.chatmsg.id,
					content: content,
					type: this.message_type,
					user_id: this.user_id,
					last_name: this.last_name,
					created_at: Math.round(new Date() / 1000),
					head_img: JSON.stringify(localStorage.getItem("userInfo")).avatar ? JSON.stringify(localStorage.getItem("userInfo")).avatar : "/static/img/head.png",
				}
				console.log(data_chat)
				this.chat_list.push(data_chat);
				this.saveSingleTalk(data_chat);

				//将会话状态改为会话中
				for(var i = 0; i < this.item.length; i++) {
					if(this.item[i].id == this.chatmsg.id) {
						this.item[i].status = 1
					}
				}

			},
			//保存消息
			// 获取历史消息
			saveSingleTalk(data) {
				saveSingleTalk(data).then(res => {
					if(res.data.code == 200) {
						if(this.message_type == 0) {
							// 如果是时间再传值
							this.message_type = 1;
							this.sendmsg = this.$refs.send_msg.value
							this.send();
						}
						this.sendmsg = ""
						this.scrolltop()
					} else {
						this.$message.warning(res.data.msg);
					}
				});
			},
			//更多
			more() {
				if(this.chat_list.length * 1 >= this.k_count) {
					this.more_title = "暂无数据哦，亲！"
					return false
				} else {
					this.k_page++;
					this.getTalkHistory();
				}
			},
			// 下拉
			scrolltop() {
				clearTimeout(sett)
				var sett = setTimeout(() => {
					this.$nextTick(() => {
						let list = this.$refs.box;
						try {
							list.scrollTop = list.scrollHeight
						} catch(e) {}
					})
				}, 100)
			},
			//创建聊天室
			startToSingleTalk(data) {
				startToSingleTalk(data).then(res => {
					if(res.data.code == 200) {

					} else {
						this.$message.warning(res.data.msg);
					}
				});
			},
			// 获得长链接消息 接收
			getConfigResult(res) {
				if(res.type == "push") {
					var audio = document.querySelector('#audio');
					try {
						audio.play();
					} catch(e) {

					}
					if(this.chatmsg == "") {
						for(var i = 0; i < this.item.length; i++) {
							if(this.item[i].to_user_id == res.user_id) {
								this.item[i].unread = this.item[i].unread * 1 + 1
							}
						}

						// 增加未读数 每次存缓存
						const k_msglist = JSON.parse(localStorage.getItem("k2_msglist"));
						if(k_msglist) {
							for(var i = 0; i < k_msglist.length; i++) {
								if(k_msglist[i].to_user_id == res.user_id) {
									k_msglist[i].unread = k_msglist[i].unread * 1 + 1;
								}
							}
						}

						localStorage.setItem("k2_msglist", JSON.stringify(k_msglist))
						this.item = k_msglist;

						// 消息提醒
						var k_msgcount = 1;
						localStorage.setItem("k2_msgcount", k_msgcount);
						// 传值给left
						const data = {
							k2_msgcount: k_msgcount
						}
						this.$root.eventHub.$emit('eventName', data)

					}

					res.type = res.message_type;
					this.chat_list.push(res);
					this.scrolltop();

					if(this.item.length < 1) {
						this.start()
					}

				} else if(res.type == "get_user") {
					// 获取转接人
					this.userlist = res.data;
					if(res.data.length < 1) {
						this.userlist_true = true
					}
				} else if(res.type == "change_user") {
					// 被转接
					// this.servers = false;
					this.$message({
						message: res.content,
						type: 'success'
					});
					this.start()
				} else if(res.type == "end_talk") {
					// 结束聊天
					this.start()
				}
				console.log(res)
			},

			// -----------------
			dialogVisibleQ() {
				this.$refs.addFormRef.resetFields();
				this.$refs.uploadImg.clearFiles();
				this.$refs.uploadImg2.clearFiles();
				this.editPartsForm.doorPic = "";
				this.editPartsForm.businessLicensePic = "";
				this.dialogVisible2 = false;
			},
			//提交修改

			init() {
				const data = {
					size: this.size,
					page: this.page,
					status: this.orderNavActive,
					name: this.search.name
				};
				getBusiness(data).then(res => {
					// console.log(res.data);
					const result = res.data;
					this.pageLength = result.pageInfo.total + 10;
					this.tableData = result.data;
				});
			},
			nextPage(page) {
				this.page = page - 1;
				this.init();
			},
			orderTab(index) {
				this.orderNavActive = index;
				this.page = 0;
				this.init();
			},
			viewPhoto(url) {
				this.src = url;
				this.dialogVisible = true;
			},
			getRow(row) {
				this.uploadInfo = row;
			},

			handleRemove(file, fileList) {
				console.log(file, fileList);
				console.log(1);
			},
			handlePreview(file) {
				console.log(file);
				console.log(2);
			},
			handleExceed(files, fileList) {
				console.log(3);
				this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			beforeRemove(file, fileList) {
				console.log(4);
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			// ---------------

			handleEnterThing() {
				if(this.value != "") {
					this.socketApi.sendSock(QQi, this.getConfigResult);
				}
			},
		},
		created() {
			this.init();
			this.user_id = localStorage.getItem("k2_userId");
			this.socketApi.getSock(this.getConfigResult);
		},
		mounted() {
			this.maxHeight = $(".tabBox").height() - 230;
			// this.socket_init();
			this.start();
		},
		computed: {
			chat_count() {
				var num = 0;
				for(var i = 0; i < this.item.length; i++) {
					num = num + this.item[i].unread
				}
				return num
			},
			item_search() {
				return this.item.filter(k => {
					return k.real_name.match(this.search_content)
				})
			}

		}
	}
</script>

<style scoped="scoped">
	.yinpin {
		width: 25px;
		height: 25px;
		margin-top: 5px;
		cursor: pointer;
	}
	
	.video video {
		width: 140px;
		height: 120px;
	}
	
	.file {
		background-color: #FFFFff;
	}
	
	.file_img {
		width: 50px;
		height: 50px;
		float: left;
		margin-top: 10px;
		margin-right: 20px;
	}
	
	.file_div {
		float: left;
		font-size: 12px;
	}
	
	.file_div>div:nth-child(1) {
		color: #000000;
	}
	
	.file_div a {
		color: #0dc4ec;
	}
	
	#audio {
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
	}
	
	div[contenteditable]:empty:not(:focus):before {
		content: attr(placeholder);
		color: #aaa;
	}
	
	.el-row {
		margin-bottom: 20px;
		&:last-child {
			margin-bottom: 0;
		}
	}
	
	.el-col {
		border-radius: 4px;
		margin-left: 30px;
		margin-top: 20px;
	}
	
	.bg-purple {
		border: 1px solid #d3dce6;
		padding-bottom: 20px;
	}
	
	.bg-purple-light {
		border-top: 1px solid #eeeeee;
	}
	
	.grid-content {
		border-radius: 4px;
		min-height: 36px;
	}
	
	.row-bg {
		padding: 10px 0;
		background-color: #f9fafc;
	}
	.k_left {
		width: 100px;
		height: 100%;
	}
	
	.k_title {
		width: 100%;
		text-align: center;
		line-height: 50px;
		height: 50px;
		font-size: 18rpx;
		background-color: #f0f0f0;
	}
	
	.chat_input {
		width: 90%;
		display: block;
		margin: auto;
		margin-top: 10px;
	}
	
	.k_type {
		color: #04B404;
	}
	
	.k_type2 {
		color: #d6d4cd;
	}
	
	.k_type3 {
		color: #b40909;
	}
	.k_list {
		width: 100%;
		height: auto;
		border-top: 1px solid #eeeeee;
		position: relative;
		transition: .3s;
		padding-bottom: 10px;
	}
	
	.k_list:hover {
		background-color: #f4f4f4;
		cursor: pointer;
	}
	
	.check_bgc {
		background-color: #f4f4f4;
	}
	
	.k_list_count {
		position: absolute;
		right: 10px;
		top: 10px;
		border-radius: 50%;
		background-color: red;
		color: #FFFFFF;
		text-align: center;
		width: 22px;
		line-height: 22px;
		font-size: 12px;
		height: 22px;
		height: 22px;
	}
	
	.k_list_a {
		width: 100%;
		padding-top: 10px;
	}
	
	.k_list_a>div {
		float: left;
		height: 30px;
	}
	
	.k_list_a_a {
		width: 45%;
		font-size: 14px;
		text-indent: 6px;
		overflow: hidden;
		white-space: nowrap;
		font-weight: bold;
		text-overflow: ellipsis;
	}
	
	.k_list_a_b {
		width: 40%;
		font-size: 10px;
		overflow: hidden;
		white-space: normal;
		color: #ddd7cf;
		text-align: right;
		text-overflow: ellipsis;
	}
	
	.k_list_b>div {
		float: left;
	}
	
	.k_list_b_a {
		width: 70%;
		font-size: 12px;
		text-indent: 6px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	.k_list_b_b {
		width: 25%;
		font-size: 10px;
		overflow: hidden;
		white-space: normal;
		text-align: right;
		text-overflow: ellipsis;
	}
	
	.img {
		width: 30px;
		height: 30px;
	}
	.orderUl li {
		float: left;
		padding: 4px 18px;
		border-radius: 5px;
		cursor: pointer;
		margin-left: 10px;
		transition: 0.5s;
		font-size: 16px;
	}
	
	.yinye {
		float: left;
		width: 80px;
		padding: 0 12px 0 0;
		text-align: right;
		vertical-align: middle;
	}
	
	.orderUl li:hover {
		background: rgba(0, 0, 0, 0.1);
		transition: 0.5s;
	}
	
	.orderUl li.active {
		background: #3ac29f;
		color: #fff;
	}
	
	.xiugai {
		margin-bottom: 8px;
		width: 125px;
		margin-left: 8px;
	}
	
	.gu_title {
		text-align: center;
		line-height: 30px;
		height: 32px;
		font-size: 15px;
		font-weight: bold;
		border-bottom: 1px solid #ececec;
	}
	.gu_list tr td {
		padding: 5px 0;
	}
	
	.gu_list tr td:nth-child(1) {
		width: 80px;
		text-align: right;
	}
	
	.gu_list tr td:nth-child(2) {
		width: 120px;
	}
	
	.p-20 {
		padding: 2px 0;
	}
	
	.order {
		font-size: 13px;
		height: 35px;
		line-height: 35px;
	}
	.k_chat {
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 10;
		margin: auto;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
	}
	
	.k_chat_hide {
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: rgba(0, 0, 0, 0.1);
	}
	
	@media screen and (max-width: 1366px) {
		.k_chat_body {
			zoom: 0.7;
		}
	}
	
	.k_chat_body {
		width: 600px;
		height: 610px;
		margin: auto;
		border-radius: 8px;
		box-shadow: 0 0 3px #ccc;
		position: absolute;
		left: 0;
		right: 0;
		top: 20%;
		background-color: #FFFFFF;
	}
	
	.k_chat_body_title {
		width: 100%;
		border-bottom: 1px solid #f3f3f3;
		height: 50px;
		line-height: 50px;
	}
	
	.k_chat_body_zs {
		width: 200px;
		float: left;
		text-indent: 10px;
	}
	
	.k_chat_body_zs2 {
		width: 200px;
		text-align: right;
		float: right;
		margin-right: 10px;
	}
	
	.k_chat_body_zs2>span {
		cursor: pointer;
		margin-right: 10px;
		color: #0099FF;
	}
	
	.userlist {
		width: 200px;
		height: 300px;
		position: absolute;
		right: 30px;
		top: 55px;
		border-radius: 5px;
		background-color: #FFFFFF;
		box-shadow: 0 0 20px #e6e2e2;
	}
	
	.userlist_a {
		width: 100%;
		height: 50px;
		line-height: 50px;
		color: #000000;
		text-align: center;
		border-bottom: 1px solid #d9d7d6;
	}
	
	.userlist_b {
		overflow: auto;
		height: 250px;
		width: 100%;
	}
	
	.userlist_b>div {
		cursor: pointer;
		transform: .5s;
	}
	
	.userlist_b>div:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}
	
	.userlist_list {
		width: 100%;
		height: 50px;
		line-height: 50px;
		border-bottom: 1px solid #f0efee;
	}
	
	.userlist_list_kf {
		width: 85px;
		text-indent: 5px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: center;
		color: #14d8ff;
		float: left;
	}
	
	.userlist_list_name {
		width: 100px;
		text-indent: 5px;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		float: left;
	}
	
	.k_chat_body_list {
		width: 96%;
		margin: auto;
		height: 350px;
		overflow-y: auto;
		border-bottom: 1px solid #f3eeee;
	}
	
	.k_chat_body_list>div {
		margin: 20px 0;
	}
	
	.k_chat_body_more {
		text-align: center;
		line-height: 35px;
		font-size: 10px;
		cursor: pointer;
		color: #cbcbcb;
	}
	
	.list_left {
		width: 400px;
		float: left;
	}
	
	.list_left>div {
		float: left;
		max-width: 300px;
		word-wrap: break-word;
		margin-left: 3px;
		background-color: #f4f9df;
		border-radius: 4px;
		padding: 2px 5px;
	}
	
	.list_left>img {
		float: left;
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}
	
	.list_right {
		width: 400px;
		float: right;
	}
	
	.k_img {
		max-width: 100px;
		max-height: 100px;
	}
	
	.list_right>div {
		float: right;
		word-wrap: break-word;
		max-width: 300px;
		background-color: #eff9f8;
		border-radius: 4px;
		padding: 2px 5px;
	}
	
	.list_right>img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		float: right;
		margin-left: 3px;
	}
	
	.list_left_time {
		text-align: center;
		width: 260px;
		margin: auto;
		font-size: 12px;
		height: 30px;
		line-height: 30px;
		margin-top: 10px;
		background-color: #f3efed;
		margin-bottom: 10px;
	}
	
	.set_ui {
		width: 90%;
		height: 40px;
		margin: auto;
		line-height: 80px;
	}
	
	.sendmsg {
		width: 90%;
		border: none;
		height: 100px;
		border-bottom: 1px solid #e7e7e7;
		margin: auto;
		resize: none;
		display: block;
		outline: none;
		margin-top: 10px;
	}
	
	.send {
		margin-top: 10px;
		float: right;
		margin-right: 5%;
	}
	
	.userlist_true {
		text-align: center;
		line-height: 50px;
		font-size: 14px;
		color: #ee584d;
	}
</style>
<style>
	.xiu .el-form-item__content {
		margin-left: 0 !important;
	}
	
	.xiu .el-upload-list__item-actions {
		width: 80px;
		height: 80px;
	}
	
	.xiu .el-upload-list--picture-card .el-upload-list__item-thumbnail {
		width: 80px;
		height: 80px;
	}
	
	.xiu .el-upload-list__item {
		width: 80px;
		height: 80px;
	}
	
	.xiu .el-dialog--center .el-dialog__body {
		padding: 5px 25px 30px;
	}
	
	.xiu .el-input__inner {
		height: 35px;
	}
	
	.xiu .el-form-item {
		margin-bottom: 10px;
	}
	
	.xiu .el-upload--picture-card {
		width: 80px;
		height: 80px;
		line-height: 80px;
	}
	
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	
	.avatar-uploader .el-upload:hover {
		border-color: #409eff;
	}
	
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 100px;
		height: 100px;
		line-height: 100px;
		text-align: center;
	}
	
	.avatar {
		width: 100px;
		height: 100px;
		dsplay: block;
	}
</style>-->