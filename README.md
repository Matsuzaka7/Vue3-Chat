项目预览：[http://47.95.112.111/](http://47.95.112.111/)
****
# 启动项目

启动前请确保电脑已安装`nodejs`

之后输入以下命令

## 启动前端

```bash
npm install
npm run dev
```



## 启动后端

**打开end目录 输入以下命令**

```bash
npm install
node app.js
```



# ws响应消息解释

通常，消息会以以下格式返回

```js
{
    type: '类型',
    data: '数据'
}
```

> 并且所有响应消息会以base64的形式进行传输，可自行加密



## userIP

当用户初次访问网站时，服务器会获取一次ip，并且返回给用户作为名称的唯一标识

```js
{
    type: "userIP",
    data: ip,
}
```



## notice

当用户初次访问网站时，服务器会给用户底部的描述文字

```js
{
    type: "notice",
    data: "友好交流，有bug反馈哦",
}
```



## infoData

当用户初次访问网站时，服务器会给用户当前所有的消息（后续会改为：只给20条，更多的需要上拉进行加载）

```js
{
    type: "infoData",
    data: [
        {
            time,
            userIP,
            value
        }
    ]
}
```



## personList

每当有一个用户访问网站时，会给当前所有已连接的用户发送当前的用户列表

```js
{
    type: "personList",
    data: {
      personList: []
    }
}
```



## ~~rejectWs~~

当用户在同一ip打开了多个页面时，会返回该类型数据，并且程序不会往下执行

```js
{
     type: 'rejectWs',
     data: '同一ip请勿同时打开多个网页'
 }
```

> 该类型被废弃，在后端中已注释



# ws请求消息解释

客户端（用户）主动给服务器发送消息的解释



## addInfoData

往当前总消息中添加一条新消息

```js
{
    type:'addInfoData',
    data: ''
}
```



# 其他

当前项目只有一个页面，因此后端只有一个服务文件，不会进行模块拆分
