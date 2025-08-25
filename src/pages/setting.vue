<script setup>
import Group from "@/views/default/group.vue";
import Variable from "@/views/default/index.vue";
import Procedure from "@/views/procedure/index.vue";

import { ref } from "vue";

const activeTab = ref("");
const permission = JSON.parse(localStorage.getItem("PermissionsDTP"));

// tabs
const tabs = [
  {
    title: "Quy trình",
    icon: "mdi-briefcase",
    tab: "quy-trinh",
  },
  {
    title: "Nhóm",
    icon: "mdi-account-group",
    tab: "danh-sach-nhom",
  },
  {
    title: "Giá trị khởi tạo",
    icon: "mdi-variable-box",
    tab: "gia-tri-khoi-tao",
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
        value="quy-trinh"
        v-if="availableTabs.some((t) => t.tab === 'quy-trinh')"
      >
        <Procedure />
      </VWindowItem>
      <VWindowItem
        value="danh-sach-nhom"
        v-if="availableTabs.some((t) => t.tab === 'danh-sach-nhom')"
      >
        <Group />
      </VWindowItem>
      <VWindowItem
        value="gia-tri-khoi-tao"
        v-if="availableTabs.some((t) => t.tab === 'gia-tri-khoi-tao')"
      >
        <Variable />
      </VWindowItem>
    </VWindow>
  </div>
</template>
