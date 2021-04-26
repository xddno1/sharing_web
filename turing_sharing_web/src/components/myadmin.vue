<template>
  <div class="myadmin">
    <div class="pages">
      <div>姓名：<input type="text" v-model="myname" /></div>
      <div>头像：<input type="file" ref="file" /></div>
      <button @click="save">a</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "myadmin",
  components: {},
  props: [],
  data() {
    return {
      myname,
    };
  },
  methods: {
    save() {
      let formData = new FormData();
      console.log(formData);
      formData.append("name", this.name);
      formData.append("img", this.$refs.file.files[0]);
      this.axios
        .post("/api/user/query", formData, {
          "Content-Type": "multipart/form-data",
        })
        .then((res) => {});
    },
  },
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
