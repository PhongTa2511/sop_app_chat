<script setup>
// import ManagerSystem from "@/views/manager-system/branch.vue";
import RecurringJob from "@/views/recurring/index.vue";

import { ref } from "vue";

const activeTab = ref("");
const permission = JSON.parse(localStorage.getItem("PermissionsDTP"));

// tabs
const tabs = [
  {
    title: "Lịch định kỳ",
    icon: "mdi-text-box",
    tab: "lich-dinh-ky",
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
      <VTab v-for="item in availableTabs" :key="item.icon" :value="item.tab">
        <VIcon size="20" start :icon="item.icon" />
        {{ item.title }}
      </VTab>
    </VTabs>
    <VDivider />

    <VWindow v-model="activeTab" class="mt-2 disable-tab-transition">
      <VWindowItem
        v-if="availableTabs.some((t) => t.tab === 'lich-dinh-ky')"
        value="lich-dinh-ky"
      >
        <RecurringJob />
      </VWindowItem>
    </VWindow>
  </div>
</template>
