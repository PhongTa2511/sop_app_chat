<script setup>
import Group from "@/views/default/group.vue"
import Variable from "@/views/default/index.vue"
import FormLst from "@/views/procedure/formlst.vue"
import Procedure from "@/views/procedure/index.vue"
import { ref } from "vue"

const activeTab = ref("")
const permission = JSON.parse(localStorage.getItem("PermissionsDTP"))

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
    tab: "danh-sach-nhom",
  },
  {
    title: "Giá trị khởi tạo",
    icon: "mdi-variable-box",
    tab: "gia-tri-khoi-tao",
  },
  {
    title: "Danh sách form",
    icon: "mdi-form-select",
    tab: "danh-sach-form",
  },
]

const availableTabs = ref([]) // <- Reactive tab list

availableTabs.value = tabs.filter(tab => {
  const matched = permission.find(p => p.FeatureKey === tab.tab)
  
  return matched && matched.CanAccess === 1
})

// Nếu tab hiện tại không hợp lệ => chuyển về tab đầu tiên
if (!availableTabs.value.find(t => t.tab === activeTab.value)) {
  activeTab.value = availableTabs.value[0]?.tab ?? ""
}
</script>

<template>
  <div>
    <VTabs
      v-model="activeTab"
      show-arrows
    >
      <VTab
        v-for="item in availableTabs"
        :key="item.icon"
        :value="item.tab"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
    </VTabs>
    <VDivider />

    <VWindow
      v-model="activeTab"
      class="mt-2 disable-tab-transition"
    >
      <VWindowItem
        v-if="availableTabs.some((t) => t.tab === 'quy-trinh')"
        value="quy-trinh"
      >
        <Procedure />
      </VWindowItem>
      <VWindowItem
        v-if="availableTabs.some((t) => t.tab === 'danh-sach-nhom')"
        value="danh-sach-nhom"
      >
        <Group />
      </VWindowItem>
      <VWindowItem
        v-if="availableTabs.some((t) => t.tab === 'gia-tri-khoi-tao')"
        value="gia-tri-khoi-tao"
      >
        <Variable />
      </VWindowItem>
      <VWindowItem
        v-if="availableTabs.some((t) => t.tab === 'danh-sach-form')"
        value="danh-sach-form"
      >
        <FormLst />
      </VWindowItem>
    </VWindow>
  </div>
</template>
