# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：
- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档
- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

微信小程序云开发上传Excel并解析
Tasking
✅ 首先要能上传文件保存到云储存中
✅ 获取云存储中的文件解析并保存到数据库
✅ 获取数据库中数据展示到页面
✅ 页面上拉加载、下拉加载
功能列表
• 一个上传文件的按钮
• 一个数据展示的页面
页面搭建
基于lin-ui小程序组件库搭建页面样式：lin-ui
项目搭建
• 新建一个云开发小程序，新建成功后如下图（左图为模拟器效果、右图为文件目录）：
• 删除项目目录中冗余的文件夹及文件
• 安装lin-ui小程序组件库快速构建页面
• 进入miniprogram文件夹下执行下面的命令
npm init
or
yarn init
• 接着安装lin-ui
注意事项
• 1.执行npm init进行初始化，此时会生成一个package.json文件，如果不进行npm init，在构建npm的时候会报一个错误：没有找到 node_modules 目录
• 2.不建议使用cnpm，这样会带来一些未知的错误。如果网络情况不佳，可以使用下面的命令行更换为淘宝源。
npm config set registry https://registry.npm.taobao.org
npm install lin-ui
执行成功后，会在根目录里生成项目依赖文件夹 node_modules/lin-ui （小程序IDE的目录结构里不会显示此文件夹）控制台中如下图：
• 接着就是用小程序官方IDE打开我们的小程序项目，找到 工具 选项，点击下拉选中 构建npm ，等待构建完成后便会出现如下图所示：
以上我们完成了项目基本构建和功能需求的整理，接着就可以编码啦
编码
先写页面样式、然后js逻辑、最后就是云函数
引用lin-ui组件，因为button这种组件常用基础组件，所以就可以在 app.json 中全局引用，全局引用的好处就是不用再每个使用页面都手动引用一次
```json
{
    "pages": [
        "pages/index/index"
    ],
    "window": {
        "backgroundColor": "#F6F6F6",
        "backgroundTextStyle": "light",
        "navigationBarBackgroundColor": "#F6F6F6",
        "navigationBarTitleText": "云开发 QuickStart",
        "navigationBarTextStyle": "black"
    },
    "usingComponents": {
        "lin-button": "./miniprogram_npm/lin-ui/button/index"
    },
    "sitemapLocation": "sitemap.json",
    "style": "v2"
}
```
编写wxml的样式，这儿就直接使用lin-ui提供的组件样式及属性
```htnl
<lin-button type="success" size="long" bind:lintap="handleClickUpload">上传文件</lin-button>
```
接着编写点击事件的js逻辑代码
```javascript
// /pagas/index.js
/**
 * @description 上传文件
 */
handleClickUpload() {
    wx.chooseMessageFile({
        count: 1,
        type: 'file',
        success: async res => {
            const { name, path, size } = res.tempFiles[0]
            console.log(name, path, size)
        },
        fail: (err) => console.log(err)
    })
},
```
编写传入云存储的逻辑
我个人习惯是将交互逻辑与业务逻辑分开写，这样便于后期迭代、维护和更新，所以接下来在miniprogram文件夹中新建一个modles的文件夹，这里面全部都是数据交互逻辑，与wxml同级的js全部都是用户交互的逻辑
• 在modles中新建一个excel.js文件，接着编写一个上传文件的方法
```javascript
export default class Index {
    constructor() { }
    /**
     * @description 调用此方法上传一个文件
     * @param {*} cloudPath 要上传文件资源的路径
     * @param {*} filePath 云存储路径(如要将文件传入某个文件夹，传入参数时如：'text/1.png')
     * @returns 返回上传文件后的状态（成功/失败）
     */
    upload(cloudPath, filePath) {
        wx.cloud.uploadFile({
            cloudPath, // 云存储路径
            filePath, // 要上传文件资源的路径
        })
            .then(result => result)
            .catch(error => error)
    }
}
```
完善index.js中的handleClickUpload事件
```javascript
/**
 * @description 上传文件
 */
handleClickUpload() {
    wx.chooseMessageFile({
        count: 1,
        type: 'file',
        success: async res => {
            const { name, path, size } = res.tempFiles[0]
            const { errMsg, statusCode } = await indexModel.upload(`test/${name}`, path)
            wx.showToast({
                icon: 'none',
                title: statusCode == 200 ? '上传成功！' : '上传失败！',
            })
        },
        fail: (err) => console.log(err)
    })
},
```
现在我们就可以去上传文件，选择文件上传后提示上传成功，就可以去云控制台查看刚刚上传的文件啦！先来一张成功后的截图吧！
以上我们完成了文件上传，接下来就可以编写解析Excel文件的云函数啦
在编写云函数之前我们先来简单了解下解析Excel的解析器吧！
node-xlsx 主要用于转换xlsx数据和读取xlsx的文件数据；
若需深入了解可进入node-xlxs
新建一个云函数：以我这个项目的文件目录为例；右击cloudfunction---->新建node.js云函数---->输入云函数的名称（我这里是上传文件用的，就叫excel吧），输入完成回车后，就会自动生成文件如下图所示：
云函数文件建好后，进入excel下的index.js，删除与本功能无关的代码；删除后如下图所示：
```javascript
// 云函数入口文件
const cloud = require('wx-server-sdk')
// 在调用cloud中的api前，必须先初始化
cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  return {}
}
```
接下来就可以编写解析数据及保存到数据库的云函数相关逻辑；
```javascript
// 云函数入口文件
const cloud = require('wx-server-sdk')
const xlxs = require('node-xlsx')
cloud.init({ env: 'mini-lin-nnbmo' })
// 云函数入口函数
exports.main = async (event, context) => {
    const DB = cloud.database()
    // 获取要解析文件的fileID
    const { fileID } = event
    // 1、通过fileID下载云存储里的Excel文件
    const res = await cloud.downloadFile({ fileID })
    const buffer = res.fileContent
    // 存储所有的添加操作数据
    const tasks = []
    // 2、解析Excel文件里的数据
    const sheets = xlxs.parse(buffer) // 获取到所有的sheets
    
    sheets.forEach(sheet => {
        for (const key in sheet['data']) {
            const row = sheet['data'][key] //第几行数据
            if (row && key > 0) {
                //3，把解析到的数据存到excel数据表里
                const promise = DB.collection('excel')
                    .add({
                        data: {
                            bookname: row[0], // 书名
                            bookid: row[1], // 书籍id
                            magid: row[2], // 杂志id
                            image: row[3], // 图片
                            inventory: row[4], // 库存
                        }
                    })
                tasks.push(promise)
            }
        }
    })
    // 等待所有数据添加完成
    return await Promise.all(tasks).then(res => ({ res })).catch(error => error)
}
```
以上就完成了文件上传、解析并保存数据库，接着构建一个从数据库中获取数据并展示的页面；在pages下新建一个 list 文件夹，然后右击选择新建page输入 list ，文件目录构建成功后我们依然使用lin-ui快速构建界面，其中使用的组件card，使用前先在list.json文件中引入 card 组件。
• 构建list.wxml文件
```html
<lin-card type="primary" l-class="card" image="{{item.image}}" title="杂志id：{{item.bookid}}" wx:for="{{list}}" wx:key="index">
    <view class="content">杂志名称：{{item.bookname}}</view>
    <view class="content">库存：{{item.inventory}}</view>
    <lin-button l-class="editor-btn" plain size="mini" height="46" shape="semicircle" bindlintap="hanldeClickEditor"
        data-index="{{index}}">编辑</lin-button>
</lin-card>
```
• 构建获取数据的云函数；在 cloundfonction 文件夹下新建 getData 云函数并编辑内容如下：
```javascript
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
    /**
     * 调用此云函数时需传两参数：
     *    skip: 指定查询返回结果时从指定序列后的结果开始返回，常用于分页
     *    limit: 指定查询结果集数量上限(通俗点就是每页请求多少条数据)；在小程序端默认及最大上限为 20，在云函数端默认及最大上限为 1000
     */
    const { skip, limit} = event;
    return cloud.database().collection('excel').skip(skip).limit(limit).get()
}
• 构建获取数据的js，后续可能会有上拉加载更多，下拉重载等功能，所以还是使用模块封装以便后续的扩展的和迭代
• modles下的新建一个list.js的文件
const DB = wx.cloud.database()
export default class List {
    constructor() { }
    /**
     * @description 获取excel表中的数据
     * @param {*} skip 指定查询返回结果时从指定序列后的结果开始返回，常用于分页
     * @param {*} limit 指定查询结果集数量上限(通俗点就是每页请求多少条数据)；在小程序端默认及最大上限为 20，在云函数端默认及最大上限为 1000
     * @returns 返回调用云函数返回的结果
     */
    getData(skip, limit=20) {
        return wx.cloud.callFunction({
            name: 'getData',
            data: { skip, limit }, // 调用云函数时携带的参数 
        })
            .then(result => result)
            .catch(error => error)
    }
 
}
```
• 接着完善pages中list的逻辑----->调用modles中list.js封装的方法
• 引入models中list.js
• 实例化List类
• 引用List类的方法(因为这个是数据展示页面，所以获取数据的方法应该在onload声明周期中调用)
• 将请求回的数据保存到data的list数组中
```javascript
// miniprogram/pages/list/list.js
import List from '../../models/list';
const listModel = new List();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        list: []
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        const { list } = this.data;
        const res = await listModel.getData(list.length)
        console.log('res:', res)
      
    },
})
```
第20行代码打印出来的结果如下图所示：
接着将数据保存到data的list数组中(也就是上面代码的完善)：
```javascript
/**
 * 生命周期函数--监听页面加载
 */
async onLoad(options) {
    const { list } = this.data
    const { result: { data, errMsg } } = await listModel.getData(list.length)
    if (errMsg === 'collection.get:ok') {
        list.push(...data)
        this.setData({ list })
    }
},
```
保存，然后编译，进入list页面，就会是如下图所示的数据啦！
这就完了吗？还得下拉和上拉加载待完善呢！其实也简单，微信为我们提供了方便的api，上拉 onReachBottom、下拉onPullDownRefresh(注意：监听用户下拉刷新事件，需要在app.json的window选项中或页面配置中开启enablePullDownRefresh)
• 将onload中的逻辑单独抽离出来，以便复用
• 页面首次加载、上拉、下拉时都需要调用
• 下拉是重新加载本页面的数据，也就是从第一页开始，所以每次执行上拉的时候都要去将list数组请求，然后再调用数据请求的方法
coding
1. 抽离逻辑
```javascript
async _getData(){
    const { list } = this.data
    const { result: { data, errMsg } } = await listModel.getData(list.length)
    if (errMsg === 'collection.get:ok') {
        list.push(...data)
        this.setData({ list })
    }
}
```
2. 调用及完整代码
```javascript
// miniprogram/pages/list/list.js
import List from '../../models/list';
const listModel = new List();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        list: []
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this._getData();
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        this.setData({list: []})
        this._getData()
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        this._getData();
    },
    async _getData() {
        const { list } = this.data
        const { result: { data, errMsg } } = await listModel.getData(list.length)
        if (errMsg === 'collection.get:ok') {
            list.push(...data)
            this.setData({ list })
        }
    }
})
```
以上便完整的完成了文件上传、解析、保存到数据库、页面展示、数据请求、上拉、下拉等功能！
TODO
🔲 对数据进行编辑
🔲 搜索：在输入框中输入书籍名称模糊查询
🔲 数据加载提示