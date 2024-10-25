<script setup>
import avatar1 from "@images/avatars/avatar-1.png";
import {
  GetUserInfo,
  UpdateUserInfo,
  urlUploadImageAvatar,
} from "@/api/user.js";
import { formatDateUpload } from "@/helpers/getTime";
import { getUserID, setAvatar } from "@/utils/auth";
import Axios from "axios";
const accountData = {
  avatarImg: avatar1,
};

const refInputEl = ref();
const accountDataLocal = ref(structuredClone(accountData));
const isAccountDeactivated = ref(false);

const resetForm = () => {
  accountDataLocal.value = structuredClone(accountData);
};

const changeAvatar = (file) => {
  const fileReader = new FileReader();
  const { files } = file.target;
  if (files && files.length) {
    fileReader.readAsDataURL(files[0]);
    fileReader.onload = () => {
      if (typeof fileReader.result === "string")
        accountDataLocal.value.avatarImg = fileReader.result;
    };
    const params = new FormData();
    params.append("file", files[0]);

    Axios.post(urlUploadImageAvatar(getUserID()), params).then((res) => {
      console.log(res);
      if (res.data.RespCode == 0) {
        notify({
          type: "success",
          title: "Thành công",
          text: "Lưu thông tin chăm sóc thành công",
        });
        accountDataLocal.value.avatarImg =
          "http://202.191.56.172/LabManagerAPI/File/GetImageAvatar?UserID=" +
          getUserID() +
          "&FileName=" +
          res.data.FileName;
        setAvatar(accountDataLocal.value.avatarImg);
      } else {
        notify({
          title: "Lỗi",
          text: res.data.RespText,
          type: "error",
        });
      }
    });
  }
};

const getUserInfo = () => {
  GetUserInfo({}).then((res) => {
    accountDataLocal.value = {
      ...res.Data,
      Birthday: res.Data.Birthday == "" ? null : res.Data.Birthday,
      avatarImg: res.Data.Avatar
        ? "http://202.191.56.172/LabManagerAPI/File/GetImageAvatar?UserID=" +
          res.Data.UserID +
          "&FileName=" +
          res.Data.Avatar
        : null,
    };
  });
};

// reset avatar image
const resetAvatar = () => {
  accountDataLocal.value.avatarImg = accountData.avatarImg;
};

const updateUserInfo = () => {
  UpdateUserInfo({
    Data: {
      ...accountDataLocal.value,
      Birthday: formatDateUpload(accountDataLocal.value.Birthday) + " 00:00:00",
    },
  }).then((res) => {
    if (res.RespCode == 0) {
      notify({
        type: "success",
        title: "Thành công",
        text: "Cập nhật thông tin thành công",
      });
      getUserInfo();
    }
  });
};
getUserInfo();
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Thông Tin Tài Khoản">
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar
            v-if="accountDataLocal.Avatar"
            rounded="lg"
            size="100"
            class="me-6"
            :image="accountDataLocal.avatarImg"
          />
          <div v-else>
            <div
              class="default-avatar text-h3 font-weight-medium"
              v-if="accountDataLocal.FullName"
            >
              {{ accountDataLocal.FullName[0] }}
            </div>
          </div>

          <!-- 👉 Upload Photo -->
          <form class="d-flex flex-column justify-center gap-5">
            <div class="d-flex flex-wrap gap-2">
              <VBtn color="primary" @click="refInputEl?.click()">
                <VIcon icon="bx-cloud-upload" class="d-sm-none" />
                <span class="d-none d-sm-block">Tải ảnh mới</span>
              </VBtn>

              <input
                ref="refInputEl"
                type="file"
                name="file"
                accept=".jpeg,.png,.jpg,GIF"
                hidden
                @input="changeAvatar"
              />

              <!-- <VBtn
                type="reset"
                color="error"
                variant="tonal"
                @click="resetAvatar"
              >
                <span class="d-none d-sm-block">Reset</span>
                <VIcon icon="bx-refresh" class="d-sm-none" />
              </VBtn> -->
            </div>

            <p class="text-body-1 mb-0">
              Được phép JPG hoặc PNG. Kích thước tối đa 1MB
            </p>
          </form>
        </VCardText>

        <VDivider />

        <VCardText>
          <!-- 👉 Form -->
          <VForm class="mt-6">
            <VRow>
              <!-- 👉 First Name -->
              <VCol md="6" cols="12">
                <VTextField
                  v-model="accountDataLocal.FullName"
                  placeholder="Nhập họ và tên"
                  label="Họ và tên"
                />
              </VCol>

              <!-- 👉 Last Name -->
              <VCol md="6" cols="12">
                <v-date-input
                  v-model="accountDataLocal.Birthday"
                  label="Ngày sinh"
                  density="compact"
                  prepend-icon=""
                  variant="outlined"
                  persistent-placeholder
                  hide-details
                  :border="true"
                  :center-affix="true"
                  :hide-actions="true"
                  lang="vi"
                  append-inner-icon="mdi-calendar"
                ></v-date-input>
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="accountDataLocal.Email"
                  label="Email"
                  placeholder="DTP@gmail.com"
                  type="email"
                />
              </VCol>

              <!-- 👉 Phone -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="accountDataLocal.Phone"
                  label="Số điện thoại"
                  placeholder="Nhập số điện thoại"
                />
              </VCol>

              <!-- 👉 Country -->
              <VCol cols="12" md="6">
                <VSelect
                  v-model="accountDataLocal.City"
                  label="Tỉnh/TP"
                  :items="['USA', 'Canada', 'UK', 'India', 'Australia']"
                  placeholder="Select Country"
                />
              </VCol>

              <!-- 👉 Language -->
              <VCol cols="12" md="6">
                <VSelect
                  v-model="accountDataLocal.District"
                  label="Quận/Huyện"
                  placeholder="Select Language"
                  :items="['English', 'Spanish', 'Arabic', 'Hindi', 'Urdu']"
                />
              </VCol>

              <!-- 👉 Timezone -->
              <VCol cols="12" md="6">
                <VSelect
                  v-model="accountDataLocal.Commune"
                  label="Xã/Phường"
                  placeholder="Select Timezone"
                  :items="timezones"
                  :menu-props="{ maxHeight: 200 }"
                />
              </VCol>

              <!-- 👉 Address -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="accountDataLocal.Address"
                  label="Địa chỉ"
                  placeholder="Tên đường, số nhà..."
                />
              </VCol>

              <!-- 👉 Form Actions -->
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn @click="updateUserInfo">Lưu thay đổi</VBtn>

                <!-- <VBtn
                  color="secondary"
                  variant="tonal"
                  type="reset"
                  @click.prevent="resetForm"
                >
                  Reset
                </VBtn> -->
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>

    <!-- <VCol cols="12">
      <VCard title="Deactivate Account">
        <VCardText>
          <div>
            <VCheckbox
              v-model="isAccountDeactivated"
              label="I confirm my account deactivation"
            />
          </div>

          <VBtn :disabled="!isAccountDeactivated" color="error" class="mt-3">
            Deactivate Account
          </VBtn>
        </VCardText>
      </VCard>
    </VCol> -->
  </VRow>
</template>
<style lang="scss" scoped>
.default-avatar {
  background: #e6e6e6;
  width: 100px;
  height: 100px;
  margin-right: 24px;
  border-radius: 12px;
  color: rgb(var(--v-theme-primary));
  text-align: center;
  line-height: 100px;
}
</style>
