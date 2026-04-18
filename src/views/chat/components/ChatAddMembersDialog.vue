<template>
  <VDialog v-model="dialog" max-width="520px">
    <VCard>
      <VCardTitle class="d-flex align-center">
        <span>Thêm thành viên</span>
        <VSpacer />
        <VBtn icon size="x-small" variant="text" @click="dialog = false">
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VCardTitle>

      <VCardText>
        <VTextField
          v-model="searchText"
          label="Tìm người dùng"
          hide-details
          density="compact"
          class="mb-2"
          @input="$emit('search-change')"
        />

        <div class="selected-users-wrapper mb-3">
          <div
            v-for="user in selectedUsers"
            :key="user.UserName"
            class="fb-chip"
          >
            {{ user.FullName || user.UserName }}
            <span class="remove-chip" @click="$emit('remove-user', user)"
              >&times;</span
            >
          </div>
        </div>

        <div class="fb-user-list" @scroll="$emit('scroll', $event)">
          <div
            v-for="item in users"
            :key="item.UserName"
            class="fb-user-item"
            :class="{ selected: isSelected(item), disabled: isDisabled(item) }"
            @click="!isDisabled(item) && $emit('toggle-user', item)"
          >
            <div class="fb-avatar">
              {{ (item.FullName || "").charAt(0) }}
            </div>
            <div class="fb-user-info">
              <div class="fb-user-name">
                {{ item.FullName }}
              </div>
              <div class="fb-user-sub">
                {{ item.UserName }}
              </div>
            </div>
            <div class="fb-checkbox">
              <div
                class="circle"
                :class="{ checked: isSelected(item) }"
              />
            </div>
          </div>

          <div
            v-if="!loading && (!users || users.length === 0)"
            class="text-center text-grey-darken-1 py-6"
          >
            Không có kết quả
          </div>

          <div class="list-footer">
            <div v-if="loading" class="fb-spinner" />
          </div>
        </div>
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn variant="text" @click="dialog = false">Đóng</VBtn>
        <VBtn
          color="primary"
          :disabled="selectedUsers.length === 0 || saving"
          @click="$emit('add')"
        >
          {{ saving ? "Đang thêm..." : "Thêm" }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
export default {
  name: "ChatAddMembersDialog",
  props: {
    modelValue: { type: Boolean, default: false },
    search: { type: String, default: "" },
    users: { type: Array, default: () => [] },
    selectedUsers: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    saving: { type: Boolean, default: false },
    disabledUsernames: { type: Array, default: () => [] },
  },
  emits: [
    "update:modelValue",
    "update:search",
    "search-change",
    "scroll",
    "toggle-user",
    "remove-user",
    "add",
  ],
  computed: {
    dialog: {
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
    disabledSet() {
      return new Set((this.disabledUsernames || []).map((x) => String(x)))
    },
  },
  methods: {
    isSelected(user) {
      return (this.selectedUsers || []).some(
        (u) => u?.UserName === user?.UserName,
      )
    },
    isDisabled(user) {
      return this.disabledSet.has(String(user?.UserName || ""))
    },
  },
}
</script>

<style scoped>
.selected-users-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.fb-chip {
  background: #e7f3ff;
  color: #1877f2;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.remove-chip {
  margin-left: 8px;
  cursor: pointer;
  font-weight: bold;
}

.fb-user-list {
  max-height: 360px;
  overflow-y: auto;
  padding: 8px 0;
}

.fb-user-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.fb-user-item:hover {
  background: #f2f2f2;
}

.fb-user-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.fb-avatar {
  width: 40px;
  height: 40px;
  background: #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.fb-user-info {
  flex: 1;
}
.fb-user-name {
  font-weight: 600;
  color: #050505;
}
.fb-user-sub {
  font-size: 12px;
  color: #65676b;
}

.fb-checkbox .circle {
  width: 20px;
  height: 20px;
  border: 2px solid #ced0d4;
  border-radius: 50%;
}

.fb-checkbox .circle.checked {
  background: #1877f2;
  border-color: #1877f2;
  position: relative;
}

.fb-checkbox .circle.checked::after {
  content: "✓";
  color: white;
  font-size: 12px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.list-footer {
  padding: 8px 16px;
}

.fb-spinner {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #e4e6eb;
  border-top-color: #1877f2;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
