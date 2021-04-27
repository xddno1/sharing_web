<template>
  <div class="mypage contianer">
    <div>
      <span class="my-edit-item-title">标题</span>
      <input v-model="title" />
    </div>

    <div>
      <span class="my-edit-item-content">内容</span> <input v-model="content" />
    </div>
    <div v-for="(item, index) in pictures" :key="index">
      <img
        class="my-edit-item-showimg"
        :src="'data:image/png;base64,' + item"
      />
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
      <div>我也要评论:</div>
      <a-input v-model="addcomment"></a-input>
      <a-button
        style="margin-right: 10px; float: right"
        type="primary"
        @click="commentsubmit"
      >
        评论
      </a-button>
    </div>
    <div v-for="(item, index) in comments" :key="index">
      <span>{{ item.content }}</span>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "myedititem",
  components: {},
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
  },
  created() {
    console.log(this.$store.state.loginstate.usertoken);
    console.log(this.$store.state.loginstate.userid);
    this.pageid = this.$route.query.item;
    axios
      .get(
        ` http://121.4.187.232:8080/passage/passageResources?passageID=${this.pageid}`
      )
      .then((a) => {
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
        this.comments = a.data[2];
        this.pictures = a.data[3];
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
.my-edit-item-showimg {
  width: 100%;
}
.my-edit-item-resource {
  cursor: pointer;
}
</style>
