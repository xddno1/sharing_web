<template>
  <div class="mybox">
    <div class="box-title">
      <span class="my-box-title" @click="intopage"> {{ boxitem.title }} </span>
      <span class="my-box-time">{{
        boxitem.time.replace("T", "  ").split(".")[0]
      }}</span>
    </div>
    <span class="my-box-describe">{{ boxitem.content }} </span>
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
  min-width: 500px;
  height: 200px;
  flex-direction: column;
  padding: 10px 25px;
  margin-bottom: 20px;
  background-color: #fff;
}
.my-box-title {
  font-size: 30px;
  font-weight: 600;
  line-height: 60px;
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
  float: right;
  line-height: 60px;
}
.my-box-describe {
  font-size: 13px;
  color: #666;
  display: flex;
  height: 140px;
  overflow: hidden;
}
</style>
