<template>
  <div class="mybox">
    <div class="box-title">
      <span class="my-title"> {{ boxitem.title }} </span>
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
