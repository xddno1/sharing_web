<template>
  <div class="myhead">
    <span>这是头部</span>
    <input type="text" />
  </div>
</template>

<script>
export default {
  name: "myhead",
  components: {},
  data() {
    return {};
  },
  created() {
    this.$router.push({
      name: "index",
    });
  },
};
</script>

<style>
</style>
