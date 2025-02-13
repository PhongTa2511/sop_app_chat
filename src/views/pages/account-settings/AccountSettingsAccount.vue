<script setup>
import avatar1 from "@images/avatars/avatar-1.png";
import {
  GetUserInfo,
  UpdateUserInfo,
  urlUploadImageAvatar,
} from "@/api/user.js";
import { formatDateUpload } from "@/helpers/getTime";
import { getUserName, getUserID, setAvatar } from "@/utils/auth";
import { GetDefaultValue } from "@/api/default";
import Axios from "axios";
const accountData = {
  avatarImg: avatar1,
};

const refInputEl = ref();
const accountDataLocal = ref(structuredClone(accountData));
var specializeLst = ref([]);
var positionLst = ref([]);
const userName = getUserName();
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

    Axios.post(urlUploadImageAvatar(userName), params).then((res) => {
      if (res.data.RespCode == 0) {
        notify({
          type: "success",
          title: "Thành công",
          text: "Lưu thông tin chăm sóc thành công",
        });
        accountDataLocal.value.avatarImg =
          "https://sop.icpc1hn.work/api/File/GetAvatarUser?UserName=" +
          userName;
        setAvatar(accountDataLocal.value.avatarImg);
        location.reload();
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
  GetUserInfo({
    UserInfo: {
      UserName: getUserName(),
    },
  }).then((res) => {
    accountDataLocal.value = {
      ...res.UserInfo,
    };
    if (res.UserInfo.LinkImage) {
      accountDataLocal.value.avatarImg =
        "https://sop.icpc1hn.work/api/File/GetAvatarUser?UserName=" +
        res.UserInfo.UserName;
    }
  });
};

// reset avatar image
const resetAvatar = () => {
  accountDataLocal.value.avatarImg = accountData.avatarImg;
};

const getDefaultValue = () => {
  GetDefaultValue({
    Table: "Phòng ban",
  }).then((res) => {
    if (res.RespCode == 0) {
      specializeLst = res.DefaultValueLst;
    }
  });
  GetDefaultValue({
    Table: "Chức vụ",
  }).then((res) => {
    if (res.RespCode == 0) {
      positionLst = res.DefaultValueLst;
    }
  });
};

const updateUserInfo = () => {
  UpdateUserInfo({
    UserInfo: {
      ...accountDataLocal.value,
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
getDefaultValue();
</script>

<template>
  <VCard title="Thông Tin Tài Khoản">
    <VDivider />

    <VCardText>
      <VForm class="">
        <VRow>
          <v-col md="4">
            <div>ẢNH ĐẠI DIỆN</div>
            <VCardText class="d-flex">
              <VAvatar
                v-if="accountDataLocal.LinkImage"
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
              <form class="d-flex flex-column justify-center gap-5">
                <div class="d-flex flex-wrap gap-2">
                  <VBtn color="primary" @click="refInputEl?.click()">
                    <VIcon icon="bx-cloud-upload" class="" />
                    <span>Tải ảnh mới</span>
                  </VBtn>

                  <input
                    ref="refInputEl"
                    type="file"
                    name="file"
                    accept=".jpeg,.png,.jpg,GIF"
                    hidden
                    @input="changeAvatar"
                  />
                </div>

                <p class="text-body-1 mb-0">
                  Được phép JPG hoặc PNG. Kích thước tối đa 1MB
                </p>
              </form>
            </VCardText>
          </v-col>
          <!-- 👉 First Name -->
          <VCol md="4" cols="12">
            <div class="mb-2">THÔNG TIN CƠ BẢN</div>
            <VTextField
              v-model="accountDataLocal.EmployeeCode"
              label="Mã nhân viên"
              placeholder="Nhập mã nhân viên"
              class="mb-2"
            />
            <VTextField
              v-model="accountDataLocal.FullName"
              placeholder="Nhập họ và tên"
              label="Họ và tên"
              class="mb-2"
            />
            <VTextField
              v-model="accountDataLocal.Email"
              label="Email"
              placeholder="DTP@gmail.com"
              type="email"
              class="mb-2"
            />
            <VTextField
              v-model="accountDataLocal.PhoneNumber"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
            />
          </VCol>

          <!-- 👉 Last Name -->
          <VCol md="4" cols="12">
            <div class="mb-2">NHÓM - CHỨC VỤ</div>
            <v-chip
              class="mb-2"
              color="blue"
              size="x-large"
              v-for="(item, index) in accountDataLocal.Data"
              :key="index"
              ><v-icon color="green"> mdi-account-multiple </v-icon>
              {{ item.TeamName }}
              <v-icon color="green" class="ml-4"> mdi-tag-text </v-icon>
              {{ item.Role }}
            </v-chip>
          </VCol>
          <VDivider />
          <!-- 👉 Form Actions -->
          <VCol cols="12" class="d-flex flex-wrap gap-4">
            <VBtn color="green" @click="updateUserInfo">Lưu thay đổi</VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
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
