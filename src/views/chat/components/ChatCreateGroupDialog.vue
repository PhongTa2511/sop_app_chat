<template>
  <div v-if="dialog" class="fb-dialog-overlay">
    <div class="fb-dialog">
      <div class="fb-header">
        <h3>Tạo đoạn chat mới</h3>
        <button class="close-btn" @click="dialog = false">&times;</button>
      </div>

      <div class="fb-search-container">
        <div class="selected-users-wrapper">
          <span class="to-label">Đến:</span>
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
          <input
            v-model="searchUserText"
            type="text"
            placeholder="Tìm kiếm người dùng..."
            class="w-100 px-4 py-2"
            @input="$emit('search-change')"
          />
        </div>
      </div>

      <div class="fb-user-list" @scroll="$emit('scroll', $event)">
        <div
          v-for="item in desserts"
          :key="item.UserName"
          class="fb-user-item"
          :class="{ selected: isSelected(item) }"
          @click="$emit('toggle-user', item)"
        >
          <div class="fb-avatar">
            {{ (item.FullName || "").charAt(0) }}
          </div>
          <div class="fb-user-info">
            <div class="fb-user-name">
              {{ item.FullName }}
            </div>
            <div class="fb-user-sub">
              {{ item.Email }}
            </div>
          </div>
          <div class="fb-checkbox">
            <div class="circle" :class="{ checked: isSelected(item) }" />
          </div>
        </div>

        <div class="list-footer">
          <div v-if="loading" class="fb-spinner" />
        </div>
      </div>

      <div class="fb-footer">
        <button
          class="fb-btn-primary"
          :disabled="selectedUsers.length === 0"
          @click="$emit('create')"
        >
          Tạo nhóm chat
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatCreateGroupDialog",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    selectedUsers: {
      type: Array,
      default: () => [],
    },
    desserts: {
      type: Array,
      default: () => [],
    },
    searchUser: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    "update:modelValue",
    "update:searchUser",
    "remove-user",
    "toggle-user",
    "scroll",
    "search-change",
    "create",
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
    searchUserText: {
      get() {
        return this.searchUser
      },
      set(v) {
        this.$emit("update:searchUser", v)
      },
    },
  },
  methods: {
    isSelected(user) {
      return (this.selectedUsers || []).some(
        (u) => u?.UserName === user?.UserName,
      )
    },
  },
}
</script>

<style scoped>
.fb-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.fb-dialog {
  background: #fff;
  width: 500px;
  border-radius: 8px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.fb-header {
  padding: 16px;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 22px;
  cursor: pointer;
  line-height: 1;
  padding: 2px 6px;
}

.fb-search-container {
  padding: 8px 16px;
  border-bottom: 1px solid #e5e5e5;
}

.selected-users-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.to-label {
  font-weight: 600;
  color: #65676b;
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
  flex: 1;
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

.fb-footer {
  padding: 16px;
  border-top: 1px solid #e5e5e5;
}

.fb-btn-primary {
  width: 100%;
  background: #1877f2;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.fb-btn-primary:disabled {
  background: #e4e6eb;
  color: #bcc0c4;
  cursor: not-allowed;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

