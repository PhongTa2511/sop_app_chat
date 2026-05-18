<template>
  <VNavigationDrawer
    v-model="drawer"
    :width="width"
    class="py-4 safe-area-sidebar"
    :mobile-breakpoint="isMobileView ? 0 : undefined"
  >
    <!-- Header Area: Large Title & Action -->
    <div class="px-5 pt-6 pb-4 d-flex justify-space-between align-center">
      <div class="text-h5 font-weight-bold">DTP CHAT</div>
      <div class="d-flex align-center gap-1">
        <!-- Dark Mode Toggle -->
        <VBtn
          :icon="isDark ? 'mdi-weather-night' : 'mdi-white-balance-sunny'"
          variant="text"
          size="small"
          color="medium-emphasis"
          class="rounded-circle"
          @click="toggleTheme"
        />
        <!-- Logout -->
        <VBtn
          icon="mdi-logout"
          variant="text"
          size="small"
          color="error"
          class="rounded-circle"
          @click="$emit('logout')"
        />
        <!-- Tạo nhóm mới -->
        <VBtn
          icon="mdi-plus"
          color="primary"
          variant="tonal"
          size="small"
          class="rounded-circle ml-1"
          @click="$emit('open-create')"
        />
      </div>
    </div>

    <!-- Search Bar: Pill Shape -->
    <VTextField
      v-model="searchText"
      prepend-inner-icon="mdi-magnify"
      placeholder="Tìm kiếm"
      density="compact"
      variant="solo-filled"
      flat
      hide-details
      rounded="pill"
      class="mx-4 mb-2"
    />

    <!-- Pull-to-refresh indicator -->
    <Transition name="fade-ptr">
      <div v-if="isPulling" class="sidebar-pull-indicator">
        <VProgressCircular
          :indeterminate="isRefreshing"
          :model-value="isRefreshing ? undefined : Math.min(pullProgress, 100)"
          color="blue"
          size="22"
        />
      </div>
    </Transition>

    <VList
      ref="groupList"
      @touchstart.passive="onListTouchStart"
      @touchmove="onListTouchMove"
      @touchend="onListTouchEnd"
    >
      <VListItem
        v-for="folder in groupLst"
        :key="folder.GroupID"
        :value="folder"
        color="blue"
        variant="text"
        class="py-3 px-3 mx-2 mb-1 rounded-xl"
        :active="folder.GroupID == activeGroupId"
        @click="$emit('select-group', folder)"
      >
        <template #prepend>
          <VAvatar
            :color="folder.GroupID == activeGroupId ? 'blue' : 'secondary'"
            size="54"
            class="mr-3"
          >
            <VImg v-if="folder.Avatar" :src="folder.Avatar" />
            <VIcon v-else size="28"> mdi-account-supervisor </VIcon>
          </VAvatar>
        </template>
        
        <template #title>
          <div class="d-flex justify-space-between align-center mb-1">
            <div class="text-subtitle-1 font-weight-bold text-truncate pr-2">
              {{ folder.GroupName ? folder.GroupName : folder.DocumentID }}
              <VIcon
                v-if="Number(folder.IsMute) === 1"
                size="x-small"
                class="ml-1 text-medium-emphasis"
              >
                mdi-bell-off-outline
              </VIcon>
            </div>
            <div class="text-caption text-medium-emphasis" style="min-width: fit-content">
              {{ folder.TimeShow }}
            </div>
          </div>
        </template>
        
        <template #subtitle>
          <div class="d-flex justify-space-between align-center mt-n1">
            <div
              class="text-body-2 text-truncate pr-2"
              :class="folder.UnreadCount > 0 ? 'font-weight-bold text-high-emphasis' : 'text-medium-emphasis'"
            >
              {{
                folder.NewMessage ??
                folder.LastMessage ??
                "Hãy bắt đầu cuộc trò chuyện"
              }}
            </div>
            <!-- Unread Dot -->
            <div 
              v-if="folder.UnreadCount > 0"
              class="bg-primary text-white text-caption font-weight-bold d-flex align-center justify-center rounded-pill"
              style="min-width: 20px; height: 20px; padding: 0 6px;"
            >
              {{ unreadLabel(folder.UnreadCount) }}
            </div>
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
    isMobileView: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    "update:modelValue",
    "update:search",
    "open-create",
    "select-group",
    "logout",
    "refresh",
  ],
  data() {
    return {
      pullStartY: 0,
      isPulling: false,
      isRefreshing: false,
      pullProgress: 0,
    };
  },
  computed: {
    drawer: {
      get() {
        return this.modelValue;
      },
      set(v) {
        this.$emit("update:modelValue", v);
      },
    },
    searchText: {
      get() {
        return this.search;
      },
      set(v) {
        this.$emit("update:search", v);
      },
    },
    isDark() {
      return this.$vuetify?.theme?.global?.name === 'dark';
    },
    isDarkModel: {
      get() {
        return this.isDark;
      },
      set() {
        this.toggleTheme();
      },
    },
  },
  methods: {
    unreadLabel(count) {
      const n = Number(count) || 0;
      if (n <= 0) return "";

      return n > 9 ? "9+" : String(n);
    },
    toggleTheme() {
      const theme = this.$vuetify?.theme;
      if (!theme) return;
      const current = theme.global.name;
      const next = current === 'dark' ? 'light' : 'dark';
      theme.global.name = next;
      // Lưu lựa chọn vào localStorage để nhớ sau khi reload
      try { localStorage.setItem('dtp_theme', next); } catch (_) {}
    },
    onListTouchStart(e) {
      const el = this.$refs.groupList?.$el || this.$refs.groupList;
      if (!el) return;

      // Chỉ kích hoạt khi đang ở đầu danh sách
      if (el.scrollTop > 0) return;
      this.pullStartY = e.touches[0].clientY;
      this.pullProgress = 0;
    },
    onListTouchMove(e) {
      if (!this.pullStartY) return;
      const el = this.$refs.groupList?.$el || this.$refs.groupList;
      if (!el || el.scrollTop > 0) {
        this.pullStartY = 0;
        this.isPulling = false;

        return;
      }
      const delta = e.touches[0].clientY - this.pullStartY;
      if (delta > 0) {
        e.preventDefault();
        this.pullProgress = Math.min(100, Math.round((delta / 64) * 100));
        this.isPulling = true;
      }
    },
    async onListTouchEnd() {
      if (!this.isPulling) return;
      if (this.pullProgress >= 100 && !this.isRefreshing) {
        this.isRefreshing = true;
        this.$emit("refresh");

        // Hiển thị spinner tối thiểu 600ms để không nháy
        await new Promise((r) => setTimeout(r, 600));
        this.isRefreshing = false;
      }
      this.isPulling = false;
      this.pullProgress = 0;
      this.pullStartY = 0;
    },
  },
};
</script>

<style scoped>
.safe-area-sidebar {
  padding-block-start: calc(16px + env(safe-area-inset-top, 0px)) !important;
}

.sidebar-pull-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--v-theme-grey-600));
  gap: 8px;
  padding-block: 8px;
  padding-inline: 16px;
}

.sidebar-pull-text {
  font-size: 12px;
  font-weight: 500;
}

/* Fade transition cho pull indicator */
.fade-ptr-enter-active,
.fade-ptr-leave-active {
  overflow: hidden;
  transition:
    opacity 0.2s ease,
    max-block-size 0.2s ease;
}

.fade-ptr-enter-from,
.fade-ptr-leave-to {
  max-block-size: 0;
  opacity: 0;
}

.fade-ptr-enter-to,
.fade-ptr-leave-from {
  max-block-size: 60px;
  opacity: 1;
}
</style>
