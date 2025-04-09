<script setup>
import { useRoute } from "vue-router";
// import ManagerSystem from "@/views/pages/manager-system/branch.vue";
import Document from "@/views/pages/document/index.vue";
import Document2 from "@/views/pages/document/indexQT00003.vue";
// import Device from "@/views/pages/manager-system/device.vue";
const route = useRoute();
const activeTab = ref(route.params.tab);

// tabs
const tabs = [
  // {
  //   title: "Tổ chức",
  //   icon: "mdi-lan",
  //   tab: "to-chuc",
  // },
  {
    title: "Danh sách hồ sơ",
    icon: "mdi-text-box",
    tab: "ho-so",
  },
  {
    title: "QT00003 - Tổng hợp",
    icon: "mdi-file-certificate",
    tab: "qt00003",
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
      <!-- Tổ chức -->
      <!-- <VWindowItem value="to-chuc">
        <ManagerSystem />
      </VWindowItem> -->
      <VWindowItem value="ho-so">
        <Document />
      </VWindowItem>
      <VWindowItem value="qt00003">
        <Document2 />
      </VWindowItem>
    </VWindow>
  </div>
</template>
