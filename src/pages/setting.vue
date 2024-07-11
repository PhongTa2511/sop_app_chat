<script setup>
import { useRoute } from "vue-router";
import Shift from "@/views/pages/setting/shift.vue";
import Variable from "@/views/pages/setting/variable.vue";

const route = useRoute();
const activeTab = ref(route.params.tab);

// tabs
const tabs = [
  {
    title: "Ca làm việc",
    icon: "mdi-briefcase",
    tab: "ca-lam-viec",
  },
  {
    title: "Biến số",
    icon: "mdi-variable-box",
    tab: "bien-so",
  },
  //   {
  //     title: "Thiết bị",
  //     icon: "mdi-deskphone",
  //     tab: "thiet-bi",
  //   },
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
      <VWindowItem value="ca-lam-viec">
        <Shift />
      </VWindowItem>
      <VWindowItem value="bien-so">
        <Variable />
      </VWindowItem>
      <!-- <VWindowItem value="thiet-bi">
        <Device />
      </VWindowItem> -->
    </VWindow>
  </div>
</template>
