<template>
  <div class="myhead">
    <div class="contianer">
      <div class="welcome">
        <span>欢迎光临</span>
        <span>我们一直在努力</span>
      </div>
      <span class="login">请登录</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyHead",
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
.myhead {
  background-color: pink;
  position: fixed;
  height: 50px;
  width: 100%;
}
.contianer {
  padding: 0 10%;
}
.myhead .welcome {
  width: 100%;
  display: inline;
  font-size: 30px;
  font-weight: 800;
  line-height: 50px;
}
.login {
  color: #777;
  float: right;
  display: block;
  line-height: 50px;
  cursor: pointer;
}
</style>
