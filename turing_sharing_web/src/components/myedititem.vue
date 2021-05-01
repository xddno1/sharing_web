<template>
  <div class="mypage contianer" v-if="title">
    <div class="my-edit-item-title-parent">
      <span class="my-edit-item-title">标题</span>
      <a-textarea class="my-edit-item-input" v-model="title" auto-size />
    </div>

    <div class="my-edit-item-content-parent">
      <span class="my-edit-item-title">内容</span>
      <a-textarea v-model="content" class="my-edit-item-input" auto-size />
    </div>

    <div class="clearfix my-edit-item-picture">
      <span class="my-edit-item-title">图片</span>
      <a-upload
        list-type="picture-card"
        :beforeUpload="cutupload"
        :file-list="filelist"
        @preview="handlePreview"
        @change="handleChange"
      >
        <div v-if="filelist.length < 8">
          <a-icon type="plus" />
          <div class="ant-upload-text">添加图片</div>
        </div>
      </a-upload>
      <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
    </div>

    <div class="my-edit-item-resource-parent">
      <span class="my-edit-item-title">资源</span>
      <span
        v-for="(item, index) in resources"
        :key="index"
        class="my-edit-item-resource"
        @click="downloadresource(index)"
      >
        <span class="my-edit-item-resource-title">资源{{ index + 1 }}:</span>
        <a-tag
          >{{ item.address.split("/")[4] }}
          <a-icon type="delete" class="btn deletebtn" /></a-tag
      ></span>
      <span class="my-edit-item-resource-title">添加资源：</span>
      <a-tag class="my-edit-item-resource-add-btn"
        >添加 <a-icon type="plus" class="addbtn"
      /></a-tag>
    </div>
    <div>
      <!-- <a-tag v-for="item in comments" closable @close="" :key="item">
        {{ item }}
      </a-tag>
      <a-tag closable @close=""> Tag 2 </a-tag> -->
    </div>
    <div v-if="time">
      <span class="my-edit-item-title">评论</span>
      <div class="my-edit-item-my-comment">
        <a-textarea
          class="my-edit-item-my-comment-text"
          v-model="addcomment"
          placeholder="我也来说一句. . ."
          auto-size
        ></a-textarea>
        <a-button
          class="my-edit-item-my-comment-btn"
          type="primary"
          @click="commentsubmit"
        >
          评论
        </a-button>
      </div>
      <mycommentbox
        v-for="(item, index) in comments"
        :key="index"
        :commentboxitem="item"
      ></mycommentbox>
    </div>
    <div class="my-edit-item-btn-parent">
      <a-button
        v-if="time"
        class="my-edit-item-btn"
        type="primary"
        @click="uploaditem"
        >修改</a-button
      >

      <a-button v-else class="my-edit-item-btn" type="primary" @click="newitem"
        >新建</a-button
      >
    </div>
  </div>
</template>

