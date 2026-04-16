<template>
  <VNavigationDrawer v-model="drawer" :width="width" class="py-4">
    <div class="mx-4 text-lg d-flex justify-space-between align-center mb-2">
      <div class="text-lg">Đoạn chat</div>
      <VBtn
        icon="mdi-square-edit-outline"
        size="x-small"
        @click="$emit('open-create')"
      />
    </div>

    <VTextField
      v-model="searchText"
      append-inner-icon="mdi-magnify"
      density="compact"
      label="Tìm kiếm"
      hide-details
      single-line
      class="mx-4 my-0"
    />

    <VList>
      <VListItem
        v-for="folder in groupLst"
        :key="folder.GroupID"
        :subtitle="folder.TextContent"
        :value="folder"
        color="blue"
        variant="text"
        class="py-4"
        :active="folder.GroupID == activeGroupId"
        @click="$emit('select-group', folder)"
      >
        <template #prepend>
          <VAvatar
            :color="folder.GroupID == activeGroupId ? 'blue' : 'secondary'"
          >
            <VImg v-if="folder.Avatar" :src="folder.Avatar" />
            <VIcon v-else> mdi-account-supervisor </VIcon>
          </VAvatar>
        </template>
        <template #title>
          <div class="text-bold" style="font-weight: 700">
            {{ folder.GroupName ? folder.GroupName : folder.DocumentID }}
            <VIcon
              v-if="Number(folder.IsMute) === 1"
              size="x-small"
              class="ml-1"
              style="opacity: 0.7"
            >
              mdi-bell-off-outline
            </VIcon>
          </div>
        </template>
        <template #subtitle>
          <div class="text-xs text-gray-700">
            {{
              folder.NewMessage ??
              folder.LastMessage ??
              "Hãy bắt đầu cuộc trò chuyện"
            }}
          </div>
        </template>
        <template v-if="folder.TimeCreate" #append>
          <VBadge
            v-if="folder.UnreadCount > 0"
            location="top right"
            color="primary"
            dot
            :offset-y="-10"
          >
            <div class="text-xs text-grey-800">
              {{ folder.TimeShow }}
            </div>
          </VBadge>
          <div v-else class="text-xs text-grey-800">
            {{ folder.TimeShow }}
          </div>
        </template>
      </VListItem>
    </VList>
  </VNavigationDrawer>
</template>

<script>
export default {
  name: "ChatSidebar",
  props: {
    modelValue: {
      type: Boolean,
      default: true,
    },
    width: {
      type: [Number, String],
      default: 300,
    },
    groupLst: {
      type: Array,
      default: () => [],
    },
    activeGroupId: {
      type: [Number, String, null],
      default: null,
    },
    search: {
      type: String,
      default: "",
    },
  },
  emits: [
    "update:modelValue",
    "update:search",
    "open-create",
    "select-group",
  ],
  computed: {
    drawer: {
      get() {
        return this.modelValue
      },
      set(v) {
        this.$emit("update:modelValue", v)
      },
    },
    searchText: {
      get() {
        return this.search
      },
      set(v) {
        this.$emit("update:search", v)
      },
    },
  },
}
</script>
