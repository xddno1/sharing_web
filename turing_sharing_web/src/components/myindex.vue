<template>
  <div class="myindex">
    <div class="pages" v-if="maxpage != 0">
      <mybox
        v-for="(item, index) in boxdata"
        :key="index"
        :boxitem="item"
      ></mybox>
      <!-- <a-pagination simple :total="ItemCount" :defaultPageSize="pagesize" /> -->
      <div class="changepages">
        <span
          v-if="havepre"
          class="changepagebtn fl"
          @click="changepagefunc('-')"
          ><a-icon type="left" />上一页</span
        >
        <span class="showpagecount">{{ pageNo }} / 共 {{ maxpage }} 页</span>
        <span
          v-if="havenext"
          class="changepagebtn fr"
          @click="changepagefunc('+')"
          >下一页<a-icon type="right"
        /></span>
      </div>
    </div>
    <div class="n-and-c">
      <div class="notice-box">
        <span class="n-and-c-title">公告</span>
        <span class="notice style-7">{{ notice }}</span>
      </div>
      <div class="hall-comment-parent">
        <span class="n-and-c-title">大厅评论</span>
        <div class="hall-comment style-7">
          <mycommentbox
            v-for="(item, index) in hallcommentdata"
            :key="index"
            :commentboxitem="item"
          ></mycommentbox>
        </div>
        <div class="my-hallcomment-parent">
          <a-textarea
            class="my-hallcomment-text"
            v-model="mycomment"
            placeholder="我也来说一句. . ."
            auto-size
          />
          <a-button
            class="my-hallcomment-btn"
            type="primary"
            @click="addhallcomment"
            >发表</a-button
          >
        </div>
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
      if (this.mycomment == "") {
        this.$message.error("请输入内容ToT");
      } else {
        axios
          .post(
            `http://121.4.187.232:8080/hallComment/createHallComment?content=${this.mycomment}`
          )
          .then((a) => {
            this.$message.success("评论成功！！");
            this.mycomment = "";
            this.gethallcomment();
          });
      }
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
  height: 100%;
  width: 100%;
  background-color: #f6f6f6;
  /* flex-direction: column; */
}

.myindex .pages {
  /* float: left; */
  width: calc(100% - 350px);
  display: inline-block;
}
.n-and-c {
  margin: 0 10px 0 30px;
  /* float: right; */
  display: inline-block;
  vertical-align: top;
}
.changepages {
  margin: 10px 0 30px;
  flex-direction: column;
  text-align: center;
}
.changepagebtn {
  display: inline-flex;
  cursor: pointer;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.showpagecount {
  display: inline-block;
  text-align: center;
}

.notice-box {
  width: 300px;
  height: 200px;
  margin-bottom: 20px;
  border: #e9e9e9 2px solid;
  background-color: #fff;
}
.notice {
  height: 149px;
  display: inline-block;
  overflow-y: scroll;
  padding: 0 10px;
}
.n-and-c-title {
  padding: 0 10px;
  font-size: 20px;
  line-height: 45px;
  font-weight: 700;
  display: block;
  background-color: #fbfbfb;
  border-bottom: #e9e9e9 2px solid;
}
.hall-comment-parent {
  border: #e9e9e9 2px solid;
  background-color: #fff;
}
.hall-comment {
  width: 300px;
  max-height: 750px;
  overflow-y: scroll;
}
.my-hallcomment-parent {
  border-top: #e9e9e9 2px solid;
  padding-top: 5px;
  display: flex;
}
.my-hallcomment-text {
  margin-right: 5px;
}

.style-7::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px #f5f5f5;
  background-color: #f5f5f5;
  border-radius: 2px;
}

.style-7::-webkit-scrollbar {
  width: 2px;
  background-color: #f5f5f5;
}

.style-7::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
