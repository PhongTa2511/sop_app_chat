<script setup>
import { useRoute } from "vue-router";
import Procedure from "@/views/pages/procedure/index.vue";
import Variable from "@/views/pages/default/index.vue";
import Group from "@/views/pages/default/group.vue";

const route = useRoute();
const activeTab = ref(route.params.tab);

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
    tab: "nhom",
  },
  {
    title: "Giá trị khởi tạo",
    icon: "mdi-variable-box",
    tab: "bien-so",
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
      <VWindowItem value="quy-trinh">
        <Procedure />
      </VWindowItem>
      <VWindowItem value="nhom">
        <Group />
      </VWindowItem>
      <VWindowItem value="bien-so">
        <Variable />
      </VWindowItem>
    </VWindow>
  </div>
</template>
