<script>
import { Login } from "@/api/user.js"
import {
  removeAvatar,
  setAvatar,
  setEmail,
  setEmployCode,
  setFullName,
  setPhoneNumber,
  setRole,
  setToken,
  setUserName,
} from "@/utils/auth"
import logo from "@images/logos/dtp-logo.png"

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
    }
  },

  methods: {
    btLogin() {
      Login({
        UserName: this.form.idEmployee,
        Password: this.form.password,
      }).then(res => {
        setToken(res.Token)
        setUserName(this.form.idEmployee)
        setFullName(res.UserInfo.FullName)
        setPhoneNumber(res.UserInfo.PhoneNumber)
        setEmployCode(res.UserInfo.EmployeeCode)
        setEmail(res.UserInfo.Email)
        setRole(res.UserInfo.Role)
        if (res.UserInfo.LinkImage && res.UserInfo.LinkImage != "") {
          setAvatar(res.UserInfo.LinkImage)
        } else {
          removeAvatar()
        }
        this.$router.push("/")
        notify({
          type: "success",
          title: "Thành công",
          text: "Đăng nhập thành công",
        })
      })
    },
  },
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card px-4 pb-4"
      max-width="448"
    >
      <div class="d-flex justify-center">
        <img
          :src="logo"
          alt=""
          style="height: 180px"
        >
      </div>

      <VCardText class="pt-0">
        <h5 class="text-h5 mb-1">
          Quản lý quy trình DTP 👋🏻
        </h5>
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
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                <!-- <VCheckbox v-model="form.remember" label="Remember me" /> -->

                <!--
                  <RouterLink
                  class="text-primary ms-2 mb-1"
                  to="javascript:void(0)"
                  >
                  Quên mật khẩu?
                  </RouterLink> 
                -->
              </div>

              <!-- login button -->
              <VBtn
                block
                type="submit"
                rounded="md"
              >
                Đăng nhập
              </VBtn>
            </VCol>

            <!-- create account -->
            <!--
              <VCol cols="12" class="text-center text-base">
              <span>Bạn chưa có tải khoản ?</span>
              <RouterLink class="text-primary ms-2" to="/dang-ky">
              Tạo mới
              </RouterLink>
              </VCol> 
            -->

            <!--
              <VCol cols="12" class="d-flex align-center">
              <VDivider />
              <span class="mx-4">or</span>
              <VDivider />
              </VCol> 
            -->

            <!-- auth providers -->
            <!--
              <VCol cols="12" class="text-center">
              <AuthProvider />
              </VCol> 
            -->
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
