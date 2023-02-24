const express=require('express')
const path = require("path");
const app=express();
app.use(express.static(path.join(__dirname, 'public')));//该处需要修改，我的静态网页是放在public目录下
const { createProxyMiddleware } = require('http-proxy-middleware');

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
    // 设置是否运行客户端设置 withCredentials
    // 即在不同域名下发出的请求也可以携带 cookie
    res.header("Access-Control-Allow-Credentials", true)
    // 第二个参数表示允许跨域的域名，* 代表所有域名  
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS') // 允许的 http 请求的方法
    // 允许前台获得的除 Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma 这几张基本响应头之外的响应头
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    if (req.method == 'OPTIONS') {
        res.sendStatus(200)
    } else {
        next()
    }
});
var targetUrl = "https://coc.heiyu100.cn/wx/";
// 拦截http://localhost:3000/admin/*  的请求，转到目标服务器:https://coc.heiyu100.cn/wx/*   
app.use('/hycoc.aspx/', createProxyMiddleware({ target: targetUrl, changeOrigin: true }));

app.get('/', () => {
    return '/index.html';
});

app.listen(80, () => {
    console.log('服务器启动成功！请在浏览器中打开网址：http://localhost:80/index.html');
});
