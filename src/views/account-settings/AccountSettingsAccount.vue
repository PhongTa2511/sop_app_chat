<script setup>
import { GetDefaultValue } from "@/api/default"
import { GetTeamLstUserID } from "@/api/teamApi"
import {
  GetUserInfo,
  GetUserLstByTeamID,
  UpdateUserInfo,
  urlUploadImageAvatar,
} from "@/api/user.js"
import { getUserName, setAvatar } from "@/utils/auth"
import avatar1 from "@images/avatars/avatar-1.png"
import Axios from "axios"
import { nextTick } from "vue"

const accountData = {
  avatarImg: avatar1,
}

const teamList = ref([])
const memberList = ref([])
const selectedTeam = ref(null)
const teamScrollRef = ref(null)
const refInputEl = ref()
const selectedUser = ref(null)
const accountDataLocal = ref(structuredClone(accountData))
var specializeLst = ref([])
var positionLst = ref([])
const userName = getUserName()

const resetForm = () => {
  accountDataLocal.value = structuredClone(accountData)
}

const changeAvatar = file => {
  const fileReader = new FileReader()
  const { files } = file.target
  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === "string")
        accountDataLocal.value.avatarImg = fileReader.result
    }

    const params = new FormData()

    params.append("file", files[0])

    Axios.post(urlUploadImageAvatar(userName), params).then(res => {
      if (res.data.RespCode == 0) {
        notify({
          type: "success",
          title: "Thành công",
          text: "Lưu thông tin chăm sóc thành công",
        })
        accountDataLocal.value.avatarImg =
          "https://sop.idtp.work/api/File/GetAvatarUser?UserName=" + userName
        setAvatar(accountDataLocal.value.avatarImg)
        location.reload()
      } else {
        notify({
          title: "Lỗi",
          text: res.data.RespText,
          type: "error",
        })
      }
    })
  }
}

const getUserInfo = () => {
  GetUserInfo({
    UserInfo: {
      UserName: getUserName(),
    },
  }).then(res => {
    accountDataLocal.value = {
      ...res.UserInfo,
    }
    if (res.UserInfo.LinkImage) {
      accountDataLocal.value.avatarImg =
        res.UserInfo.LinkImage
          ?"data:image/jpeg;base64," + res.UserInfo.LinkImage
          :"https://sop.idtp.work/api/File/GetAvatarUser?UserName=" +
        res.UserInfo.UserName
    }
  })
}

// reset avatar image
const resetAvatar = () => {
  accountDataLocal.value.avatarImg = accountData.avatarImg
}

const getDefaultValue = () => {
  GetDefaultValue({
    Table: "Phòng ban",
  }).then(res => {
    if (res.RespCode == 0) {
      specializeLst = res.DefaultValueLst
    }
  })
  GetDefaultValue({
    Table: "Chức vụ",
  }).then(res => {
    if (res.RespCode == 0) {
      positionLst = res.DefaultValueLst
    }
  })
}

const updateUserInfo = () => {
  UpdateUserInfo({
    UserInfo: {
      ...accountDataLocal.value,
    },
  }).then(res => {
    if (res.RespCode == 0) {
      notify({
        type: "success",
        title: "Thành công",
        text: "Cập nhật thông tin thành công",
      })
      getUserInfo()
    }
  })
}

const getTeamList = () => {
  GetTeamLstUserID({
    UserName: userName,
    Token: "",
  }).then(res => {
    if(res.RespCode === 0) {
      teamList.value = res.Data
      if (teamList.value.length > 0) {
        getUserByTeam(teamList.value[0], 0)
      }
    }
  })
}

const getUserByTeam = (team, index) => {
  selectedTeam.value = team

  GetUserLstByTeamID({
    UserName: userName,
    Token: "",
    Search: "",
    PageNumber: 1,
    RowspPage: 50,
    TeamID: team.TeamID,
  }).then(res => {
    if (res.RespCode === 0) {
      memberList.value = res.Data
    }
  })

  //scroll
  
  //scroll
  nextTick(() => {
    const container = teamScrollRef.value
    const btn = container.children[index]

    if (!btn) return

    btn.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    })
  })
}

