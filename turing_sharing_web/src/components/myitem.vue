<template>
  <div class="mypage contianer" v-if="title">
    <div class="my-item-title-parent">
      <span class="my-item-title">{{ title }}</span
      ><span class="my-item-time">{{
        time.replace("T", "  ").split(".")[0]
      }}</span>
    </div>

    <div class="my-item-content">{{ content }}</div>
    <div v-for="item in pictures" :key="item" class="my-item-showimg-parent">
      <img class="my-item-showimg" :src="'data:image/png;base64,' + item" />
      <span class="my-item-showimg-describe">图片</span>
    </div>
    <div class="my-item-resource-parent">
      <span
        v-for="(item, index) in resources"
        :key="index"
        class="my-item-resource"
        @click="downloadresource(index)"
      >
        <span class="my-item-resource-title">资源{{ index + 1 }}:</span>
        {{ item.address.split("/")[4] }}</span
      >
    </div>
    <span v-if="overcommentlen" class="length-warn">长度超过25个字啦</span>
    <div class="my-item-my-comment">
      <a-textarea
        class="my-item-my-comment-text"
        :class="{ 'textarea-warn': overcommentlen }"
        v-model="addcomment"
        placeholder="我也来说一句. . ."
        auto-size
      ></a-textarea>
      <a-button
        class="my-item-my-comment-btn"
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
</template>

<script>
import axios from "axios";
import mycommentbox from "./mycommentbox";

export default {
  name: "mypage",
  components: { mycommentbox },
  data() {
    return {
      pageid: "",
      title: "",
      content: "",
      time: "",
      resources: [],
      comments: [],
      pictures: [],
      mycomment: "",
      addcomment: "",
    };
  },
  methods: {
    downloadresource(index) {
      axios({
        method: "post",
        url: `http://121.4.187.232:8080/passage/downResources?filePath=${this.resources[index].address}`,
        responseType: "blob",
      }).then((res) => {
        console.log(res);
        res = res.data;
        let blob = new Blob([res], { type: res.type });
        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = this.resources[index].address;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(href);
      });
    },
    commentsubmit() {
      if (
        !this.$store.state.loginstate.userid &&
        !this.$store.state.loginstate.admintoken
      ) {
        this.$message.error("请先登录");
      } else {
        if (this.overcommentlen) {
          this.$message.error("请检查评论长度");
        } else {
          if (this.$store.state.loginstate.userid) {
            axios({
              method: "post",
              url: `http://121.4.187.232:8080/comment/createComment?content=${this.addcomment}&passageID=${this.pageid}&userID=${this.$store.state.loginstate.userid}`,
              headers: {
                token: this.$store.state.loginstate.usertoken,
              },
            }).then((e) => {
              this.addcomment = "";
              this.getcomment();
              this.$message.success("评论成功！");
            });
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
        }
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
          console.log(e.data);
          this.comments = e.data;
        })
        .catch((e) => {
          this.$message.error("获取评论失败！");
        });
    },
  },
  computed: {
    overcommentlen() {
      return this.addcomment.length > 25;
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
        console.log(a);
        hideloading();
        // a[0].content       内容
        // a[0].time          时间
        // a[0].title         标题
        // a[1]               资源
        // a[3]               评论
        // a[2]               图片
        this.content = a.data[0].content;
        this.time = a.data[0].time;
        this.title = a.data[0].title;
        this.resources = a.data[1];
        this.getcomment();
        this.pictures = a.data[2];
        console.log(this.pictures);
      })
      .catch((a) => {
        hideloading();
        this.$message.error("好像网络不怎么好呢..", 6000);
      });
  },
};
</script>

<style>
.mypage {
  background-color: #fff;
  border: #e9e9e9 2px solid;
}

.my-item-title-parent {
  margin-bottom: 30px;
}
.my-item-title-parent .my-item-title {
  font-size: 30px;
  font-weight: 600;
  line-height: 60px;
  margin-right: 20px;
}
.my-item-title-parent .my-item-time {
  line-height: 60px;
}

.my-item-content {
  margin-bottom: 30px;
}

.my-item-showimg-parent {
  text-align: center;
}
.my-item-showimg-parent .my-item-showimg {
  width: 60%;
  margin-bottom: 10px;
}
.my-item-showimg-parent .my-item-showimg-describe {
  display: block;
  margin-bottom: 30px;
  font-size: 10px;
  color: #666;
}

.my-item-my-comment {
  display: flex;
  margin-bottom: 20px;
}
.my-item-my-comment .my-item-my-comment-text {
  margin-right: 10px;
}
.my-item-resource-parent {
  margin-bottom: 20px;
}
.my-item-resource {
  cursor: pointer;
  display: block;
  color: #4181c4;
  margin-bottom: 10px;
}
.my-item-resource:hover {
  color: #ff5e52;
}

.my-item-resource-title {
  font-weight: 600;
  color: #444;
}
</style>
