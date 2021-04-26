<template>
  <div class="myadmin">
    <div class="pages">
      <button>a</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "myadmin",
  components: {},
  props: [],
  data() {
    return {};
  },
  methods: {},
  created() {
    console.log(this.$store.state.loginstate.admintoken);
    if (!this.$store.state.loginstate.admintoken) {
      this.$message.error("请使用管理员登录！");
      this.$router.replace({
        name: "index",
      });
    }
  },
};
</script>

<style>
</style>
