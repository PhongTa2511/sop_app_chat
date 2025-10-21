<script setup>
import VerticalNavLayout from "@layouts/components/VerticalNavLayout.vue";
import VerticalNavLink from "@layouts/components/VerticalNavLink.vue";

// Components
import Footer from "@/layouts/components/Footer.vue";
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
import UserProfile from "@/layouts/components/UserProfile.vue";
import { getToken } from "@/utils/auth";

// Permission reactive và trạng thái load
const permission = ref([]);
const isReady = ref(false); // sẽ true sau khi load permission xong

const hasAccess = (featureKey) =>
  permission.value.find((p) => p.FeatureKey == featureKey && p.CanAccess == 1);

// Đóng mở menu sidebar ở desktop
const isNavCollapsed = ref(false);
const toggleNavCollapse = () => {
  isNavCollapsed.value = !isNavCollapsed.value;
};

const loadInitialData = async () => {
  if (!getToken()) return;
  permission.value = JSON.parse(localStorage.getItem("PermissionsDTP"));

  isReady.value = true;
};

onMounted(() => {
  loadInitialData();
});
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
        v-if="hasAccess('trang-chu')"
        :item="{
          title: 'Trang chủ',
          icon: 'bx-home',
          to: '/trang-chu',
        }"
      />
      <VerticalNavLink
        v-if="hasAccess('danh-sach-cong-viec')"
        :item="{
          title: 'Công việc',
          icon: 'mdi-briefcase-account',
          to: '/danh-sach-cong-viec',
        }"
      />
      <VerticalNavLink
        v-if="hasAccess('ho-so')"
        :item="{
          title: 'Hồ sơ',
          icon: 'mdi-list-box',
          to: '/ho-so',
        }"
      />
      <VerticalNavLink
        v-if="hasAccess('san-pham')"
        :item="{
          title: 'Sản phẩm',
          icon: 'mdi-pill',
          to: '/san-pham',
        }"
      />

      <VerticalNavLink
        v-if="hasAccess('tin-nhan')"
        :item="{
          title: 'Tin nhắn',
          icon: 'mdi-message-text',
          to: '/tin-nhan',
          badge: 3,
        }"
      />
      <VerticalNavLink
        v-if="hasAccess('cam-co')"
        :item="{
          title: 'Cắm cờ',
          icon: 'mdi-flag-variant',
          to: '/cam-co',
        }"
      />
      <VerticalNavLink
        v-if="hasAccess('phat-sinh')"
        :item="{
          title: 'Phát sinh',
          icon: 'mdi-sitemap-outline',
          to: '/phat-sinh',
        }"
      />
      <VerticalNavLink
        v-if="hasAccess('quoc-gia')"
        :item="{
          title: 'Quốc gia',
          icon: 'mdi-earth',
          to: '/quoc-gia',
        }"
      />
      <VerticalNavLink
        v-if="hasAccess('danh-sach-khieu-nai')"
        :item="{
          title: 'Khiếu nại',
          icon: 'mdi-account-file-text',
          to: '/danh-sach-khieu-nai',
        }"
      />

      <VerticalNavLink
        v-if="hasAccess('tai-khoan')"
        :item="{
          title: 'Tài khoản',
          icon: 'mdi-account-cog',
          to: '/tai-khoan',
        }"
      />

      <VerticalNavLink
        v-if="hasAccess('cai-dat')"
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
