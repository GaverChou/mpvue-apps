const baseUrl = 'http://192.168.10.66:6001';
// const baseUrl = '';

const commonHeader = _ => {
  //headers每次必传数据存放位置
  return {
    // 'CityName': '',
    // 'LocationX': 0,
    // 'LocationY': 0,
  }
}

//get数据请求
const get = (opt = {}) => {
  let time = new Date().getTime();
  const str = Object.entries(opt.params).map(e => `${e[0]}=${e[1]}`).join("&").replace(/\s/g, '');
  let editHeaders = Object.assign({}, { 'content-type': 'application/json;charset=utf-8' }, commonHeader())
  if (opt.headers) {
    editHeaders = Object.assign({}, editHeaders, opt.headers)
  }
  return new Promise((resolve, reject) => {
    let address = str ? `${opt.url}?${str}&t=${time}` : `${url}?t=${time}`;
    wx.request({
      url: baseUrl + address,
      header: editHeaders,
      method: "GET",
      success: res => {
        setTimeout(_ => {
          resolve(res.data)
        }, 0)
      },
      fail: err => {
        reject(err);
      }
    })
  })
}

//post数据请求
const post = function (opt = {}) {
  let time = new Date().getTime();
  //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  let editHeaders = Object.assign({}, { 'content-type': 'application/json;charset=utf-8' }, commonHeader())
  if (opt.headers) {
    editHeaders = Object.assign({}, editHeaders, opt.headers)
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseUrl}${opt.url}?t=${time}`,
      data: opt.data || {},
      header: editHeaders,
      method: "POST",
      success: res => {
        setTimeout(_ => {
          if (res.State == 1) {
            //返回正常的数据
            resolve(res.data)
          } else if (res.State == -10) {
            //针对token失效问题
            resolve(res.data)
          } else {
            //抛出异常
            reject(res.data)
          }
        }, 0)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

//格式化时间  date时间对象  fmt时间格式 如yyyy/MM/dd hh:mm:ss
const FmtTime = (date, fmt) => {
  var o = {
    "M+": date.getMonth() + 1, //月份   
    "d+": date.getDate(), //日   
    "h+": date.getHours(), //小时   
    "m+": date.getMinutes(), //分   
    "s+": date.getSeconds(), //秒   
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
    "S": date.getMilliseconds() //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

export default { get, post, FmtTime };
