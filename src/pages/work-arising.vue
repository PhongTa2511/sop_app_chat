<script setup>
import Document6 from "@/views/document2/index6.vue";

import { ref } from "vue";

const activeTab = ref("");
const docCongviec = "QT00024";
const permission = JSON.parse(localStorage.getItem("PermissionsDTP"));

// tabs
const tabs = [
  {
    title: "Công việc phát sinh",
    icon: "mdi-sitemap-outline",
    tab: "cong-viec-phat-sinh",
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
        value="cong-viec-phat-sinh"
        v-if="availableTabs.some((t) => t.tab === 'cong-viec-phat-sinh')"
      >
        <Document6 :docID="docCongviec" />
      </VWindowItem>
    </VWindow>
  </div>
</template>
