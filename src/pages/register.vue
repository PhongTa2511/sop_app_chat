<script>
import AuthProvider from "@/views/pages/authentication/AuthProvider.vue";
import logo from "@/assets/images/logos/dtp-logo.png";
import { GetOTPCheck, UserRegister } from "@/api/user";
export default {
  data() {
    return {
      form: {
        PrivacyPolicies: false,
      },
      logo: logo,
      loadingOTP: false,
      isPasswordVisible: false,
    };
  },
  components: {
    AuthProvider,
  },
  methods: {
    btRegister() {
      if (
        this.form.OTP &&
        this.form.Email &&
        this.form.FullName &&
        this.form.Phone &&
        this.form.Password
      ) {
        UserRegister({
          OTP: this.form.OTP,
          Email: this.form.Email,
          FullName: this.form.FullName,
          Phone: this.form.Phone,
          Password: this.form.Password,
        }).then((res) => {
          if (res.RespCode == 0) {
            this.$router.push("/");
            notify({
              type: "success",
              title: "Thành công",
              text: "Đăng ký tài khoản thành công",
            });
          }
        });
      } else {
        notify({
          type: "error",
          title: "Lỗi",
          text: "Vui lòng điền đầy đủ thông tin",
        });
      }
    },
    btGetOTP() {
      this.loadingOTP = true;
      if (this.form.Email && this.form.Phone) {
        GetOTPCheck({
          Email: this.form.Email,
          Phone: this.form.Phone,
        }).then((res) => {
          if (res.RespCode == 0) {
            notify({
              type: "success",
              title: "Thành công",
              text: "Vui lòng kiểm tra email để lấy OTP",
            });
          }
          this.loadingOTP = false;
        });
      } else {
        notify({
          type: "error",
          title: "Lỗi",
          text: "Vui lòng điền đầy đủ thông tin",
        });
        this.loadingOTP = false;
      }
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
            <!-- <div
              class="d-flex text-primary"
              v-html="logo"
            /> -->
            <img :src="logo" alt="" style="height: 60px" />
          </div>
        </template>

        <VCardTitle class="text-h3 font-weight-bold"> DTP </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 mb-1">Bắt đầu trải nghiệm từ đây 🚀</h5>
        <p class="mb-0">
          Làm cho việc quản lý chấm công của bạn trở nên dễ dàng và thú vị!
        </p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="btRegister">
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="form.FullName"
                autofocus
                label="Họ và tên"
                placeholder="Nhập họ và tên"
                clearable
              />
            </VCol>
            <!-- Username -->
            <VCol cols="12">
              <VTextField
                v-model="form.Phone"
                label="Số điện thoại"
                placeholder="Nhập số điện thoại"
                clearable
              />
            </VCol>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.Email"
                label="Email"
                placeholder="DTP@email.com"
                type="email"
                clearable
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.Password"
                label="Mật khẩu"
                placeholder="············"
                clearable
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="form.OTP"
                autofocus
                label="OTP"
                clearable
                placeholder="Nhập OTP"
              >
                <template v-slot:append>
                  <v-btn class="mt-n2" :loading="loadingOTP" @click="btGetOTP">
                    Lấy OTP
                  </v-btn>
                </template>
              </VTextField>

              <div class="d-flex align-center mt-1 mb-4">
                <VCheckbox
                  id="privacy-policy"
                  v-model="form.PrivacyPolicies"
                  inline
                />
                <VLabel for="privacy-policy" style="opacity: 1">
                  <span class="me-1"
                    >Tôi đồng ý với
                    <a class="text-primary"
                      >chính sách và điều khoản <br />bảo mật</a
                    ></span
                  >
                </VLabel>
              </div>

              <VBtn block type="submit"> Đăng ký </VBtn>
            </VCol>

            <!-- login instead -->
            <VCol cols="12" class="text-center text-base">
              <span>Bạn đã có một tài khoản?</span>
              <RouterLink class="text-primary ms-2" to="/dang-nhap">
                Đăng nhập ngay
              </RouterLink>
            </VCol>

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