getTeamList()
getUserInfo()
getDefaultValue()
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <div class="card-header">
          Thông Tin Tài Khoản
        </div>
        <VDivider />

        <VCardText>
          <VForm class="">
            <VRow>
              <VCol md="4">
                <div class="mb-4">
                  ẢNH ĐẠI DIỆN
                </div>

                <div class="avatar-wrapper">
                  <!-- Avatar -->
                  <VAvatar
                    v-if="accountDataLocal.LinkImage"
                    size="120"
                    rounded="lg"
                    :image="accountDataLocal.LinkImage"
                  />

                  <div
                    v-else
                    v-if="accountDataLocal.FullName"
                    class="default-avatar text-h4 font-weight-medium"
                  >
                    {{ accountDataLocal.FullName[0] }}
                  </div>

                  <!-- Upload button -->
                  <VBtn
                    class="mt-4"
                    color="primary"
                    prepend-icon="mdi-cloud-upload"
                    @click="refInputEl?.click()"
                  >
                    TẢI ẢNH MỚI
                  </VBtn>

                  <input
                    ref="refInputEl"
                    type="file"
                    accept=".jpeg,.png,.jpg"
                    hidden
                    @input="changeAvatar"
                  >

                  <p class="text-caption mt-2 text-medium-emphasis text-center">
                    Được phép JPG hoặc PNG. Kích thước tối đa 1MB
                  </p>
                </div>
              </VCol>
              <!-- 👉 First Name -->
              <VCol
                md="4"
                cols="12"
              >
                <div class="mb-2">
                  THÔNG TIN CƠ BẢN
                </div>
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
              <VCol
                md="4"
                cols="12"
              >
                <div class="mb-2">
                  NHÓM - CHỨC VỤ
                </div>

                <div class="team-role-scroll">
                  <VChip
                    v-for="(item, index) in accountDataLocal.Data"
                    :key="index"
                    class="mb-2"
                    color="blue"
                    size="large"
                  >
                    <VIcon
                      color="green"
                      start
                    >
                      mdi-account-multiple
                    </VIcon>
                    {{ item.TeamName }}

                    <VIcon
                      color="green"
                      class="ml-2"
                    >
                      mdi-tag-text
                    </VIcon>
                    {{ item.Role }}
                  </VChip>
                </div>
              </VCol>
              <VDivider />
              <!-- 👉 Form Actions -->
              <VCol
                cols="12"
                class="d-flex flex-wrap gap-4"
              >
                <VBtn
                  color="#00D084"
                  @click="updateUserInfo"
                >
                  Lưu thay đổi
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard>
        <div class="card-header">
          Danh sách nhóm ({{ teamList.length }})
        </div>
        <VDivider />
        <VCardText>
          <div
            ref="teamScrollRef"
            class="team-scroll"
          >
            <VBtn
              v-for="(team, index) in teamList"
              :key="team.TeamID"
              class="me-2"
              :color="selectedTeam?.TeamID === team.TeamID ? 'primary' : 'grey-lighten-3'"
              :variant="selectedTeam?.TeamID === team.TeamID ? 'flat' : 'tonal'"
              @click="getUserByTeam(team, index)"
            >
              <VIcon start>
                mdi-account-group
              </VIcon>
              {{ team.TeamName }}
            </VBtn>
          </div>

          <div v-if="memberList.length">
            <div class="mb-2">
              Thành viên nhóm:
              <b>{{ selectedTeam?.TeamName }}</b>
            </div>

            <div class="member-grid">
              <div
                v-for="user in memberList"
                :key="user.UserName"
                class="member-card"
              >
                <div class="member-top">
                  <VAvatar
                    size="50"
                    color="primary"
                    class="avatar-border"
                  >
                    <VImg
                      v-if="user.LinkImage"
                      :src="user.LinkImage.startsWith('/9j') 
                        ? 'data:image/jpeg;base64,' + user.LinkImage
                        : user.LinkImage"
                      cover
                    />

                    <span v-else>
                      {{ user.FullName ? user.FullName[0].toUpperCase() : user.UserName[0].toUpperCase() }}
                    </span>
                  </VAvatar>

                  <div class="member-info">
                    <div class="member-name">
                      {{ user.FullName }}
                    </div>

                    <div class="member-email">
                      {{ user.Email }}
                    </div>
                  </div>
                </div>

                <div class="member-footer">
                  <span>{{ user.RoleName || 'Thành viên' }}</span>
                  <span size="18">{{ user.PhoneNumber }}</span>
                </div>
              </div>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>
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
.v-avatar span {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1976d2;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.team-role-scroll {
  max-height: 180px;   // chiều cao vùng scroll
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
}
.team-scroll {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  gap: 8px;
  padding-bottom: 4px;
  white-space: nowrap;
  scroll-behavior: smooth;
}

.team-scroll::-webkit-scrollbar {
  height: 6px;
}

.team-scroll::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 6px;
}
.card-header{
  font-size:16px;
  font-weight:600;
  padding:10px 16px;
}

// thành viên nhóm
.member-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}

.member-card {
  padding: 16px;
  border-radius: 14px;
  transition: all 0.25s ease;
  position: relative;
  
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  border: 2px solid #e6e6e6;  
}

.member-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  transform: scale(1.05);
  z-index: 2;
}

.member-footer {
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  opacity: 0;
  transform: translateY(5px);
  transition: all 0.25s ease;
}

.member-card:hover .member-footer {
  opacity: 1;
  transform: translateY(0);
}

.member-top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.member-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.member-name {
  font-weight: 600;
  font-size: 14px;
}

.member-email {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.member-card:hover .member-email {
  white-space: normal;
  overflow: visible;
}

// ảnh đại diện
.avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.default-avatar {
  width: 120px;
  height: 120px;
  border: 2px dashed #90caf9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--v-theme-primary));
  background: #f5f7fa;
}

.avatar-border {
  border: 2px solid #f5f7fa;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
</style>
