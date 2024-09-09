<script setup>
import { useRoute } from "vue-router";
import Schedule from "@/views/pages/calendar/schedule.vue";
import DetailCalendar from "@/views/pages/calendar/detail-calendar.vue";
import RegisterSchedule from "@/views/pages/calendar/register-schedule.vue";
const route = useRoute();
const activeTab = ref(route.params.tab);

// tabs
const tabs = [
  {
    title: "Phân công",
    icon: "mdi-calendar-plus",
    tab: "dang-ky-lich",
  },
  {
    title: "Tổng quan",
    icon: "mdi-calendar-month",
    tab: "xep-lich",
  },
  {
    title: "Thống kê",
    icon: "mdi-card-account-details",
    tab: "chi-tiet",
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
      <VWindowItem value="dang-ky-lich">
        <RegisterSchedule />
      </VWindowItem>
      <VWindowItem value="xep-lich">
        <Schedule />
      </VWindowItem>
      <VWindowItem value="chi-tiet">
        <DetailCalendar />
      </VWindowItem>
    </VWindow>
  </div>
</template>
