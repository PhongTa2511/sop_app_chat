<script>
import AuthProvider from "@/views/pages/authentication/AuthProvider.vue";
import logo from "@images/logos/cpc1hn-logo.png";
import { Login } from "@/api/user.js";
import {
  setToken,
  setFullName,
  setPhoneNumber,
  setEmployCode,
  setEmail,
  setUserName,
} from "@/utils/auth";
export default {
  data() {
    return {
      form: {
        phone: "",
        password: "",
        remember: false,
      },
      logo: logo,
      isPasswordVisible: false,
    };
  },
  components: {
    AuthProvider,
  },
  methods: {
    btLogin() {
      Login({
        idEmployee: this.form.idEmployee,
        password: this.form.password,
      }).then((res) => {
        setToken(res.Token);
        setUserName(this.form.idEmployee);
        setFullName(res.Data.FullName);
        setPhoneNumber(res.Data.nameEmployee);
        setEmployCode(res.Data.employeeCode);
        setEmail(res.Data.emailCompany);

        this.$router.push("/");
        notify({
          type: "success",
          title: "Thành công",
          text: "Đăng nhập thành công",
        });
      });
    },
  },
};
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard class="auth-card pa-4 pt-7" max-width="448">
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <img :src="logo" alt="" style="height: 60px" />
          </div>
        </template>

        <!-- <VCardTitle class="text-h3 font-weight-bold"> DTP </VCardTitle> -->
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 mb-1">Quản lý quy trình DTP 👋🏻</h5>
        <p class="mb-0">
          Vui lòng đăng nhập vào tài khoản của bạn và bắt đầu trải nghiệm
        </p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="btLogin">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.idEmployee"
                autofocus
                placeholder="Nhập số điện thoại"
                label="Số điện thoại"
                type="phone"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- remember me checkbox -->
              <div
                class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4"
              >
                <!-- <VCheckbox v-model="form.remember" label="Remember me" /> -->

                <!-- <RouterLink
                  class="text-primary ms-2 mb-1"
                  to="javascript:void(0)"
                >
                  Quên mật khẩu?
                </RouterLink> -->
              </div>

              <!-- login button -->
              <VBtn block type="submit" rounded="md"> Đăng nhập </VBtn>
            </VCol>

            <!-- create account -->
            <!-- <VCol cols="12" class="text-center text-base">
              <span>Bạn chưa có tải khoản ?</span>
              <RouterLink class="text-primary ms-2" to="/dang-ky">
                Tạo mới
              </RouterLink>
            </VCol> -->

            <!-- <VCol cols="12" class="d-flex align-center">
              <VDivider />
              <span class="mx-4">or</span>
              <VDivider />
            </VCol> -->

            <!-- auth providers -->
            <!-- <VCol cols="12" class="text-center">
              <AuthProvider />
            </VCol> -->
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
