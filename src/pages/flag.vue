<script setup>
import Confirm from "@/views/flag/confirm.vue";
import List from "@/views/flag/index.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const activeTab = ref(route.params.tab);

// tabs
const tabs = [
  {
    title: "Danh sách",
    icon: "mdi-list-box",
    tab: "danh-sach",
  },
  {
    title: "Duyệt cờ xanh",
    icon: "mdi-flag",
    tab: "co-xanh",
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
      <VWindowItem value="danh-sach">
        <List />
      </VWindowItem>
      <VWindowItem value="co-xanh">
        <Confirm />
      </VWindowItem>
    </VWindow>
  </div>
</template>
