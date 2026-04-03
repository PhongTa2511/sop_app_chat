<script setup>
// import ManagerSystem from "@/views/manager-system/branch.vue";
import DocumentAll from "@/views/document/index.vue"
import DocumentQT00003 from "@/views/document/indexQT00003.vue"
import Document from "@/views/document2/index.vue"
import Document22 from "@/views/document2/index2-2.vue"
import Document2 from "@/views/document2/index2.vue"
import Document3 from "@/views/document2/index3.vue"
import Document4 from "@/views/document2/index4.vue"
import Document5 from "@/views/document2/index5.vue"
import { ref } from "vue"

const activeTab = ref("")
const permission = JSON.parse(localStorage.getItem("PermissionsDTP"))

const docHS = "QT03036,QT03038"
const docDesign = "QT04043"
const docDesign2 = "QT04051"
const docMau = "QT05050"
const docNhan = "QT03037"
const docChatchuan = "QT04045"


// tabs
const tabs = [
  {
    title: "Danh sách hồ sơ",
    icon: "mdi-text-box",
    tab: "danh-sach-ho-so",
  },
  {
    title: "Tổng hợp",
    icon: "mdi-file-certificate",
    tab: "tong-hop",
  },
  {
    title: "Hồ sơ",
    icon: "mdi-text-box",
    tab: "ho-so-rd",
  },
  {
    title: "Nhãn đăng ký",
    icon: "mdi-image",
    tab: "nhan-dang-ky",
  },
  {
    title: "Nhãn sản xuất",
    icon: "mdi-tooltip-image",
    tab: "nhan-san-xuat",
  },
  {
    title: "Mẫu xuất khẩu",
    icon: "mdi-table-arrow-right",
    tab: "mau-xuat-khau",
  },
  {
    title: "Nhãn trong nước",
    icon: "mdi-earth-arrow-left",
    tab: "nhan-trong-nuoc",
  },
  {
    title: "Order chất chuẩn",
    icon: "mdi-order-bool-ascending",
    tab: "order-chat-chuan",
  },
]

const availableTabs = ref([]) // <- Reactive tab list

availableTabs.value = tabs.filter(tab => {
  const matched = permission.find(p => p.FeatureKey === tab.tab)
  
  return matched && matched.CanAccess == 1
})

// Nếu tab hiện tại không hợp lệ => chuyển về tab đầu tiên
if (!availableTabs.value.find(t => t.tab == activeTab.value)) {
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
      <!-- Tổ chức -->
      <!--
        <VWindowItem value="to-chuc">
        <ManagerSystem />
        </VWindowItem> 
      -->
      <VWindowItem
        v-if="availableTabs.some((t) => t.tab == 'danh-sach-ho-so')"
        value="danh-sach-ho-so"
      >
        <DocumentAll />
      </VWindowItem>
      <VWindowItem
        v-if="availableTabs.some((t) => t.tab == 'tong-hop')"
        value="tong-hop"
      >
        <DocumentQT00003 />
      </VWindowItem>

      <VWindowItem
        v-if="availableTabs.some((t) => t.tab === 'ho-so-rd')"
        value="ho-so-rd"
      >
        <Document :doc-i-d="docHS" />
      </VWindowItem>
      <VWindowItem
        v-if="availableTabs.some((t) => t.tab === 'nhan-dang-ky')"
        value="nhan-dang-ky"
      >
        <Document2 :doc-i-d="docDesign" />
      </VWindowItem>
      <VWindowItem
        v-if="availableTabs.some((t) => t.tab === 'nhan-san-xuat')"
        value="nhan-san-xuat"
      >
        <Document22 :doc-i-d="docDesign2" />
      </VWindowItem>
      <VWindowItem
        v-if="availableTabs.some((t) => t.tab === 'mau-xuat-khau')"
        value="mau-xuat-khau"
      >
        <Document3 :doc-i-d="docMau" />
      </VWindowItem>
      <VWindowItem
        v-if="availableTabs.some((t) => t.tab === 'nhan-trong-nuoc')"
        value="nhan-trong-nuoc"
      >
        <Document4 :doc-i-d="docNhan" />
      </VWindowItem>
      <VWindowItem
        v-if="availableTabs.some((t) => t.tab === 'order-chat-chuan')"
        value="order-chat-chuan"
      >
        <Document5 :doc-i-d="docChatchuan" />
      </VWindowItem>
    </VWindow>
  </div>
</template>
