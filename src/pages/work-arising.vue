<script setup>
import { useRoute } from "vue-router";
// import ManagerSystem from "@/views/manager-system/branch.vue";

import Document6 from "@/views/document2/index6.vue";
// import Device from "@/views/manager-system/device.vue";
const route = useRoute();
const activeTab = ref(route.params.tab);
// const docHS = "QT00005,QT00007,QT00009,QT00010,QT00011";
// const docDesign = "QT00006,QT00012,QT00022";
// const docDesign2 = "QT00013,QT00023";
// const docMau = "QT00018";
// const docNhan = "QT00021";
// const docChatchuan = "QT00020";
const docCongviec = "QT00024";
// tabs
const tabs = [
  // {
  //   title: "Hồ sơ",
  //   icon: "mdi-text-box",
  //   tab: "ho-so",
  // },
  // {
  //   title: "Nhãn đăng ký",
  //   icon: "mdi-image",
  //   tab: "design",
  // },
  // {
  //   title: "Nhãn sản xuất",
  //   icon: "mdi-tooltip-image",
  //   tab: "design2",
  // },
  // {
  //   title: "Mẫu xuất khẩu",
  //   icon: "mdi-table-arrow-right",
  //   tab: "mau",
  // },
  // {
  //   title: "Nhãn trong nước",
  //   icon: "mdi-earth-arrow-left",
  //   tab: "nhan-trong-nuoc",
  // },
  // {
  //   title: "Order chất chuẩn",
  //   icon: "mdi-order-bool-ascending",
  //   tab: "chat-chuan",
  // },
  {
    title: "Công việc phát sinh",
    icon: "mdi-sitemap-outline",
    tab: "cong-viec",
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
        <Document6 :docID="docCongviec" />
      </VWindowItem>
    </VWindow>
  </div>
</template>
