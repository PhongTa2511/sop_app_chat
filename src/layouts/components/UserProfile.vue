<script>
import {
  getAvatar,
  getFullName,
  removeEmail,
  removeFullName,
  removePhoneNumber,
  removeToken,
  removeUserID,
} from "@/utils/auth";
import avatar1 from "@images/avatars/avatar-1.png";
export default {
  data() {
    return {
      avatar1: avatar1,
      fullName: getFullName(),
      avatar: getAvatar(),
    };
  },
  methods: {
    btLogout() {
      removeToken();
      removeFullName();
      removePhoneNumber();
      removeUserID();
      removeEmail();
      location.reload();
    },
  },
};
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
    bordered
  >
    <VAvatar class="cursor-pointer" color="blue" variant="text">
      <VImg :src="avatar" v-if="avatar" />
      <div v-else>
        <div v-if="fullName">{{ fullName[0] }}</div>
        <div v-else>R</div>
      </div>
      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar variant="text">
                    <VImg :src="avatar" v-if="avatar" />
                    <div v-else>
                      <div v-if="fullName">{{ fullName[0] }}</div>
                      <div v-else>R</div>
                    </div>
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ fullName }}
            </VListItemTitle>
            <VListItemSubtitle
              >{{ position }} - {{ specialize }}</VListItemSubtitle
            >
          </VListItem>
          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem to="/tai-khoan">
            <template #prepend>
              <VIcon class="me-2" icon="mdi-account-cog" size="22" />
            </template>

            <VListItemTitle>Tài khoản</VListItemTitle>
          </VListItem>

          <!-- 👉 Settings -->
          <VListItem to="/cai-dat">
            <template #prepend>
              <VIcon class="me-2" icon="bx-cog" size="22" />
            </template>

            <VListItemTitle>Cài đặt</VListItemTitle>
          </VListItem>

          <!-- 👉 FAQ -->
          <VListItem link>
            <template #prepend>
              <VIcon class="me-2" icon="mdi-face-agent" size="22" />
            </template>

            <VListItemTitle>Hỗ trợ</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem @click="btLogout">
            <template #prepend>
              <VIcon class="me-2" icon="bx-log-out" size="22" />
            </template>

            <VListItemTitle>Đăng xuất</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>

<style lang="scss" scoped></style>
