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



如果连接失败，请找到 `src/App.vue` 的第49行进行修改 ws地址，改为自己本机`ip4地址`，或`localhost` ，或`127.0.0.1`

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
            id,
            time,
            userIP,
            value
        }
    ]
}
```



## newInfo

当用户给服务器发送一条消息后，服务器将会把该消息进行广播发给每一位用户

```js
{
      type: "newInfo",
      data: {
        id,
        time,
        userIP,
        value
      }
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



## loadMoreData

用户滚动到顶部时触发的事件，服务器将会返回更多聊天数据给用户

```js
{
    type: "loadMoreData",
    data: {
        isMore: boolean, // 表示告诉用户是否还有更多数据
        data: []	 	 // 返回的数据
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



## loadMoreInfo

用户滚动到顶部时，加载更多数据将会发送该类型给服务器，服务器收到后将会返回 `loadMoreData`

```js
{
    type: 'loadMoreInfo',
    data: {
        page, // 当前页数
        limit // 每页的条数
    }
}
```





# 其他

当前项目只有一个页面，因此后端只有一个服务文件，不会进行模块拆分
