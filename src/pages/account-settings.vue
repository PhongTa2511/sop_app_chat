<script setup>
import AccountSettingsAccount from "@/views/account-settings/AccountSettingsAccount.vue";
import AccountSettingsRole from "@/views/account-settings/AccountSettingsRole.vue";
import AccountSettingsList from "@/views/account-settings/index.vue";
import { ref } from "vue";

const activeTab = ref("");
const permission = JSON.parse(localStorage.getItem("PermissionsKSVR"));
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
    title: "Phân quyền",
    icon: "bx-grid-alt",
    tab: "phan-quyen",
  },
];

const availableTabs = ref([]); // <- Reactive tab list

availableTabs.value = tabs.filter((tab) => {
  const matched = permission.find((p) => p.FeatureKey === tab.tab);
  return matched && matched.CanAccess === 1;
});

// Nếu tab hiện tại không hợp lệ => chuyển về tab đầu tiên
if (!availableTabs.value.find((t) => t.tab === activeTab.value)) {
  activeTab.value = availableTabs.value[0]?.tab ?? "";
}
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

    <VWindow v-model="activeTab" class="mt-2 disable-tab-transition">
      <VWindowItem value="list">
        <AccountSettingsList />
      </VWindowItem>
      <VWindowItem value="account">
        <AccountSettingsAccount />
      </VWindowItem>
      <VWindowItem
        value="phan-quyen"
        v-if="availableTabs.some((t) => t.tab === 'phan-quyen')"
      >
        <AccountSettingsRole />
      </VWindowItem>
    </VWindow>
  </div>
</template>
