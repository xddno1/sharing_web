<template>
  <div class="myadmin">
    <div class="pages">
      <h1>图片上传</h1>
      <div>
        <span>请输入文章id</span>
        <input type="text" v-model="passageid" />
      </div>

      <input
        id="inputElement"
        name="file"
        ref="file"
        type="file"
        accept="image/png, image/gif, image/jpeg"
      />
      <button @click="uploadimg">上传</button>
    </div>
    <div></div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "myadmin",
  components: {},
  props: [],
  data() {
    return {
      file: null,
      myname: "",
      passageid: "",
    };
  },
  methods: {
    uploadimg() {
      let formData = new FormData();
      console.log(formData);
      formData.append("passageID", this.passageid);
      console.log(formData.get("passageID"));
      formData.append("file", this.$refs.file.files[0]);
      console.log(formData.get("file"));
      axios({
        method: "post",
        url: "http://121.4.187.232:8080/admin/uploadImg",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          token: this.$store.state.loginstate.admintoken,
        },
      }).then((e) => {
        this.$message.success("上传成功！");
      });
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
