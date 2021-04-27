<template>
  <div class="myadmin">
    <button @click="getbox">获取所有文章</button>
    <a-table :columns="itemscolumns" :data-source="allitems">
      <template slot="edit" slot-scope="text">
        <a-icon type="delete" class="deletebtn" @click="deletitem(text)" />
      </template>
    </a-table>
    <button @click="getalluser">获取所有用户</button>
    <a-table :columns="usercolumns" :data-source="alluser">
      <div slot="edit">
        <span>edit</span>
      </div>
    </a-table>

    <a-table :columns="columns" :data-source="data">
      <a slot="name" slot-scope="text">{{ text }}</a>
    </a-table>

    <!-- <div class="pages">
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
      <h1>获取用户信息</h1>
      <div>
        <button @click="getalluser">获取所有用户</button>
        <button @click="alluser = []">清除</button>
      </div>

      <div v-for="(item, index) in alluser" :key="index">
        <span>{{ item.userId }}--</span>
        <span>{{ item.username }}--</span>
        <span>{{ item.password }}</span>
      </div>
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
    </div> -->
  </div>
</template>

<script>
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    scopedSlots: { customRender: "name" },
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
    width: 80,
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address 1",
    ellipsis: true,
  },
  {
    title: "Long Column Long Column Long Column",
    dataIndex: "address",
    key: "address 2",
    ellipsis: true,
  },
  {
    title: "Long Column Long Column",
    dataIndex: "address",
    key: "address 3",
    ellipsis: true,
  },
  {
    title: "Long Column",
    dataIndex: "address",
    key: "address 4",
    ellipsis: true,
  },
];

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park, New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 2 Lake Park, London No. 2 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park, Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

import axios from "axios";
export default {
  name: "myadmin",
  components: {},
  props: [],
  data() {
    return {
      itemscolumns: [
        {
          title: "time",
          dataIndex: "time",
          key: "time",
        },
        {
          title: "title",
          dataIndex: "title",
          key: "title",
        },
        {
          title: "operation",
          dataIndex: "id",
          key: "edit",
          scopedSlots: { customRender: "edit" },
        },
      ],
      usercolumns: [
        {
          title: "userId",
          dataIndex: "userId",
          key: "userId",
        },
        {
          title: "userName",
          dataIndex: "username",
          key: "userName",
        },
        {
          title: "userPassword",
          dataIndex: "password",
          key: "userPassword",
        },
        {
          title: "operation",
          dataIndex: "edit",
          key: "edit",
          scopedSlots: { customRender: "edit" },
        },
      ],
      file: null,
      myname: "",
      imgpassageid: "",
      resourcepassageid: "",
      newitemtitle: "",
      newitemcontent: "",
      alluser: [],
      allitems: [],
      itemid: "",
      updateitemtitle: "",
      updateitemcontent: "",
      data: data,
      columns: columns,
    };
  },
  methods: {
    uploadimg() {
      let formData = new FormData();
      console.log(formData);
      formData.append("passageID", this.imgpassageid);
      console.log(formData.get("passageID"));
      formData.append("file", this.$refs.imgfile.files[0]);
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
    uploadresource() {
      let formData = new FormData();
      console.log(formData);
      formData.append("passageID", this.resourcepassageid);
      console.log(formData.get("passageID"));
      formData.append("file", this.$refs.resourcefile.files[0]);
      formData.append("file", this.$refs.resourcefile.files[0]);
      console.log(formData.getAll("file"));
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
    getalluser() {
      //121.4.187.232:8080/admin/queryAllUser
      axios({
        method: "post",
        url: ` http://121.4.187.232:8080/admin/queryAllUser`,
        headers: {
          token: this.$store.state.loginstate.admintoken,
        },
      }).then((e) => {
        this.$message.success("获取成功！");
        this.alluser = e.data;
        console.log(e);
      });
    },
    getitem() {
      //http://121.4.187.232:8080/passage/passageResources?passageID=2
      axios({
        method: "get",
        url: ` http://121.4.187.232:8080/passage/passageResources?passageID=${this.itemid}`,
      }).then((e) => {
        this.$message.success("获取成功！");
        this.alluser = e.data;
        // e[0].content       内容
        // e[0].time          时间
        // e[0].title         标题
        console.log(e.data);
        console.log(e.data[0]);
        this.updateitemtitle = e.data[0].title;
        this.updateitemcontent = e.data[0].content;
        console.log(e);
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
      axios
        .get(
          `http://121.4.187.232:8080/passage/queryAllPassage?pageNo=${this.pageNo}&pageSize=${this.$store.state.maxpage}`
        )
        .then((e) => {
          console.log(e.data.passageItem);
          this.allitems = e.data.passageItem;
        });
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
.deletebtn {
  cursor: pointer;
  color: red;
}
.deletebtn :hover {
  animation-name: deletebtnhover;
  animation-duration: 0.1s;
  animation-fill-mode: forwards;
}
.deletebtn :active {
  animation-name: deletebtnactive;
  animation-duration: 0.1s;
}
@keyframes deletebtnhover {
  to {
    width: 120%;
    height: 120%;
  }
}
@keyframes deletebtnactive {
  to {
    width: 90%;
    height: 90%;
  }
}
</style>
