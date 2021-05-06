<template>
  <div class="myhead">
    <div class="headcontianer">
      <div class="welcome">
        <span>{{ headtitle }}</span>
      </div>

      <span v-if="token == ''" class="login" @click="showModal"
        >Hi, 请登录</span
      >
      <div v-else class="login">
        <a-button
          v-if="istoindex"
          class="adminbutton"
          type="primary"
          @click="backtoindex"
        >
          去首页
        </a-button>
        <a-button
          v-if="istoadmin"
          class="adminbutton"
          type="primary"
          @click="backtoadmin"
        >
          去管理页
        </a-button>
        <a-dropdown>
          <span>Hi, {{ userform.name }}</span>
          <a-menu slot="overlay" @click="unlogin">
            <a-menu-item key="1"> 退出登录 </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
    <a-modal :visible="visible" :footer="null" @cancel="handleCancel">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="用户登录">
          <a-form>
            <a-form-item label="用户名" :class="{ 'div-warn': overnamelen1 }">
              <a-input
                v-model="userform.name"
                :class="{ 'textarea-warn': overnamelen1 }"
              />
              <span v-if="overnamelen1" class="length-warn"
                >用户名不得超过50字</span
              >
            </a-form-item>
            <a-form-item label="密码" :class="{ 'div-warn': overpasswordlen1 }">
              <a-input
                type="password"
                v-model="userform.password"
                :class="{ 'textarea-warn': overpasswordlen1 }"
              />
              <span v-if="overpasswordlen1" class="length-warn"
                >密码不得超过50字</span
              >
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
            <a-form-item label="用户名" :class="{ 'div-warn': overnamelen2 }">
              <a-input
                v-model="adminform.name"
                :class="{ 'textarea-warn': overnamelen2 }"
              />
              <span v-if="overnamelen2" class="length-warn"
                >用户名不得超过50字</span
              >
            </a-form-item>
            <a-form-item label="密码" :class="{ 'div-warn': overpasswordlen2 }">
              <a-input
                type="password"
                v-model="adminform.password"
                :class="{ 'textarea-warn': overpasswordlen2 }"
              />
              <span v-if="overpasswordlen2" class="length-warn"
                >密码不得超过50字</span
              >
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
            <a-form-item label="用户名" :class="{ 'div-warn': overnamelen3 }">
              <a-input
                class="username"
                v-model="registerform.name"
                :class="{ 'textarea-warn': overnamelen3 }"
              />
              <span v-if="overnamelen3" class="length-warn"
                >用户名不得超过50字</span
              >
            </a-form-item>
            <a-form-item label="密码" :class="{ 'div-warn': overpasswordlen3 }">
              <a-input
                type="password"
                v-model="registerform.password"
                :class="{ 'textarea-warn': overpasswordlen3 }"
              />
              <span v-if="overpasswordlen3" class="length-warn"
                >密码不得超过50字</span
              >
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
      if (
        this.overnamelen1 ||
        this.overpasswordlen1 ||
        this.userform.name == "" ||
        this.userform.password == ""
      ) {
        this.$message.error("请检查用户名和密码");
      } else {
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
                username: this.userform.name,
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
      }
    },
    adminLogin() {
      if (
        this.overnamelen2 ||
        this.overpasswordlen2 ||
        this.adminform.name == "" ||
        this.adminform.password == ""
      ) {
        this.$message.error("请检查用户名和密码");
      } else {
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
                adminname: this.adminform.name,
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
      }
    },
    onRegister() {
      if (
        this.overnamelen3 ||
        this.overpasswordlen3 ||
        this.registerform.name == "" ||
        this.registerform.password == ""
      ) {
        this.$message.error("请检查用户名和密码");
      } else {
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
                    const loginstate = {
                      usertoken: a.data.token,
                      userid: a.data.userID,
                      username: this.userform.name,
                    };
                    this.$store.commit("upDateToken", loginstate);
                  });
              }
            } else {
              this.$message.error("用户名已存在！");
            }
            console.log(a.data);
          });
      }
    },
    aotulogin() {
      this.autologin = !this.autologin;
    },
    unlogin() {
      if (this.$route.path == "/admin" || this.$route.path == "/edititem") {
        this.$router.replace({
          name: "index",
        });
      }
      this.token = "";
      this.$store.commit("upDateToken", {});
    },
    backtoindex() {
      this.$router.push({
        name: "index",
      });
    },
    backtoadmin() {
      this.$router.push({
        name: "admin",
      });
    },
  },
  computed: {
    istoindex() {
      return (
        (this.$route.path == "/admin" || this.$route.path == "/edititem") &&
        this.$store.state.loginstate.admintoken
      );
    },
    istoadmin() {
      return (
        !(this.$route.path == "/admin" || this.$route.path == "/edititem") &&
        this.$store.state.loginstate.admintoken
      );
    },
    overnamelen1() {
      return this.userform.name.length > 50;
    },
    overnamelen2() {
      return this.adminform.name.length > 50;
    },
    overnamelen3() {
      return this.registerform.name.length > 50;
    },
    overpasswordlen1() {
      return this.userform.password.length > 50;
    },
    overpasswordlen2() {
      return this.adminform.password.length > 50;
    },
    overpasswordlen3() {
      return this.registerform.password.length > 50;
    },
  },

  created() {
    let usertoken = this.$store.state.loginstate.usertoken;
    let admintoken = this.$store.state.loginstate.admintoken;
    if (usertoken) {
      let username = this.$store.state.loginstate.username;
      this.userform.name = username;
      this.token = usertoken;
      //     this.$router.push({
      //       name: "index",
      //     });
    }
    if (admintoken) {
      let adminname = this.$store.state.loginstate.adminname;
      this.userform.name = adminname;
      this.token = admintoken;
      //     this.$router.push({
      //       name: "admin",
      //     });
      //   } else {
      //     this.$router.push({
      //       name: "index",
      //     });
    }
  },
};
</script>

<style>
.myhead {
  z-index: 100;
  background-color: #f0f0f0;
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

.adminbutton {
  border-color: #fff;
  color: #1890ff;
  background-color: #fff;
  position: relative;
  margin-right: 5px;
}
.adminbutton:hover {
  border-color: #fff;
  color: #1890ff;
  background-color: #fff;
}
.adminbutton:focus {
  border-color: #fff;
  color: #1890ff;
  background-color: #fff;
}
.length-warn {
  font-size: 8px;
  color: #ff5e52;
  line-height: 8px;
}
.textarea-warn {
  color: #ff5e52;
  border-color: #ff5e52;
}
.div-warn {
  margin-bottom: 0;
}
</style>
