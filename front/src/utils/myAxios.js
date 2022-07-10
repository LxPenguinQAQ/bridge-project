import axios from 'axios';
import _this from "@/main.js"

const myAxios = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 50000,
    // headers: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    // },
    // withCredentials: true
})

// myAxios.defaults.withCredentials = true;

// 拦截器，请求头部统一添加token，同意错误处理
myAxios.interceptors.request.use(req=> {
    const token = localStorage.getItem('Token');
    if (token) {
        req.headers.Authorization  = `Bearer ${token}`;
    }
    return req;
}, err=> {
    _this.$Message.error(err.message);
})

myAxios.interceptors.response.use(res=>{
    if (res.data.status) _this.$Message.success(res.data.msg);
    return res.data;
}, err=> {
    if (err.response?.statusText === "Unauthorized") {
        _this.$Message.error("token expired, please login again");
        localStorage.removeItem("Token"); 
        _this.$router.replace("/");
    } else {
        _this.$Message.error(err.response.data.msg);
    }
})

export default myAxios;