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
</script>

<template>
  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <IconBtn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="bx-menu" />
        </IconBtn>

        <!-- 👉 Search  style="user-select: none"-->
        <div class="d-flex align-center cursor-pointer">
          <IconBtn>
            <VIcon icon="bx-search" />
          </IconBtn>
          Search
          <!-- <span class="d-none d-md-flex align-center text-disabled">
            <span class="me-3">Search</span>
            <span class="meta-key">&#8984;K</span>
          </span> -->
        </div>

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

      <!-- <VerticalNavLink
        :item="{
          title: 'Trao đổi',
          icon: 'mdi-message-text',
          to: '/nhan-tin',
        }"
      /> -->
      <VerticalNavSectionTitle
        :item="{
          heading: 'Cài đặt chung',
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
