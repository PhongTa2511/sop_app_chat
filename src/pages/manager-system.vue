<script setup>
import { useRoute } from "vue-router";
import AccountSettingsAccount from "@/views/pages/account-settings/AccountSettingsAccount.vue";
import AccountSettingsNotification from "@/views/pages/account-settings/AccountSettingsNotification.vue";
import AccountSettingsSecurity from "@/views/pages/account-settings/AccountSettingsSecurity.vue";

const route = useRoute();
const activeTab = ref(route.params.tab);

// tabs
const tabs = [
  {
    title: "Tổ chức",
    icon: "bx-user",
    tab: "to-chuc",
  },
  //   {
  //     title: "Phân quyền",
  //     icon: "mdi-account-credit-card",
  //     tab: "security",
  //   },
  //   {
  //     title: "Tài khoản",
  //     icon: "",
  //     tab: "notification",
  //   },
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
      <!-- Tổ chức -->
      <VWindowItem value="to-chuc">
        <AccountSettingsAccount />
      </VWindowItem>
    </VWindow>
  </div>
</template>
