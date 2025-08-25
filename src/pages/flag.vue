<script setup>
import Confirm from "@/views/flag/confirm.vue";
import List from "@/views/flag/index.vue";
import { ref } from "vue";

const activeTab = ref("");
const permission = JSON.parse(localStorage.getItem("PermissionsDTP"));

// tabs
const tabs = [
  {
    title: "Danh sách",
    icon: "mdi-list-box",
    tab: "danh-sach-cam-co",
  },
  {
    title: "Duyệt cờ xanh",
    icon: "mdi-flag",
    tab: "duyet-co-xanh",
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
        value="danh-sach-cam-co"
        v-if="availableTabs.some((t) => t.tab === 'danh-sach-cam-co')"
      >
        <List />
      </VWindowItem>
      <VWindowItem
        value="duyet-co-xanh"
        v-if="availableTabs.some((t) => t.tab === 'duyet-co-xanh')"
      >
        <Confirm />
      </VWindowItem>
    </VWindow>
  </div>
</template>
