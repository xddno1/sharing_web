<template>
  <div class="mybox">
    <div class="box-title">
      <span class="my-box-title hide-title-Text" @click="intopage">
        {{ boxitem.title }}
      </span>
      <span class="my-box-time">{{
        boxitem.time.replace("T", "  ").split(".")[0]
      }}</span>
    </div>
    <div class="my-box-describe hide-dsc-Text">{{ boxitem.content }}</div>
  </div>
</template>

<script>
export default {
  name: "mybox",
  components: {},
  props: ["boxitem"],
  data() {
    return {};
  },
  methods: {
    intopage() {
      this.$router.push({
        name: "item",
        query: {
          item: this.boxitem.id,
        },
      });
    },
  },
};
</script>

<style>
.mybox {
  border: #e9e9e9 2px solid;
  width: 100%;
  height: 200px;
  flex-direction: column;
  padding: 10px 25px;
  margin-bottom: 20px;
  background-color: #fff;
}
.my-box-title {
  font-size: 26px;
  font-weight: 600;
  line-height: 55px;
  margin-right: 10px;
  cursor: pointer;
}
@keyframes titlecolor {
  to {
    color: #45b6f7;
  }
}
.my-box-title:hover {
  animation-name: titlecolor;
  animation-duration: 0.1s;
  animation-fill-mode: forwards;
}
.my-box-time {
  line-height: 40px;
}
.my-box-describe {
  font-size: 13px;
  color: #666;
  height: 80px;
}
.hide-title-Text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* 限制在一个块元素显示的文本的行数 */
  -webkit-box-orient: vertical; /* 垂直排列 */
  word-break: break-all; /* 内容自动换行 */
}
.hide-dsc-Text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4; /* 限制在一个块元素显示的文本的行数 */
  -webkit-box-orient: vertical; /* 垂直排列 */
  word-break: break-all; /* 内容自动换行 */
}
</style>
