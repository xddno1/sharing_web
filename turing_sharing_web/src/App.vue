<template>
  <div>
    <my-haed></my-haed>
    <div class="contianer">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import MyHead from "./components/myhead";
export default {
  name: "App",
  components: {
    MyHead,
  },
};
</script>

<style>
.contianer {
  padding: 50px 10%;
}
</style>
