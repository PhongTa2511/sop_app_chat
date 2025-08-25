<script setup>
// import ManagerSystem from "@/views/manager-system/branch.vue";
import JobArising from "@/views/document-job/index-arising.vue";
import DocumentJobRD from "@/views/document-job/index-rd.vue";
import DocumentJob from "@/views/document-job/index.vue";
import { ref } from "vue";
var activeTab = ref("");
const permission = JSON.parse(localStorage.getItem("PermissionsDTP"));

// tabs
const tabs = [
  {
    title: "Danh sách công việc",
    icon: "mdi-briefcase-account",
    tab: "cong-viec",
  },
  {
    title: "Danh sách công việc",
    icon: "mdi-briefcase-account",
    tab: "cong-viec-rd",
  },
  {
    title: "Công việc phát sinh",
    icon: "mdi-lan",
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
        value="cong-viec"
        v-if="availableTabs.some((t) => t.tab === 'cong-viec')"
      >
        <DocumentJob />
      </VWindowItem>
      <VWindowItem
        value="cong-viec-rd"
        v-if="availableTabs.some((t) => t.tab === 'cong-viec-rd')"
      >
        <DocumentJobRD />
      </VWindowItem>
      <VWindowItem
        value="cong-viec-phat-sinh"
        v-if="availableTabs.some((t) => t.tab === 'cong-viec-phat-sinh')"
      >
        <JobArising />
      </VWindowItem>
    </VWindow>
  </div>
</template>
