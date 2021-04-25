<template>
  <div class="myindex">
    <mybox
      v-for="(item, index) in boxdata"
      :key="index"
      :boxitem="item"
    ></mybox>
    <span v-if="pageNo != 1" class="changepagebtn" @click="changepagefunc('-')"
      ><a-icon type="left" />上一页</span
    >
    <span
      class="changepagebtn"
      style="float: right"
      @click="changepagefunc('+')"
      >下一页<a-icon type="right"
    /></span>
  </div>
</template>

<script>
import mybox from "./mybox";
import axios from "axios";
export default {
  name: "myindex",
  components: { mybox },
  data() {
    return { pageNo: 1, boxdata: {} };
  },
  methods: {
    getbox() {
      axios
        .get(
          `http://121.4.187.232:8080/passage/queryAllPassage?pageNo=${this.pageNo}&pageSize=5`
        )
        .then((a) => {
          if (a.data.length != 0) {
            this.boxdata = a.data;
          } else {
            this.$message.error("后面没有啦 T_T");
          }
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
  created() {
    // getbox函数，因为在created的时候函数还没有加载，不能直接调用函数
    ///////////////////////////////////////////////////////////////////////////////////
    axios
      .get(
        `http://121.4.187.232:8080/passage/queryAllPassage?pageNo=${this.pageNo}&pageSize=5`
      )
      .then((a) => {
        console.log(a);
        this.boxdata = a.data;
      });
    ///////////////////////////////////////////////////////////////////////////////////
  },
};
</script>

<style>
.changepagebtn {
  cursor: pointer;
}
</style>
