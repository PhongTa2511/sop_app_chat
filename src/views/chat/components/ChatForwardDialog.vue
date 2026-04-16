<template>
  <VDialog v-model="dialog" max-width="520px">
    <VCard>
      <VCardTitle>Chuyển tiếp</VCardTitle>
      <VCardText>
        <VTextField
          v-model="commentText"
          label="Ghi chú (tuỳ chọn)"
          hide-details
          density="compact"
          class="mb-3"
        />
        <VTextField
          v-model="searchText"
          label="Tìm đoạn chat"
          hide-details
          density="compact"
          class="mb-2"
        />

        <VList style="max-height: 320px; overflow: auto">
          <VListItem
            v-for="g in suggestions"
            :key="g.GroupID"
            @click="$emit('forward', g)"
          >
            <template #prepend>
              <VAvatar>
                <VImg v-if="g.Avatar" :src="g.Avatar" />
                <VIcon v-else> mdi-account-supervisor </VIcon>
              </VAvatar>
            </template>
            <template #title>
              <div class="text-bold" style="font-weight: 700">
                {{ g.GroupName ? g.GroupName : g.DocumentID }}
              </div>
            </template>
            <template #subtitle>
              {{ g.NewMessage ?? g.LastMessage ?? "" }}
            </template>
          </VListItem>
        </VList>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn text @click="dialog = false">Đóng</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
export default {
  name: "ChatForwardDialog",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    comment: {
      type: String,
      default: "",
    },
    search: {
      type: String,
      default: "",
    },
    suggestions: {
      type: Array,
      default: () => [],
    },
  },
  emits: [
    "update:modelValue",
    "update:comment",
    "update:search",
    "forward",
    "close",
  ],
  computed: {
    dialog: {
      get() {
        return this.modelValue
      },
      set(v) {
        this.$emit("update:modelValue", v)
        if (!v) this.$emit("close")
      },
    },
    commentText: {
      get() {
        return this.comment
      },
      set(v) {
        this.$emit("update:comment", v)
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

