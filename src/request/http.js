import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import router from '../router'

import {
  MessageBox,
  Message
} from 'element-ui';

axios.defaults.timeout = 90000


axios.interceptors.request.use(
  config => {
       let token = window.localStorage.getItem("token")
				if(token) {
					config.headers.authorization = token;
					return config;
				}
    return config
  },
  error => {
    return Promise.reject(err)
  }
)
axios.interceptors.response.use(
  response => {
    
    if (response.data.code === 200) {
      return response;
    }else {
      Message({
        message: response.data.message,
        type: 'warning'
      });
      return response;
    }
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
         Message({
            message: "登录失败或已过期，请重试！",
            type: 'warning'
          });
          router.push({
            path: '/login/login'
          })
      }
    }
    return Promise.reject(error)
  }
)

export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get("/api" + url, {
      params: params
    })
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
  })
}


// ------chat------------


export function postChat(url, data = {}, headers = {}) {
	let k_token = window.localStorage.getItem("k2_token")
	console.log(k_token)
	Vue.set(data, 'token', k_token);

	if (Object.keys(headers).length == 0) {
		data = qs.stringify(data)
	} else {
		data = JSON.stringify(data)
	}
	return new Promise((resolve, reject) => {
		axios.post("/chat" + url, data, headers)
			.then(response => {
				resolve(response)
			}, err => {
				reject(err)
			})
	})
}



//--------------

export function post(url, data = {},headers={}) {
  if(Object.keys(headers).length == 0){
    data = qs.stringify(data)
  }else{
    data = JSON.stringify(data)
  }
  return new Promise((resolve, reject) => {
    axios.post("/api" + url, data,headers)
      .then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
  })
}

export function posts(url, params = {}) {
  return new Promise((resolve, reject) => {
        axios({
            url: "/api" + url,
            method: 'post',
            data: params,
            headers: {
              'Content-Type': 'application/json',
            }
        })
        .then(response => {
            resolve(response)
        }).catch(err => {
            reject(err)
        })
  })
}

export function put(url, params = {}) {
  return new Promise((resolve, reject) => {
        axios({
            url: "/api" + url,
            method: 'put',
            data: params,
            headers: {
              'Content-Type': 'application/json',
            }
        })
        .then(response => {
            resolve(response)
        }).catch(err => {
            reject(err)
        })
  })
}

export function deletes(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios({
      url: "/api" + url,
      method: 'delete',
      params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then(response => {
        resolve(response)
      }).catch(err => {
        reject(err)
      })
  })
}


export function open(url, params = {},title) {
  return new Promise((resolve, reject) => {
    axios.get("/api" + url, {
      params: params,
      responseType:'blob'
    })
      .then(response => {
        Message.closeAll()
        Message({
          message: "文件已开始下载！",
          type: "success"
        });
      　　var blob = new Blob([response.data], {type: 'application/vnd.ms-excel'});
      　　var downloadElement = document.createElement('a');
      　　var href = window.URL.createObjectURL(blob);
      　　downloadElement.href = href;
      　　downloadElement.download = title + '.xlsx';
      　　document.body.appendChild(downloadElement);
      　　downloadElement.click();
      　　document.body.removeChild(downloadElement);
      　　window.URL.revokeObjectURL(href); 
          })
      .catch(err => {
        reject(err)
      })
  })
}

