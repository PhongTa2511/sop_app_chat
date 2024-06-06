<script setup>
import AuthProvider from "@/views/pages/authentication/AuthProvider.vue";
import logo from "@images/logo-box.png";

const form = ref({
  username: "",
  email: "",
  password: "",
  privacyPolicies: false,
});

const isPasswordVisible = ref(false);
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

        <VCardTitle class="text-h3 font-weight-bold"> iLab </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 mb-1">Bắt đầu trải nghiệm từ đây 🚀</h5>
        <p class="mb-0">
          Làm cho việc quản lý chấm công của bạn trở nên dễ dàng và thú vị!
        </p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="$router.push('/')">
          <VRow>
            <!-- Username -->
            <VCol cols="12">
              <VTextField
                v-model="form.username"
                autofocus
                label="Số điện thoại"
                placeholder="0397613784"
              />
            </VCol>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                label="Email"
                placeholder="ilab@email.com"
                type="email"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Mật khẩu"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
              <div class="d-flex align-center mt-1 mb-4">
                <VCheckbox
                  id="privacy-policy"
                  v-model="form.privacyPolicies"
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
