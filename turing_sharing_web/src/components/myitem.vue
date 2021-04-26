<template>
  <div class="mypage contianer">
    <div>
      <span class="my-item-title">{{ title }}</span
      ><span class="my-item-time">{{ time }}</span>
    </div>

    <div>{{ content }}</div>
    <div v-for="(item, index) in pictures" :key="index">
      <img class="my-item-showimg" :src="'data:image/png;base64,' + item" />
    </div>
    <div>
      <span
        v-for="(item, index) in resources"
        :key="index"
        class="my-item-resource"
        @click="downloadresource(index)"
        >资源{{ index + 1 }}</span
      >
    </div>
    <div>
      <div>我也要评论:</div>
      <a-input v-model="mycomment"></a-input>
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
  name: "mypage",
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
      token: this.$store.state.token,
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
    commentsubmit() {},
  },
  created() {
    console.log(this.$store);
    console.log(this.token);
    this.pageid = this.$route.query.item;
    axios
      .get(
        ` http://121.4.187.232:8080/passage/passageResources?passageID=${this.pageid}`
      )
      .then((a) => {
        console.log(a.data);
        // a[0].content       内容
        // a[0].time          时间
        // a[0].title         标题
        // a[1]               支援
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
.my-item-title {
  font-size: 30px;
  font-weight: 600;
  line-height: 60px;
}
.my-item-time {
  float: right;
  line-height: 60px;
}
.my-item-showimg {
  width: 100%;
}
.my-item-resource {
  cursor: pointer;
}
</style>
