<template>
  <div class="mybox">
    <div class="box-title">
      <span class="my-title" @click="intopage"> {{ boxitem.title }} </span>
      <span class="my-time">{{ boxitem.time }}</span>
    </div>
    <span class="my-describe">{{ boxitem.content }} </span>
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
        name: "page",
        params: { pageid: this.boxitem.id },
      });
      console.log(this.boxitem.id);
    },
  },
};
</script>

<style>
.mybox {
  border: 2px solid pink;
  width: 100%;
  height: 200px;
  flex-direction: column;
  padding: 10px 25px;
  margin-bottom: 20px;
}
.my-title {
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
.my-title:hover {
  animation-name: titlecolor;
  animation-duration: 0.1s;
  animation-fill-mode: forwards;
}
.my-time {
  float: right;
  line-height: 60px;
}
.my-describe {
  font-size: 13px;
  color: #666;
  display: flex;
  height: 140px;
  overflow: hidden;
}
</style>
