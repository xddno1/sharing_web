<template>
  <div class="mycommentbox">
    <div class="commentbox-title">
      <span v-if="!!!commentboxitem.username" class="my-commentbox-title">
        游客</span
      >
      <span v-else class="my-commentbox-title">{{
        commentboxitem.username
      }}</span>
      <span class="my-commentbox-time">
        {{ commentboxitem.time.replace("T", "  ").split(".")[0] }}</span
      >
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
  width: 100%;
  flex-direction: column;
  padding: 10px 15px;
  margin-bottom: 8px;
}
.my-commentbox-title {
  margin-right: 5px;
  font-size: 13px;
  color: #666;
}
.my-commentbox-time {
  font-size: 13px;
  color: #666;
}

.my-commentbox-describe {
  padding: 5px 12px;
  font-size: 15px;
  font-weight: 400;
  display: flex;
  overflow: hidden;
}
</style>
