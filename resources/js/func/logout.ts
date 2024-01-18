

//如果api接收到401错误，则清空LocalStorage中所有认证信息，并跳转回首页
function userLogout() {
    localStorage.removeItem('Binggan')   //如果遇到401错误(用户未认证)，就清除Binggan和Token
    localStorage.removeItem('Token')
    window.location.href = "/"; //因为希望重头刷新整个程序状态，所以用js原生的重定向，而不是Vuerouter的push
    // delete axios.defaults.headers.Authorization;
}

export { userLogout }