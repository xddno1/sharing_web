<template>
  <div class="myadmin">
    <div class="my-admin-btn-parent">
      <a-button
        class="my-admin-btn"
        type="primary"
        @click="editnotice_show_close"
        >发布公告</a-button
      >
    </div>
    <a-modal :visible="visible" :footer="null" @cancel="editnotice_show_close">
      <div>
        <span class="my-admin-title" style="margin-left: 0">发布公告</span>
      </div>
      <a-textarea
        v-model="noticecontent"
        placeholder="快输入要发布的公告吧！！"
        auto-size
      ></a-textarea>
      <div class="my-admin-notice-btn-parent">
        <a-button class="my-admin-notice-btn" type="primary" @click="sentnotice"
          >发布</a-button
        >
      </div>
    </a-modal>
    <div><span class="my-admin-title">文章管理</span></div>
    <div>
      <a-button class="my-admin-add-item-btn" type="primary" @click="additem"
        >新建</a-button
      >
    </div>
    <a-table
      class="mytable"
      :columns="itemscolumns"
      :data-source="allitems"
      rowKey="id"
      :pagination="{ pageSize: 5 }"
    >
      <template slot="edit" slot-scope="text">
        <a-popconfirm
          title="主人您狠心要删除我嘛？ToT"
          ok-text="Yes"
          cancel-text="No"
          @confirm="deletitem(text)"
        >
          <a-icon type="delete" class="btn deletebtn" />
        </a-popconfirm>

        <a-icon type="edit" class="btn editbtn" @click="edititem(text)" />
      </template>
    </a-table>
    <div><span class="my-admin-title">大厅评论</span></div>
    <a-table
      class="mytable"
      :columns="hallcommentcolumns"
      :data-source="allhallcomment"
      rowKey="id"
      :pagination="{ pageSize: 5 }"
    >
      <template slot="edit" slot-scope="text">
        <a-popconfirm
          title="主人您狠心要删除我嘛？ToT"
          ok-text="Yes"
          cancel-text="No"
          @confirm="delethallcomment(text)"
        >
          <a-icon type="delete" class="btn deletebtn" />
        </a-popconfirm>
      </template>
    </a-table>

    <div v-if="false">
      <div class="pages">
        <h1>图片上传</h1>
        <div>
          <span>请输入文章id</span>
          <input type="text" v-model="imgpassageid" />
        </div>

        <input
          name="imgfile"
          ref="imgfile"
          type="file"
          accept="image/png, image/gif, image/jpeg"
        />
        <button @click="uploadimg">上传</button>
      </div>
      <div>
        <h1>资源上传</h1>
        <div>
          <span>请输入文章id</span>
          <input type="text" v-model="resourcepassageid" />
        </div>
        <input name="resourcefile" ref="resourcefile" type="file" />
        <button @click="uploadresource">上传</button>
      </div>
      <div>
        <h1>新建文章</h1>
        <div>
          <span>请输入标题：</span>
          <input type="text" v-model="newitemtitle" />
        </div>
        <div>
          <span>请输入内容：</span>
          <input type="text" v-model="newitemcontent" />
        </div>
        <button @click="creatitem">创建</button>
      </div>

      <div>
        <h1>更新文章</h1>
        <div>
          <div>
            <span>请输入文章id</span>
            <input type="text" v-model="itemid" />
          </div>
          <button @click="getitem">获取文章数据</button>
          <div>
            <span>文章标题:</span>
            <input type="text " v-model="updateitemtitle" />
          </div>
          <div>
            <span>文章内容:</span>
            <input type="text " v-model="updateitemcontent" />
          </div>
          <button @click="updateitem">更新</button>
        </div>
      </div>
      <div>
        <h1>更新文章</h1>
        <div>
          <div>
            <span>请输入文章id</span>
            <input type="text" v-model="itemid" />
          </div>
        </div>
      </div>
    </div>
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
      itemscolumns: [
        {
          title: "时间",
          dataIndex: "time",
          width: 200,
          key: "time",
        },
        {
          title: "标题",
          dataIndex: "title",
          key: "title",
        },
        {
          title: "操作",
          width: 100,
          dataIndex: "id",
          key: "id",
          scopedSlots: { customRender: "edit" },
        },
      ],
      hallcommentcolumns: [
        {
          title: "时间",
          dataIndex: "time",
          width: 200,
          key: "hallcommenttime",
        },
        {
          title: "内容",
          dataIndex: "content",
          ellipsis: true,
          key: "hallcommentcontent",
        },
        {
          title: "操作",
          width: 100,
          dataIndex: "id",
          key: "id",
          scopedSlots: { customRender: "edit" },
        },
      ],
      file: null,
      myname: "",
      imgpassageid: "",
      resourcepassageid: "",
      newitemtitle: "",
      newitemcontent: "",
      allhallcomment: [],
      allitems: [],
      itemid: "",
      updateitemtitle: "",
      updateitemcontent: "",
      visible: false,
      noticecontent: "",
    };
  },
  methods: {
    editnotice_show_close() {
      axios.get(`http://121.4.187.232:8080/notice/queryNotice`).then((a) => {
        console.log(a.data);
        this.noticecontent = a.data;
      });
      this.visible = !this.visible;
    },
    sentnotice() {
      this.visible = !this.visible;
      axios({
        method: "post",
        url: `http://121.4.187.232:8080/admin/updateNotice?content=${this.noticecontent}`,
        headers: {
          token: this.$store.state.loginstate.admintoken,
        },
      })
        .then((e) => {
          this.$message.success("发布成功！");
        })
        .catch((e) => {
          this.$message.error("发布失败！");
        });
    },
    uploadimg() {
      let formData = new FormData();
      formData.append("passageID", this.imgpassageid);
      console.log(this.$refs.imgfile.files[0]);
      formData.append("file", this.$refs.imgfile.files[0]);
      formData.append("file", this.$refs.imgfile.files[0]);
      console.log(formData.getAll("file"));
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
    uploadresource() {
      let formData = new FormData();
      formData.append("passageID", this.resourcepassageid);
      formData.append("file", this.$refs.resourcefile.files[0]);
      formData.append("file", this.$refs.resourcefile.files[0]);
      axios({
        method: "post",
        url: "http://121.4.187.232:8080/admin/uploadResources",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          token: this.$store.state.loginstate.admintoken,
        },
      }).then((e) => {
        this.$message.success("上传成功！");
      });
    }, //this.$store.state.maxpage
    creatitem() {
      axios({
        method: "post",
        url: `http://121.4.187.232:8080/admin/createPassage?content=${this.newitemcontent}&title=${this.newitemtitle}`,
        headers: {
          token: this.$store.state.loginstate.admintoken,
        },
      }).then((e) => {
        this.$message.success("创建成功！");
        this.newitemcontent = "";
        this.newitemtitle = "";
      });
    },
    getallhallcomment() {
      //121.4.187.232:8080/admin/queryAllUser
      axios({
        method: "get",
        url: ` http://121.4.187.232:8080/hallComment/queryAllHallComment`,
      }).then((e) => {
        this.$message.success("获取成功！");
        for (let i in e.data) {
          e.data[i].time = e.data[i].time.replace("T", "  ").split(".")[0];
        }
        this.allhallcomment = e.data;
      });
    },
    delethallcomment(e) {
      axios({
        method: "post",
        url: `http://121.4.187.232:8080/admin/deleteHallComment?ID=${e}`,
        headers: {
          token: this.$store.state.loginstate.admintoken,
        },
      }).then((e) => {
        this.$message.success("删除成功！");
        this.getallhallcomment();
      });
    },
    getitem() {
      //http://121.4.187.232:8080/passage/passageResources?passageID=2
      axios({
        method: "get",
        url: ` http://121.4.187.232:8080/passage/passageResources?passageID=${this.itemid}`,
      }).then((e) => {
        this.$message.success("获取成功！");
        // e[0].content       内容
        // e[0].time          时间
        // e[0].title         标题
        this.updateitemtitle = e.data[0].title;
        this.updateitemcontent = e.data[0].content;
        this.alluser = e.data;
      });
    },
    updateitem() {
      axios({
        method: "post",
        url: ` http://121.4.187.232:8080/admin/updatePassage?content=${this.updateitemcontent}&passageID=${this.itemid}&title=${this.updateitemtitle}`,
        headers: {
          token: this.$store.state.loginstate.admintoken,
        },
      }).then((e) => {
        this.$message.success("更新成功！");
        this.updateitemtitle = "";
        this.updateitemcontent = "";
      });
    },
    getbox() {
      if (typeof this.$store.state.maxpage != "object") {
        axios
          .get(
            `http://121.4.187.232:8080/passage/queryAllPassage?pageNo=${this.pageNo}&pageSize=${this.$store.state.maxpage}`
          )
          .then((e) => {
            //设置时间的展示方式
            for (let i in e.data.passageItem) {
              e.data.passageItem[i].time = e.data.passageItem[i].time
                .replace("T", "  ")
                .split(".")[0];
            }
            this.allitems = e.data.passageItem;
          });
      } else {
        axios
          .get(
            `http://121.4.187.232:8080/passage/queryAllPassage?pageNo=${this.pageNo}&pageSize=1`
          )
          .then((e) => {
            //设置时间的展示方式
            this.$store.state.maxpage = e.data.passageItemCount;
            this.getbox();
          });
      }
    },
    deletitem(e) {
      axios({
        method: "post",
        url: `http://121.4.187.232:8080/admin/deletePassage?passageID=${e}`,
        headers: {
          token: this.$store.state.loginstate.admintoken,
        },
      }).then((e) => {
        this.$message.success("删除成功！");
        this.getbox();
      });
    },
    edititem(e) {
      this.$router.push({
        name: "edititem",
        query: {
          item: e,
        },
      });
    },
    additem() {
      this.$router.push({
        name: "edititem",
        query: {
          item: "newitem",
        },
      });
    },
  },
  created() {
    this.getbox();
    this.getallhallcomment();
  },
};
</script>

<style>
.myadmin {
  background-color: #fff;
}
.my-admin-notice-btn-parent {
  text-align: center;
}
.my-admin-notice-btn-parent .my-admin-notice-btn {
  margin-top: 30px;
}
.my-admin-btn-parent {
  position: fixed;
  text-align: center;
  bottom: 20px;
  right: 30px;
}
.my-admin-btn-parent .my-admin-btn {
  margin-top: 10px;
  margin-bottom: 30px;
  width: 50px;
  height: 100px;
}
.my-admin-btn-parent .my-admin-btn span {
  writing-mode: tb-rl;
  display: inline;
}
.my-admin-title {
  line-height: 60px;
  font-size: 20px;
  font-weight: 600;
  margin-left: 50px;
  margin-bottom: 10px;
}
.my-admin-add-item-btn {
  margin-left: 50px;
  margin-bottom: 10px;
}
.mytable {
  padding: 0 50px;
  background-color: #fff;
  margin-bottom: 40px;
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
