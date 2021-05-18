<template>
  <div>
    <!-- action 后台提供的上传图片的接口地址
    beforeAvatarUpload 上传之前校检图片的格式大小
    on-success 获取上传成功之后后台返回的上传地址 -->
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :http-request="upload"
    >
      <!-- 上传成功之后拿到地址回显头像或者默认头像 -->
      <img v-if="photo" :src="photo" class="avatar">
      <!-- 默认没有头像显示+号 -->
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <!-- 显示上传进度 -->
      <el-progress
        v-show="showProcess"
        type="line"
        :percentage="percentage"
        status="success"
        :stroke-width="6"
      >
      </el-progress>
    </el-upload>
  </div>
</template>

<script>
// 导入cos的SDK调用
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDAvSpwSQpgGajrlsm9IBMIrCKEJ8jED7x', // 身份识别ID
  SecretKey: 'ylKeOs285qLsa2D9AE3cw1qTpxFI5e0q' // 身份秘钥
})
export default {
  name: 'UploadPhoto',
  props: {
    photo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 云服务器返回的地址
      imageUrl: '',
      // 是否显示进度条
      showProcess: false,
      // 进度条的值
      percentage: 0
    }
  },
  methods: {
    upload(params) {
      // 显示上传进度条
      this.showProcess = true
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          Bucket: 'xiao-wang-1305861549', /* 存储桶名字 hrsass-1255477649 */
          Region: 'ap-beijing', /* 存储桶所在地域，必须字段 ap-beijing */
          Key: params.file.name, /* 文件名 */
          StorageClass: 'STANDARD', // 上传模式, 标准模式
          Body: params.file, // 上传文件对象
          onProgress: (progressData) => {
            // 上传之后，完成之前会一直执行=》上传进度条借助这里实现
            console.log(JSON.stringify(progressData))
            this.percentage = progressData.percent * 100
          }
        }, (err, data) => {
          console.log(err || data)
          // errr值表示没有上传成功
          if (!err) {
            // 延迟显示进度条效果
            setTimeout(() => {
            //  回显上传成功的图片
            // this.photo = `https://${data.Location}`
              this.$emit('update:photo', `https://${data.Location}`)
              // 关闭进度条显示
              this.showProcess = false
            }, 800)
          }
        })
      }
    },
    // H个函数是配合 active 使用的
    // handleAvatarSuccess(res, file) {
    //   this.imageUrl = URL.createObjectURL(file.raw)
    // },
    // 选择完图片之后图片格式和大小的检验
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }

  }
}

</script>

<style lang="scss">
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
