<template>
  <div class="myindex">
    <mybox v-for="i in 10" :key="i"></mybox>
  </div>
</template>

<script>
import mybox from "./mybox";

export default {
  name: "myindex",
  components: { mybox },
  data() {
    return {};
  },
};
</script>

<style>
</style>
