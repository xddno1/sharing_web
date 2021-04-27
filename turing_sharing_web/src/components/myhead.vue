<template>
  <div class="myhead">
    <div class="headcontianer">
      <div class="welcome">
        <span>欢迎光临</span>
        <span>我们一直在努力</span>
      </div>

      <span v-if="token == ''" class="login" @click="showModal">请登录</span>
      <a-dropdown v-else>
        <span class="login">您好，{{ this.userform.name }}</span>
        <a-menu slot="overlay" @click="unlogin">
          <a-menu-item key="1"> 退出登录 </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <a-modal :visible="visible" :footer="null" @cancel="handleCancel">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="用户登录">
          <a-form>
            <a-form-item label="用户名">
              <a-input v-model="userform.name" />
            </a-form-item>
            <a-form-item label="密码">
              <a-input type="password" v-model="userform.password" />
            </a-form-item>
            <a-button
              style="margin-right: 10px; float: right"
              type="primary"
              @click="userLogin"
            >
              登录
            </a-button>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2" tab="管理员登录" force-render>
          <a-form>
            <a-form-item label="用户名">
              <a-input v-model="adminform.name" />
            </a-form-item>
            <a-form-item label="密码">
              <a-input type="password" v-model="adminform.password" />
            </a-form-item>
            <a-button
              style="margin-right: 10px; float: right"
              type="primary"
              @click="adminLogin"
            >
              登录
            </a-button>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="3" tab="用户注册">
          <a-form>
            <a-form-item label="用户名">
              <a-input class="username" v-model="registerform.name" />
            </a-form-item>
            <a-form-item label="密码">
              <a-input type="password" v-model="registerform.password" />
            </a-form-item>
            <a-button
              style="margin-right: 10px; float: right"
              type="primary"
              @click="onRegister"
            >
              注册
            </a-button>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "MyHead",
  components: {},
  data() {
    return {
      userform: {
        name: "",
        password: "",
      },
      adminform: {
        name: "",
        password: "",
      },
      registerform: {
        name: "",
        password: "",
      },
      visible: false,
      token: "",
    };
  },

  methods: {
    showModal() {
      this.visible = true;
    },
    handleCancel() {
      console.log("Clicked cancel button");
      this.visible = false;
    },
    userLogin() {
      axios
        .post(
          `http://121.4.187.232:8080/user/userLogin?password=${this.userform.password}&username=${this.userform.name}`
        )
        .then((a) => {
          console.log(a.data);
          console.log(a.data.msg);
          if (a.data.msg == "登录成功!!!") {
            this.visible = false;
            this.$message.success("登录成功！");
            const loginstate = {
              usertoken: a.data.token,
              userid: a.data.userID,
            };
            this.token = a.data.token;
            this.$store.commit("upDateToken", loginstate);
          }
          if (a.data.msg == null) {
            this.$message.error("密码错误！");
          }
          if (a.data.msg == "username is null") {
            this.$message.error("用户名不存在");
          }
        });
    },
    adminLogin() {
      axios
        .post(
          `http://121.4.187.232:8080/user/adminLogin?password=${this.adminform.password}&username=${this.adminform.name}`
        )
        .then((a) => {
          if (a.data.msg == "登录成功!!!") {
            this.userform = this.adminform;
            this.visible = false;
            this.$message.success("登录成功！");
            this.token = a.data.token;
            const loginstate = {
              admintoken: a.data.token,
            };
            this.$store.commit("upDateToken", loginstate);
            this.$router.push({
              name: "admin",
            });
          }
          if (a.data.msg == null) {
            this.$message.error("请检查用户名和密码");
          }
        });
    },
    onRegister() {
      axios
        .post(
          `http://121.4.187.232:8080/user/register?password=${this.registerform.password}&username=${this.registerform.name}`
        )
        .then((a) => {
          console.log(a);
          if (a.data == "isOk") {
            this.visible = false;
            this.$message.success("注册成功！");
            axios
              .post(
                `http://121.4.187.232:8080/user/userLogin?password=${this.registerform.password}&username=${this.registerform.name}`
              )
              .then((a) => {
                this.token = a.data.token;
                const loginstate = {
                  usertoken: a.data.token,
                  userid: a.data.userID,
                };
                this.$store.commit("upDateToken", loginstate);
                this.userform = this.registerform;
              });
          } else {
            this.$message.error("用户名已存在！");
          }
          console.log(a.data);
        });
    },
    unlogin() {
      if (this.$route.path == "/admin") {
        this.$router.replace({
          name: "index",
        });
      }
      this.token = "";
      this.$store.commit("upDateToken", {});
    },
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
  z-index: 100;
  background-color: pink;
  position: fixed;
  height: 50px;
  width: 100%;
}
.headcontianer {
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

.username {
  ime-mode: disabled;
}
</style>
