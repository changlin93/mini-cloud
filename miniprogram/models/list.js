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
            data: { skip, limit }
        })
            .then(result => result)
            .catch(error => error)
    }
}