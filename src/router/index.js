import Vue from 'vue'
import Router from 'vue-router'
import notFound from '@/page/default/404'
Vue.use(Router)

//首页管理
import home from '@/page/home/home'
import page from '@/page/home/page'
import enquiry from '@/page/home/enquiry'
import business from '@/page/home/business'
import parts from '@/page/home/parts'
import chain from '@/page/home/chain'
import extension from '@/page/home/extension'
import shop from '@/page/home/shop'
import extInfo from '@/page/home/extInfo'
import setting from '@/page/home/setting'
import setting_huodong from '@/page/home/setting_huodong'
import setting_shangping from '@/page/home/setting_shangping'
import order_online from '@/page/home/order_online'
import order_meng from '@/page/home/order_meng'
import order_gong from '@/page/home/order_gong'

import login from '@/page/login/login';

import service_chat from '@/page/home/service_chat'

export default new Router({
	// mode:'history',
	routes: [
		// 缺省==============================
		{
			path: '*',
			name: 'notFound',
			component: notFound,
			meta: {
				title: '404',
				index: 5,
				animation: 'rotateIn'
			}
		},
		// 登录注册==============================

		// 首页管理==============================

		{
			path: '/',
			name: 'home',
			component: home,
			meta: {
				title: '易车驹',
				index: 0
			},
			children: [{
				path: '/',
				name: 'page',
				component: page,
				meta: {
					title: '易车驹',
					index: 0
				}
			},
			{
				path: '/home/business',
				name: 'business',
				component: business,
				meta: {
					title: '修理厂审核',
					index: 0
				}
			},
			{
				path: '/home/enquiry',
				name: 'enquiry',
				component: enquiry,
				meta: {
					title: '询价单管理',
					index: 0
				}
			},
			{
				path: '/home/parts',
				name: 'parts',
				component: parts,
				meta: {
					title: '配件商审核',
					index: 0
				}
			},
			{
				path: '/home/chain',
				name: 'chain',
				component: chain,
				meta: {
					title: '连锁门店',
					index: 0
				}
			},
			{
				path: '/home/extension',
				name: 'extension',
				component: extension,
				meta: {
					title: '平台推广',
					index: 0
				}
			},
			{
				path: '/home/extInfo/:id',
				name: 'extInfo',
				component: extInfo,
				meta: {
					title: '推广详情',
					index: 0
				}
			},
			{
				path: '/home/shop',
				name: 'shop',
				component: shop,
				meta: {
					title: '商品库',
					index: 0
				}
			},
			{
				path: '/home/service_chat',
				name: 'service_chat',
				component: service_chat,
				meta: {
					title: '客服',
					index: 0
				}
			},
			{
				path: '/home/setting',
				name: 'setting',
				component: setting,
				meta: {
					title: '易车驹',
					index: 0
				},
				children: [{
					path: '/home/setting_huodong',
					name: 'setting_huodong',
					component: setting_huodong,
					meta: {
						title: '易车驹',
						index: 0
					},

				},
				{
					path: '/home/setting_shangping',
					name: 'setting_shangping',
					component: setting_shangping,
					meta: {
						title: '易车驹',
						index: 0
					},

				}]
			},
			{
				path: '/home/order_online',
				name: 'order_online',
				component: order_online,
				meta: {
					title: '易车驹',
					index: 0
				},
				children: [{
					path: '/home/order_meng',
					name: 'order_meng',
					component: order_meng,
					meta: {
						title: '易车驹',
						index: 0
					},

				},
				{
					path: '/home/order_gong',
					name: 'order_gong',
					component: order_gong,
					meta: {
						title: '易车驹',
						index: 0
					},

				}]
			}

			],
		},
		{
			path: '/login/login',
			name: 'login',
			component: login,
			meta: {
				title: '易车驹',
				index: 0
			}
		}

	]
})