export default class Index {
    constructor() { }

    /**
     * @description 调用此方法上传一个文件
     * @param {*} cloudPath 文件的名称
     * @param {*} filePath 文件路径(如要将文件传入某个文件夹，传入参数时如：'text/1.png')
     * @returns 返回上传文件后的状态（成功/失败）
     */
    upload(cloudPath, filePath) {
        return wx.cloud.uploadFile({
            cloudPath,
            filePath, // 文件路径
        })
            .then(result => result)
            .catch(error => error)
    }
}