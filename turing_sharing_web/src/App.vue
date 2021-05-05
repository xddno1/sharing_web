<template>
  <div>
    <my-head></my-head>
    <div class="contianer body">
      <router-view></router-view>
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
  background-color: #f6f6f6;
}
.body {
  padding-bottom: 50px;
  padding-top: 100px;
}
.btn {
  cursor: pointer;
}
.deletebtn {
  color: red;
}
.editbtn {
  color: dodgerblue;
}
.btn :hover {
  animation-name: btnhover;
  animation-duration: 0.1s;
  animation-fill-mode: forwards;
}
.btn :active {
  animation-name: btnactive;
  animation-duration: 0.1s;
}
@keyframes btnhover {
  to {
    width: 120%;
    height: 120%;
  }
}
@keyframes btnactive {
  to {
    width: 90%;
    height: 90%;
  }
}
</style>
