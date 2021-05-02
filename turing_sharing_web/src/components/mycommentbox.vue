<template>
  <div class="mycommentbox">
    <div class="commentbox-title">
      <span v-if="!commentboxitem.username" class="my-commentbox-title">
        游客</span
      >
      <span v-else class="my-commentbox-title">{{
        commentboxitem.username
      }}</span>
      <span class="my-commentbox-time">
        {{ commentboxitem.time.replace("T", "  ").split(".")[0] }}</span
      ><a-popconfirm
        v-if="$store.state.loginstate.admintoken"
        title="主人您狠心要删除我嘛？ToT"
        ok-text="Yes"
        cancel-text="No"
        @confirm="backcommentid"
      >
        <a-icon type="delete" class="btn deletebtn" />
      </a-popconfirm>
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
  methods: {
    backcommentid() {
      console.log(this.commentboxitem);
      if (this.commentboxitem.commentID) {
        this.$emit("delcomment", this.commentboxitem.commentID);
      } else {
        this.$emit("delhallcomment", this.commentboxitem.id);
      }
    },
  },
  created() {},
};
</script>

<style>
.mycommentbox {
  width: 100%;
  flex-direction: column;
  padding: 10px 15px 18px;
  border-bottom: #e9e9e9 2px solid;
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
