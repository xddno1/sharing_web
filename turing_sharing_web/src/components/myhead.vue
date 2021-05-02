<template>
  <div class="myhead">
    <div class="headcontianer">
      <div class="welcome">
        <span>{{ headtitle }}</span>
      </div>

      <span v-if="token == ''" class="login" @click="showModal"
        >Hi, 请登录</span
      >
      <a-dropdown v-else>
        <span class="login">Hi, {{ userform.name }}</span>
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
            <span>注册自动登录</span>
            <a-switch
              style="margin-right: 10px; float: left"
              default-checked
              @change="aotulogin"
            />
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
      headtitle: "资源下载网",
      autologin: true,
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
            localStorage.setItem("xdd_user_token", this.token);
            localStorage.setItem("xdd_user_id", a.data.userID);
            localStorage.setItem("xdd_user_name", this.userform.name);
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
            localStorage.setItem("xdd_admin_token", this.token);
            localStorage.setItem("xdd_admin_name", this.userform.name);
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
            if (this.autologin) {
              axios
                .post(
                  `http://121.4.187.232:8080/user/userLogin?password=${this.registerform.password}&username=${this.registerform.name}`
                )
                .then((a) => {
                  this.userform = this.registerform;
                  this.token = a.data.token;
                  localStorage.setItem("xdd_user_token", this.token);
                  localStorage.setItem("xdd_user_id", a.data.userID);
                  localStorage.setItem("xdd_user_name", this.userform.name);
                  const loginstate = {
                    usertoken: a.data.token,
                    userid: a.data.userID,
                  };
                  this.$store.commit("upDateToken", loginstate);
                });
            }
          } else {
            this.$message.error("用户名已存在！");
          }
          console.log(a.data);
        });
    },
    aotulogin() {
      this.autologin = !this.autologin;
    },
    unlogin() {
      if (this.$route.path == "/admin") {
        this.$router.replace({
          name: "index",
        });
      }
      this.token = "";
      localStorage.setItem("xdd_admin_token", this.token);
      localStorage.setItem("xdd_admin_name", "this.token");
      localStorage.setItem("xdd_user_token", this.token);
      localStorage.setItem("xdd_user_id", "1");
      localStorage.setItem("xdd_user_name", "1");
      localStorage.removeItem("xdd_admin_token");
      localStorage.removeItem("xdd_admin_name");
      localStorage.removeItem("xdd_user_token");
      localStorage.removeItem("xdd_user_id");
      localStorage.removeItem("xdd_user_name");
      this.$store.commit("upDateToken", {});
    },
  },

  created() {
    let usertoken = localStorage.getItem("xdd_user_token");
    let admintoken = localStorage.getItem("xdd_admin_token");
    if (usertoken) {
      let userid = localStorage.getItem("xdd_user_id");
      let username = localStorage.getItem("xdd_user_name");
      console.log(username);
      const loginstate = {
        usertoken: usertoken,
        userid: userid,
      };
      this.userform.name = username;
      this.$store.commit("upDateToken", loginstate);
      this.token = usertoken;
      this.$router.push({
        name: "index",
      });
    }
    if (admintoken) {
      let adminname = localStorage.getItem("xdd_admin_name");
      console.log(adminname);
      const loginstate = {
        admintoken: admintoken,
      };
      this.userform.name = adminname;
      this.$store.commit("upDateToken", loginstate);
      this.token = admintoken;
      this.$router.push({
        name: "admin",
      });
    } else {
      this.$router.push({
        name: "index",
      });
    }
  },
};
</script>

<style>
.myhead {
  z-index: 100;
  background-color: #fff;
  position: fixed;
  height: 50px;
  width: 100%;
  box-shadow: 0 0 5px #888888;
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
