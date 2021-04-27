<template>
  <div class="mycommentbox">
    <div class="commentbox-title">
      <span class="my-commentbox-title"> 游客 </span>
      <span class="my-commentbox-time">发表于：{{ commentboxitem.time }}</span>
    </div>
    <span class="my-commentbox-describe">{{ commentboxitem.content }} </span>
  </div>
</template>

<script>
export default {
  name: "mycommentbox",
  components: {},
  props: ["commentboxitem"],
  data() {
    return {};
  },
  methods: {},
};
</script>

<style>
.mycommentbox {
  border: 2px solid pink;
  width: 100%;
  height: 100px;
  flex-direction: column;
  padding: 10px 25px;
  margin-bottom: 20px;
}
.my-commentbox-title {
  display: block;
  font-size: 18px;
  font-weight: 600;
}

.my-commentbox-time {
}
.my-commentbox-describe {
  font-size: 13px;
  color: #666;
  display: flex;
  height: 140px;
  overflow: hidden;
}
</style>
