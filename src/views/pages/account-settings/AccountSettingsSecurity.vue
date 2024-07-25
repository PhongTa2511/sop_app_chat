<script setup>
import { ref } from "vue";
import { ChangePassword } from "@/api/user";
const isCurrentPasswordVisible = ref(false);
const isNewPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
var currentPassword = ref(null);
var newPassword = ref(null);
var confirmPassword = ref(null);

const passwordRequirements = [
  "Dài tối thiểu 8 ký tự - càng nhiều càng tốt",
  "Ít nhất một ký tự chữ thường",
  "Ít nhất một số, ký hiệu hoặc ký tự đặc biệt",
];

function checkPassword(password) {
  // Kiểm tra độ dài tối thiểu 8 ký tự
  if (password.length < 8) {
    return false;
  }

  // Kiểm tra ít nhất một ký tự chữ thường
  const hasLowerCase = /[a-z]/.test(password);
  if (!hasLowerCase) {
    return false;
  }

  // Kiểm tra ít nhất một số, ký hiệu hoặc ký tự đặc biệt
  const hasSpecialChar = /[\d!@#$%^&*(),.?":{}|<>]/.test(password);
  if (!hasSpecialChar) {
    return false;
  }

  // Nếu tất cả các điều kiện đều được thỏa mãn, trả về true
  return true;
}
function changePassword() {
  console.log(currentPassword.value, newPassword.value, confirmPassword.value);
  if (currentPassword.value && newPassword.value && confirmPassword.value) {
    if (!checkPassword(newPassword.value)) {
      notify({
        type: "error",
        title: "Lỗi",
        text: "Mật khẩu mới chưa đủ bảo mật",
      });
      return;
    }
    if (!checkPassword(confirmPassword.value)) {
      notify({
        type: "error",
        title: "Lỗi",
        text: "Xác nhận mật khẩu mới chưa đủ bảo mật",
      });
      return;
    }
    ChangePassword({
      OldPassword: currentPassword.value,
      NewPassword: confirmPassword.value,
    }).then((res) => {
      if (res.RespCode == 0) {
        notify({
          type: "success",
          title: "Thành công",
          text: "Cập nhật thông tin thành công",
        });
      }
    });
  } else {
    notify({
      type: "error",
      title: "Lỗi",
      text: "Vui lòng điền đẩy đủ thông tin",
    });
    return;
  }
}
</script>

<template>
  <VRow>
    <!-- SECTION: Change Password -->
    <VCol cols="12">
      <VCard title="Thay Đổi Mật Khẩu">
        <VForm>
          <VCardText>
            <!-- 👉 Current Password -->
            <VRow>
              <VCol cols="12" md="6">
                <!-- 👉 current password -->
                <VTextField
                  v-model="currentPassword"
                  :type="isCurrentPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isCurrentPasswordVisible ? 'bx-hide' : 'bx-show'
                  "
                  label="Mật Khẩu Hiện Tại"
                  placeholder="············"
                  @click:append-inner="
                    isCurrentPasswordVisible = !isCurrentPasswordVisible
                  "
                />
              </VCol>
            </VRow>

            <!-- 👉 New Password -->
            <VRow>
              <VCol cols="12" md="6">
                <!-- 👉 new password -->
                <VTextField
                  v-model="newPassword"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isNewPasswordVisible ? 'bx-hide' : 'bx-show'
                  "
                  label="Mật Khẩu Mới"
                  placeholder="············"
                  @click:append-inner="
                    isNewPasswordVisible = !isNewPasswordVisible
                  "
                />
              </VCol>

              <VCol cols="12" md="6">
                <!-- 👉 confirm password -->
                <VTextField
                  v-model="confirmPassword"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isConfirmPasswordVisible ? 'bx-hide' : 'bx-show'
                  "
                  label="Xác Nhận Mật Khẩu Mới"
                  placeholder="············"
                  @click:append-inner="
                    isConfirmPasswordVisible = !isConfirmPasswordVisible
                  "
                />
              </VCol>
            </VRow>
          </VCardText>

          <!-- 👉 Password Requirements -->
          <VCardText>
            <p class="text-base font-weight-medium mt-2">
              Yêu cầu về mật khẩu:
            </p>

            <ul class="d-flex flex-column gap-y-3">
              <li
                v-for="item in passwordRequirements"
                :key="item"
                class="d-flex"
              >
                <div>
                  <VIcon size="7" icon="bxs-circle" class="me-3" />
                </div>
                <span class="font-weight-medium">{{ item }}</span>
              </li>
            </ul>
          </VCardText>

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn @click="changePassword">Lưu thay đổi</VBtn>

            <!-- <VBtn type="reset" color="secondary" variant="tonal"> Reset </VBtn> -->
          </VCardText>
        </VForm>
      </VCard>
    </VCol>
    <!-- !SECTION -->

    <!-- SECTION Two-steps verification -->
    <!-- <VCol cols="12">
      <VCard title="Two-steps verification">
        <VCardText>
          <p class="font-weight-semibold">
            Two factor authentication is not enabled yet.
          </p>
          <p>
            Two-factor authentication adds an additional layer of security to
            your account by requiring more than just a password to log in.
            <a href="javascript:void(0)" class="text-decoration-none"
              >Learn more.</a
            >
          </p>

          <VBtn> Enable 2FA </VBtn>
        </VCardText>
      </VCard>
    </VCol> -->
    <!-- !SECTION -->

    <!-- <VCol cols="12">
      <VCard title="Create an API key">
        <VRow>
          <VCol cols="12" md="5" order-md="0" order="1">
            <VCardText>
              <VForm @submit.prevent="() => {}">
                <VRow>
                  <VCol cols="12">
                    <VSelect
                      label="Choose the API key type you want to create"
                      placeholder="Select API key type"
                      :items="[
                        'Full Control',
                        'Modify',
                        'Read & Execute',
                        'List Folder Contents',
                        'Read Only',
                        'Read & Write',
                      ]"
                    />
                  </VCol>

                  <VCol cols="12">
                    <VTextField
                      label="Name the API key"
                      placeholder="Name the API key"
                    />
                  </VCol>

                  <VCol cols="12">
                    <VBtn type="submit" block> Create Key </VBtn>
                  </VCol>
                </VRow>
              </VForm>
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
    </VCol> -->

    <!-- <VCol cols="12">
      <VCard title="API Key List &amp; Access">
        <VCardText>
          An API key is a simple encrypted string that identifies an application
          without any principal. They are useful for accessing public data
          anonymously, and are used to associate API requests with your project
          for quota and billing.
        </VCardText>

        <VCardText class="d-flex flex-column gap-y-4">
          <div
            v-for="serverKey in serverKeys"
            :key="serverKey.key"
            class="bg-var-theme-background pa-4"
          >
            <div class="d-flex align-center flex-wrap mb-3">
              <h6 class="text-h6 mb-0 me-3">
                {{ serverKey.name }}
              </h6>
              <VChip label color="primary" size="small">
                {{ serverKey.permission }}
              </VChip>
            </div>
            <p class="text-base font-weight-medium">
              <span class="me-3">{{ serverKey.key }}</span>
              <VIcon :size="18" icon="bx-copy" class="cursor-pointer" />
            </p>
            <span>Created on {{ serverKey.createdOn }}</span>
          </div>
        </VCardText>
      </VCard>
    </VCol> -->
  </VRow>
</template>
