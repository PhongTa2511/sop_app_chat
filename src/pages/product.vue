<script setup>
import { useRoute } from "vue-router";
// import ManagerSystem from "@/views/manager-system/branch.vue";
import Product from "@/views/product/index.vue";
import Product2 from "@/views/product/index2.vue";
import Product3 from "@/views/product/index3.vue";

// import Device from "@/views/manager-system/device.vue";
const route = useRoute();
const activeTab = ref(route.params.tab);
const docHS = "QT00005,QT00007,QT00009,QT00010,QT00011";
const docDesign = "QT00006,QT00012,QT00013,QT00022,QT00023";
const docMau = "QT00018";
const docNhan = "QT00021";
const docChatchuan = "QT00020";
const docCongviec = "QT00024";
// tabs
const tabs = [
  {
    title: "Sản phẩm",
    icon: "mdi-text-box",
    tab: "ho-so",
  },
  {
    title: "Nộp cục",
    icon: "mdi-image",
    tab: "design",
  },
  {
    title: "Có số",
    icon: "mdi-table-arrow-right",
    tab: "mau",
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
      <VWindowItem value="ho-so">
        <Product />
      </VWindowItem>
      <VWindowItem value="design">
        <Product2 />
      </VWindowItem>
      <VWindowItem value="mau">
        <Product3 />
      </VWindowItem>
    </VWindow>
  </div>
</template>
