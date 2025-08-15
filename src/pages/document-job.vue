<script setup>
import { useRoute } from "vue-router";
// import ManagerSystem from "@/views/manager-system/branch.vue";
import Document from "@/views/document-job/index.vue";
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
    title: "Danh sách công việc",
    icon: "mdi-briefcase-account",
    tab: "cong-viec",
  },
  // {
  //   title: "Máy chấm công",
  //   icon: "mdi-deskphone",
  //   tab: "thiet-bi",
  // },
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

    <VWindow v-model="activeTab" class="mt-2 disable-tab-transition">
      <!-- Tổ chức -->
      <!-- <VWindowItem value="to-chuc">
        <ManagerSystem />
      </VWindowItem> -->
      <VWindowItem value="cong-viec">
        <Document />
      </VWindowItem>
      <!-- <VWindowItem value="thiet-bi">
        <Device />
      </VWindowItem> -->
    </VWindow>
  </div>
</template>
