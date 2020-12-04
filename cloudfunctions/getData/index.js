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