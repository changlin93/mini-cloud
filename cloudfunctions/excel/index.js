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
                //3，把解析到的数据存到excelList数据表里
                const promise = DB.collection('excel')
                    .add({
                        data: {
                            bookname: row[0], // 书名
                            bookid: row[1], // 书籍id
                            magid: row[2], // 图片id
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