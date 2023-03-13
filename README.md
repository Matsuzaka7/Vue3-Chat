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



## 注意

启动后如果连接失败，

请找到 `根目录/.env` 文件，修改其中的 `VITE_APP_BASE_WSS_URL` 与 `VITE_APP_BASE_HTTP_URL` 变量为本机ip

本机ip查看方法：`ipconfig` 



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




## notUser

> 该类型本应该在http请求中，但忘记迁移过去了。先用着

用户进入时根据ip查找一次用户名返回给用户，查找失败时返回

```js
{
    type: "notUser",
    data: false
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





# http请求解释

## setUserName

设置用户名，当用户第一次访问时，输入用户名确认后触发

- 请求方式：`post`

- 需要的参数
  - 用户名：name
- 返回的参数
  - 缺少参数：`{ type: 'err', data: '缺少参数' }`
  - 名称重复：`{ type: "rejectUserName", data: false }`
  - 设置成功：`{ type: "succeedUserName", data: true }`



## getUserName

如果取过名的用户的ip变化了，则触发该请求。用于获取新ip与用户名

- 请求方式：`post`

- 需要的参数
  - 用户名：name
- 返回的参数
  - 缺少参数：`{ type: 'err', data: '缺少参数' }`
  - 查找成功：`{ type: "succeedUserName", data: true }`
  - 查找失败：`{ type: "notUser", data: false }`



## uploadImg

当用户上传图片时触发该事件

- 请求方式：`post`
- 需要的参数：
  - 图片的base64格式，并且使用formData包裹的对象
- 返回的参数：
  - 可能是form解析失败：
    - `{ type: "err", data: '意外错误E1，请稍后重试' }`
  - 图片的base64没有接收到
    - `{ type: "err", data: '意外错误E2，请稍后重试' }`
  - 图片保存失败，可能是没有该路径，请检查路径
    - `{ type: 'saveImage', data: false }`
  - 图片保存成功
    - `{ type: 'saveImage', data: true}`



## uploadFile

用户上传文件时触发该事件

- 请求方式：`post`
- 需要的参数
  - userName：用户名
  - fileData：表单对象
- 返回的参数
  - 可能是form解析失败：
    - `{ type: "err", data: '意外错误E1，请稍后重试' }`
  - 缺少参数
    - `{ type: "saveFile", data: false }`
  - 保存成功
    - `{ type: 'saveFile', data: true}`



## loadMoreInfo

用户滚动到顶部时，加载更多数据将会发送该类型给服务器，服务器收到后将会返回 `loadMoreData`
- 请求方式：`post`
- 请求路径: `loadMoreInfo`
- 需要的参数
    - page, // 当前页数
    - limit // 每页的条数

- 返回的参数
    - ```js
{
    type: "loadMoreData",
    data: {
        isMore: boolean, // 表示告诉用户是否还有更多数据
        data: []	 	 // 返回的数据
    }
}
```