<script>
import axios from "axios";
import mycommentbox from "./mycommentbox";
export default {
  name: "myedititem",
  components: { mycommentbox },
  data() {
    return {
      pageid: "",
      title: "",
      content: "",
      time: "",
      resources: [],
      comments: [],
      filelist: [],
      submitimg: [],
      mycomment: "",
      addcomment: "",
      previewVisible: false,
      previewImage: "",
    };
  },
  methods: {
    commentsubmit() {
      if (
        !this.$store.state.loginstate.userid &&
        !this.$store.state.loginstate.admintoken
      ) {
        this.$message.error("请先登录");
      } else {
        axios({
          method: "post",
          url: `http://121.4.187.232:8080/admin/createComment?content=${this.addcomment}&passageID=${this.pageid}`,
          headers: {
            token: this.$store.state.loginstate.admintoken,
          },
        }).then((e) => {
          this.$message.success("评论成功！");
          this.addcomment = "";
          axios
            .get(
              ` http://121.4.187.232:8080/passage/queryCommentByPassageID?passageID=${this.pageid}`
            )
            .then((e) => {
              this.$message.success("获取评论成功");
              this.comments = e.data;
            })
            .catch((e) => {
              this.$message.error("获取评论失败！");
            });
        });
      }
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange({ fileList }) {
      this.filelist = fileList;
      this.submitimg = [];
      console.log(fileList[0].originFileObj);
      for (let i in fileList) {
        // delete this.filelist[i].originFileObj.uid;
        this.submitimg.push(fileList[i].originFileObj);
      }
    },
    base64ToBlob({ b64data = "", contentType = "", sliceSize = 512 } = {}) {
      return new Promise((resolve, reject) => {
        // 使用 atob() 方法将数据解码
        let byteCharacters = atob(b64data);
        let byteArrays = [];
        for (
          let offset = 0;
          offset < byteCharacters.length;
          offset += sliceSize
        ) {
          let slice = byteCharacters.slice(offset, offset + sliceSize);
          let byteNumbers = [];
          for (let i = 0; i < slice.length; i++) {
            byteNumbers.push(slice.charCodeAt(i));
          }
          // 8 位无符号整数值的类型化数组。内容将初始化为 0。
          // 如果无法分配请求数目的字节，则将引发异常。
          byteArrays.push(new Uint8Array(byteNumbers));
        }
        let result = new Blob(byteArrays, {
          type: contentType,
        });
        result = Object.assign(result, {
          // 这里一定要处理一下 URL.createObjectURL
          preview: URL.createObjectURL(result),
          name: `XXX.png`,
        });
        resolve(result);
      });
    },
    cutupload() {
      return false;
    },
    newitem() {
      if (!this.title || !this.content) {
        this.$message.error("请输入文章标题或者内容！");
      } else {
        this.creatitem();
      }
    },
    uploaditem() {
      if (!this.title || !this.content) {
        this.$message.error("请输入文章标题或者内容！");
      } else {
        axios({
          method: "post",
          url: `http://121.4.187.232:8080/admin/updatePassage?content=${this.content}&passageID=${this.pageid}&title=${this.title}`,
          headers: {
            token: this.$store.state.loginstate.admintoken,
          },
        }).then((e) => {
          this.$message.success("修改成功！");
          this.uploadimg();
        });
      }
    },
    creatitem() {
      axios({
        method: "post",
        url: `http://121.4.187.232:8080/admin/createPassage?content=${this.content}&title=${this.title}`,
        headers: {
          token: this.$store.state.loginstate.admintoken,
        },
      }).then((e) => {
        this.$message.success("创建成功！");
        this.uploadimg();
        this.$router.replace({
          name: "admin",
        });
      });
    },
    uploadimg() {
      let formData = new FormData();
      formData.append("passageID", this.pageid);
      formData.append("file", this.submitimg[0]);
      console.log(formData.get("file"));
      axios({
        method: "post",
        url: "http://121.4.187.232:8080/admin/uploadImg",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          token: this.$store.state.loginstate.admintoken,
        },
      }).then((e) => {
        this.$message.success("上传成功！");
        this.$router.replace({
          name: "admin",
        });
      });
    },
  },
  created() {
    if (!this.$store.state.loginstate.admintoken) {
      this.$message.error("请使用管理员登录！");
      this.$router.replace({
        name: "index",
      });
    }
    if (this.$route.query.item != "newitem") {
      this.pageid = this.$route.query.item;
      let hideloading = this.$message.loading("资源加载中，请稍后..", 0);
      axios
        .get(
          ` http://121.4.187.232:8080/passage/passageResources?passageID=${this.pageid}`
        )
        .then((a) => {
          hideloading();
          // a[0].content       内容
          // a[0].time          时间$store
          // a[0].title         标题
          // a[1]               资源
          // a[2]               评论
          // a[3]               图片
          this.content = a.data[0].content;
          this.time = a.data[0].time;
          this.title = a.data[0].title;
          this.resources = a.data[1];
          this.comments = a.data[3];
          for (let i in a.data[2]) {
            this.base64ToBlob({
              b64data: a.data[2][i],
              contentType: "image/png",
            }).then((res) => {
              // 转换后的blob对象
              this.filelist.push({
                uid: "-" + i,
                name: "a picture",
                status: "done",
                url: res.preview,
              });
            });
          }
        })
        .catch(() => {
          hideloading();
          this.$message.error("好像网络不怎么好呢..", 6000);
        });
    } else {
      this.title = "新建文章";
    }
  },
};
</script>

<style>
.mypage {
  background-color: #fff;
}

.my-edit-item-title {
  display: block;
  font-size: 30px;
  font-weight: 600;
  line-height: 60px;
}

.my-edit-item-title-parent {
  margin-bottom: 70px;
}

.my-edit-item-title-parent .my-edit-item-input {
  display: block;
}

.my-edit-item-content-parent {
  margin-bottom: 70px;
}

.my-edit-item-content-parent .my-edit-item-input {
  display: block;
}

.my-edit-item-picture {
  margin-bottom: 70px;
}

.my-edit-item-resource-parent {
  margin-bottom: 70px;
}
.my-edit-item-resource {
  cursor: pointer;
  display: block;
  color: #4181c4;
  margin-bottom: 5px;
}
.my-edit-item-resource:hover {
  color: #ff5e52;
}

.my-edit-item-resource-title {
  font-weight: 600;
  color: #444;
}
.my-edit-item-resource-add-btn {
  cursor: pointer;
}

.my-edit-item-my-comment {
  margin-bottom: 20px;
  display: flex;
}
.my-edit-item-my-comment .my-edit-item-my-comment-text {
  margin-right: 10px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.my-edit-item-btn-parent {
  text-align: center;
  margin-bottom: 60px;
}
.my-edit-item-btn-parent .my-edit-item-btn {
  margin-top: 10px;
  margin-bottom: 30px;
}
</style>
