<script setup>
import { useRoute } from "vue-router";
// import ManagerSystem from "@/views/manager-system/branch.vue";
import JobArising from "@/views/document-job/index-arising.vue";
import DocumentJobRD from "@/views/document-job/index-rd.vue";
import DocumentJob from "@/views/document-job/index.vue";
const route = useRoute();
const activeTab = ref(route.params.tab);

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
      <VWindowItem value="cong-viec">
        <DocumentJob />
      </VWindowItem>
      <VWindowItem value="cong-viec-rd">
        <DocumentJobRD />
      </VWindowItem>
      <VWindowItem value="cong-viec-phat-sinh">
        <JobArising />
      </VWindowItem>
    </VWindow>
  </div>
</template>
