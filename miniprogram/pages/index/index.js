// miniprogram/pages/index/index.js
import Index from '../../models/index';
const indexModel = new Index();
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

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

    handleClickParse(){
        wx.cloud.callFunction({
            name: 'excel',
            data: {
                fileID: 'cloud://mini-lin-nnbmo.6d69-mini-lin-nnbmo-1303039879/test/goods.xlsx'
            },
            success(res){
                console.log('res:', res)
            },
            fail(error){
                console.log('error:', error)
            }
        })
    },
})