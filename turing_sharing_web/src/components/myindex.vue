<template>
  <div class="myindex">
    <mybox
      v-for="(item, index) in boxdata"
      :key="index"
      :boxitem="item"
    ></mybox>
    <!-- <a-pagination simple :total="ItemCount" :defaultPageSize="pagesize" /> -->
    <span v-if="havepre" class="changepagebtn" @click="changepagefunc('-')"
      ><a-icon type="left" />上一页</span
    >
    <span class="showpagecount">{{ pageNo }} / {{ maxpage }}</span>
    <span v-if="havenext" class="changepagebtn" @click="changepagefunc('+')"
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
    return { pageNo: 1, boxdata: {}, ItemCount: 0, pagesize: 5 };
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
    this.getbox();
  },
};
</script>

<style>
.changepagebtn {
  cursor: pointer;
}
.showpagecount {
  text-align: center;
}
</style>
