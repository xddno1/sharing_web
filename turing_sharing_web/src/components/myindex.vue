<template>
  <div class="myindex">
    <div class="pages" v-if="maxpage != 0">
      <mybox
        v-for="(item, index) in boxdata"
        :key="index"
        :boxitem="item"
      ></mybox>
      <!-- <a-pagination simple :total="ItemCount" :defaultPageSize="pagesize" /> -->
      <span v-if="havepre" class="changepagebtn" @click="changepagefunc('-')"
        ><a-icon type="left" />上一页</span
      >
      <span class="showpagecount">{{ pageNo }} / 共 {{ maxpage }} 页</span>
      <span v-if="havenext" class="changepagebtn" @click="changepagefunc('+')"
        >下一页<a-icon type="right"
      /></span>
    </div>
    <div class="n-and-c">
      <div class="notice-box">
        <span class="n-and-c-title">公告</span>
        <span class="notice">{{ notice }}</span>
      </div>
      <div class="hall-comment">
        <span class="n-and-c-title">大厅评论</span>
        <mycommentbox
          v-for="(item, index) in hallcommentdata"
          :key="index"
          :commentboxitem="item"
        ></mycommentbox>
        <div><span>我也来说一句：</span></div>
        <input type="text" v-model="mycomment" />
        <button @click="addhallcomment">发表</button>
      </div>
    </div>
  </div>
</template>
<script>
import mybox from "./mybox";
import mycommentbox from "./mycommentbox";
import axios from "axios";
export default {
  name: "myindex",
  components: { mybox, mycommentbox },
  data() {
    return {
      pageNo: 1,
      boxdata: {},
      hallcommentdata: {},
      ItemCount: 0,
      pagesize: 5,
      notice: "",
      mycomment: "",
    };
  },
  methods: {
    getbox() {
      axios
        .get(
          `http://121.4.187.232:8080/passage/queryAllPassage?pageNo=${this.pageNo}&pageSize=${this.pagesize}`
        )
        .then((a) => {
          if (a.data.length != 0) {
            this.ItemCount = a.data.passageItemCount;
            this.boxdata = a.data.passageItem;
            this.$store.state.maxpage = a.data.passageItemCount;
          } else {
            this.$message.error("后面没有啦 T_T");
          }
        });
    },
    getnotice() {
      axios.get(`http://121.4.187.232:8080/notice/queryNotice`).then((a) => {
        this.notice = a.data;
      });
    },
    gethallcomment() {
      axios
        .get(`http://121.4.187.232:8080/hallComment/queryAllHallComment`)
        .then((a) => {
          this.hallcommentdata = a.data;
        });
    },
    addhallcomment() {
      axios
        .post(
          `http://121.4.187.232:8080/hallComment/createHallComment?content=${this.mycomment}`
        )
        .then((a) => {
          this.$message.success("评论成功！！");
          this.mycomment = "";
          gethallcomment();
        });
    },
    changepagefunc(changeway) {
      if (changeway == "+") {
        this.pageNo += 1;
      } else {
        this.pageNo -= 1;
      }
      this.getbox();
    },
  },
  computed: {
    maxpage: function () {
      return Math.ceil(this.ItemCount / this.pagesize);
    },
    havepre: function () {
      return this.pageNo != 1;
    },
    havenext: function () {
      return this.maxpage != this.pageNo;
    },
  },
  created() {
    this.getnotice();
    this.gethallcomment();
    this.getbox();
  },
};
</script>

<style>
.myindex {
  /* flex-direction: row; */
}
.changepagebtn {
  cursor: pointer;
}
.showpagecount {
  text-align: center;
}
.pages {
  float: left;
  width: calc(100% - 350px);
}
.n-and-c {
  float: right;
}
.notice-box {
  width: 300px;
  height: 200px;
  background-color: red;
}
.n-and-c-title {
  font-size: 30px;
  font-weight: 700;
  display: block;
}
.notice-box .notice {
}
.hall-comment {
  width: 300px;
  height: 750px;
  background-color: pink;
}
</style>
