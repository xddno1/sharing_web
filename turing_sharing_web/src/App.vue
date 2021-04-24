<template>
  <div>
    <my-head></my-head>
    <div class="contianer body">
      <!-- <router-view></router-view> -->
    </div>
  </div>
</template>

<script>
import MyHead from "./components/myhead";
export default {
  name: "App",
  components: { MyHead },
};
</script>

<style>
.contianer {
  padding: 0 10%;
}
.body {
  padding-bottom: 50px;
  padding-top: 120px;
}
</style>
