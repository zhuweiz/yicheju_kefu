import Cookies from 'js-cookie'

Storage.prototype.setExpire = (key, value, expire) => {
  let obj = {
  data: value,
  time: Date.now(),
  expire: expire
  };
  localStorage.setItem(key, JSON.stringify(obj));
}

Storage.prototype.getExpire = key => {
  let val = localStorage.getItem(key);
  if (!val) {
      return val;
  }
  val = JSON.parse(val);
  if (Date.now() - val.time > val.expire) {
      localStorage.removeItem(key);
      return null;
  }
  return val.data;
}
 
export function getCookie () {
  return Cookies.get()
}
 
export function setCookie () {
  return Cookies.set()
}
 
export function removeCookie () {
  return Cookies.remove()
}

