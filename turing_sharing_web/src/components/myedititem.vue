<template>
  <div class="mypage contianer">
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
      >
        <span class="my-edit-item-resource-title">资源{{ index + 1 }}:</span>
        <a-tag
          >{{ getresourcename(item) }}

          <a-popconfirm
            title="主人您狠心要删除我嘛？ToT"
            ok-text="Yes"
            cancel-text="No"
            @confirm="adddeletesourceid(index)"
          >
            <a-icon
              type="delete"
              class="btn deletebtn"
            /> </a-popconfirm></a-tag
      ></span>
      <input
        ref="addsourcebtn"
        type="file"
        style="display: none"
        @change="addsource"
      />
      <span class="my-edit-item-resource-title">添加资源：</span>
      <a-tag class="my-edit-item-resource-add-btn" @click="addsourceclick"
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
        @delcomment="delcomment"
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
      delimgid: [],
      deletesourceid: [],
      submitresource: [],
      isimg: true,
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
          this.getcomment();
        });
      }
    },
    delcomment(e) {
      axios({
        method: "post",
        url: `http://121.4.187.232:8080/admin/deleteComment?commentID=${e}`,
        headers: {
          token: this.$store.state.loginstate.admintoken,
        },
      }).then((e) => {
        this.getcomment();
        this.$message.success("删除成功！");
      });
    },
    getcomment() {
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
      if (this.isimg) {
        for (let i in this.filelist) {
          //console.log(this.filelist[i]);
          if (fileList[i] != this.filelist[i]) {
            if (this.filelist[i].url) {
              this.delimgid.push(this.filelist[i].uid);
            }
            break;
          }
        }

        this.filelist = fileList;
        this.submitimg = [];

        // 老图片为undefined 新图片为 file对象
        for (let i in fileList) {
          this.submitimg.push(fileList[i].originFileObj);
          // delete this.filelist[i].originFileObj.uid;
        }
      }
      this.isimg = true;
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
    cutupload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("You can only upload JPG file!");
        this.isimg = false;
      }
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
          this.uploadresource();
          this.deletesource();
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
        this.pageid = e.data.split(":")[1];
        this.uploadimg();
        this.uploadresource();
        this.$router.replace({
          name: "admin",
        });
      });
    },
    uploadimg() {
      let formData = new FormData();
      formData.append("passageID", this.pageid);
      for (let i in this.submitimg) {
        if (this.submitimg[i]) {
          formData.append("file", this.submitimg[i]);
        }
      }
      axios({
        method: "post",
        url: "http://121.4.187.232:8080/admin/uploadImg",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          token: this.$store.state.loginstate.admintoken,
        },
      }).then((e) => {
        for (let i in this.delimgid) {
          this.delimg(this.delimgid[i]);
        }
        this.$message.success("上传图片成功！");
        this.$router.replace({
          name: "admin",
        });
      });
    },
    delimg(i) {
      axios({
        method: "post",
        url: `http://121.4.187.232:8080/admin/deleteImg?imgID=${i}`,
        headers: {
          token: this.$store.state.loginstate.admintoken,
        },
      }).then((e) => {});
    },
    adddeletesourceid(e) {
      if (this.resources[e].id) {
        this.deletesourceid.push(this.resources[e].id);
      }
      this.resources.splice(e, 1);
      console.log(this.resources);
    },
    deletesource() {
      for (let i of this.deletesourceid) {
        axios({
          method: "post",
          url: `http://121.4.187.232:8080/admin/deleteResources?resourcesID=${i}`,
          headers: {
            token: this.$store.state.loginstate.admintoken,
          },
        }).then((e) => {
          console.log("ok");
        });
      }
    },
    addsourceclick() {
      this.$refs.addsourcebtn.click();
    },
    addsource(e) {
      let addfile = this.$refs.addsourcebtn.files[0];
      this.submitresource.push(addfile);
      this.resources.push(addfile);
    },
    uploadresource() {
      let formData = new FormData();
      formData.append("passageID", this.pageid);
      console.log(this.submitresource);
      for (let i of this.submitresource) {
        console.log(i);
        formData.append("file", i);
      }
      console.log(formData.getAll("file"));
      axios({
        method: "post",
        url: "http://121.4.187.232:8080/admin/uploadResources",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          token: this.$store.state.loginstate.admintoken,
        },
      }).then((e) => {
        this.$message.success("上传文件成功！");
      });
    },
  },
  computed: {
    getresourcename() {
      return (item) => {
        if (item.address) {
          return item.address.split("/")[4];
        } else {
          return item.name;
        }
      };
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
          this.oldimg = a.data[2];
          for (let i in a.data[2]) {
            this.base64ToBlob({
              b64data: a.data[2][i],
              contentType: "image/png",
            }).then((res) => {
              // 转换后的blob对象
              this.filelist.push({
                uid: i,
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
