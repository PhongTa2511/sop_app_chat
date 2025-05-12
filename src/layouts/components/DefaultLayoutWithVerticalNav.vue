<script setup>
import { useTheme } from "vuetify";
import VerticalNavSectionTitle from "@/@layouts/components/VerticalNavSectionTitle.vue";

import VerticalNavLayout from "@layouts/components/VerticalNavLayout.vue";
import VerticalNavLink from "@layouts/components/VerticalNavLink.vue";

// Components
import Footer from "@/layouts/components/Footer.vue";
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
import UserProfile from "@/layouts/components/UserProfile.vue";

const vuetifyTheme = useTheme();

// Đóng mở menu sidebar ở desktop
const isNavCollapsed = ref(false);
const toggleNavCollapse = () => {
  isNavCollapsed.value = !isNavCollapsed.value;
};
</script>

<template>
  <VerticalNavLayout :is-nav-collapsed="isNavCollapsed">
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center pl-3">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <IconBtn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="bx-menu" />
        </IconBtn>

        <IconBtn
          class="ms-n3 d-none d-lg-inline-flex"
          @click="toggleNavCollapse"
        >
          <VIcon icon="bx-menu" />
        </IconBtn>

        <VSpacer />

        <!-- <IconBtn class="me-2">
          <VIcon icon="bx-bell" />
        </IconBtn> -->

        <NavbarThemeSwitcher class="me-2" />

        <UserProfile />
      </div>
    </template>

    <template #vertical-nav-content>
      <VerticalNavLink
        :item="{
          title: 'Trang chủ',
          icon: 'bx-home',
          to: '/trang-chu',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Công việc',
          icon: 'mdi-briefcase-account',
          to: '/danh-sach-cong-viec',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Hồ sơ',
          icon: 'mdi-list-box',
          to: '/danh-sach-ho-so',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Khiếu nại - QA',
          icon: 'mdi-account-file-text',
          to: '/danh-sach-khieu-nai',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Trao đổi',
          icon: 'mdi-message-text',
          to: '/nhan-tin',
        }"
      />
      <VerticalNavSectionTitle
        :item="{
          heading: 'Cài đặt',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Tài khoản',
          icon: 'mdi-account-cog',
          to: '/tai-khoan',
        }"
      />

      <VerticalNavLink
        :item="{
          title: 'Cài đặt',
          icon: 'mdi-cog',
          to: '/cai-dat',
        }"
      />
    </template>

    <!-- <template #after-vertical-nav-items>
      <div>Anh Thành</div>
    </template> -->

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>
  </VerticalNavLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}
</style>
