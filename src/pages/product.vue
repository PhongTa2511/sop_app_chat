<script setup>
// import ManagerSystem from "@/views/manager-system/branch.vue";
import Product from "@/views/product/index.vue";
import Product2 from "@/views/product/index2.vue";
import Product3 from "@/views/product/index3.vue";
import ProductVietNam from "@/views/product/indexvietnam.vue";

import { ref } from "vue";

const activeTab = ref("");
const permission = JSON.parse(localStorage.getItem("PermissionsDTP"));

// tabs
const tabs = [
  {
    title: "Sản phẩm XK",
    icon: "mdi-text-box",
    tab: "tat-ca-san-pham",
  },
  {
    title: "Sản phẩm trong nước",
    icon: "mdi-earth",
    tab: "san-pham-trong-nuoc",
  },
  {
    title: "Nộp cục",
    icon: "mdi-image",
    tab: "nop-cuc",
  },
  {
    title: "Có số",
    icon: "mdi-table-arrow-right",
    tab: "co-so",
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
        value="tat-ca-san-pham"
        v-if="availableTabs.some((t) => t.tab === 'tat-ca-san-pham')"
      >
        <Product />
      </VWindowItem>
      <VWindowItem
        value="san-pham-trong-nuoc"
        v-if="availableTabs.some((t) => t.tab === 'san-pham-trong-nuoc')"
      >
        <ProductVietNam />
      </VWindowItem>
      <VWindowItem
        value="nop-cuc"
        v-if="availableTabs.some((t) => t.tab === 'nop-cuc')"
      >
        <Product2 />
      </VWindowItem>
      <VWindowItem
        value="co-so"
        v-if="availableTabs.some((t) => t.tab === 'co-so')"
      >
        <Product3 />
      </VWindowItem>
    </VWindow>
  </div>
</template>
