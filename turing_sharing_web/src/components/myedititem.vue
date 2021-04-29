<template>
  <div class="mypage contianer" v-if="title">
    <div>
      <span class="my-edit-item-title">标题</span>
      <input v-model="title" />
    </div>

    <div>
      <span class="my-edit-item-content">内容</span> <input v-model="content" />
    </div>

    <div class="clearfix">
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

    <div>
      <span
        v-for="(item, index) in resources"
        :key="index"
        class="my-edit-item-resource"
        @click="downloadresource(index)"
        >资源{{ index + 1 }}</span
      >
    </div>
    <div>
      <!-- <a-tag v-for="item in comments" closable @close="" :key="item">
        {{ item }}
      </a-tag>
      <a-tag closable @close=""> Tag 2 </a-tag> -->
    </div>

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
        console.log(this);
        axios({
          method: "post",
          url: `http://121.4.187.232:8080/comment/createComment?content=${this.addcomment}&passageID=${this.pageid}&userID=${this.$store.state.loginstate.userid}`,
          headers: {
            token: this.$store.state.loginstate.usertoken,
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
              console.log(e);
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
      console.log(this.filelist);
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
  },
  created() {
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
            console.log(res);
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
  },
};
</script>

<style>
.mypage {
  background-color: pink;
}
.my-edit-item-title {
  font-size: 30px;
  font-weight: 600;
  line-height: 60px;
}
.my-edit-item-time {
  float: right;
  line-height: 60px;
}
.my-edit-item-showimg-eara {
  margin-top: 20px;
  width: 20%;
  position: relative;
}
.my-edit-item-showimg {
  width: 100%;
}
.my-edit-item-showimg-btn {
  position: absolute;
  left: calc(100% - 7px);
  top: -7px;
  cursor: pointer;
  color: red;
}
.my-edit-item-resource {
  cursor: pointer;
}

.my-edit-item-my-comment {
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
</style>
