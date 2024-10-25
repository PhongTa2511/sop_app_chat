<script setup>
import { useRoute } from "vue-router";
import AccountSettingsAccount from "@/views/pages/account-settings/AccountSettingsAccount.vue";
import AccountSettingsSecurity from "@/views/pages/account-settings/AccountSettingsSecurity.vue";
import AccountSettingsList from "@/views/pages/account-settings/index.vue";
const route = useRoute();
const activeTab = ref(route.params.tab);

// tabs
const tabs = [
  {
    title: "Danh sách",
    icon: "fa-users",
    tab: "list",
  },
  {
    title: "Cá nhân",
    icon: "bx-user",
    tab: "account",
  },
  {
    title: "Mật khẩu",
    icon: "bx-lock-open",
    tab: "security",
  },
];
</script>

<template>
  <div>
    <VTabs v-model="activeTab" show-arrows>
      <VTab v-for="item in tabs" :key="item.icon" :value="item.tab">
        <VIcon size="20" start :icon="item.icon" />
        {{ item.title }}
      </VTab>
    </VTabs>
    <VDivider />

    <VWindow v-model="activeTab" class="mt-5 disable-tab-transition">
      <VWindowItem value="list">
        <AccountSettingsList />
      </VWindowItem>
      <VWindowItem value="account">
        <AccountSettingsAccount />
      </VWindowItem>
      <VWindowItem value="security">
        <AccountSettingsSecurity />
      </VWindowItem>
    </VWindow>
  </div>
</template>
