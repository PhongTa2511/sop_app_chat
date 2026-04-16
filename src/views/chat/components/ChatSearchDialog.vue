<template>
  <VDialog v-model="dialog" max-width="600px">
    <VCard>
      <VCardTitle>Tìm kiếm tin nhắn</VCardTitle>
      <VCardText>
        <VTextField
          v-model="queryText"
          label="Nhập từ khóa"
          @keyup.enter="$emit('search')"
        />
        <VList>
          <VListItem
            v-for="message in results"
            :key="message.MessageID"
            style="cursor: pointer"
            @click="$emit('jump', message)"
          >
            <template #prepend>
              <VAvatar size="small" color="secondary">
                <VImg v-if="message.Avatar" :src="message.Avatar" />
                <VIcon v-else size="x-small"> mdi-account </VIcon>
              </VAvatar>
            </template>

            <template #title>
              {{ message.TextContent }}
            </template>
            <template #subtitle>
              {{ message.FullName }} - {{ message.TimeShow }}
            </template>
          </VListItem>
        </VList>
      </VCardText>
      <VCardActions>
        <VBtn text @click="dialog = false"> Đóng </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
export default {
  name: "ChatSearchDialog",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    query: {
      type: String,
      default: "",
    },
    results: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:modelValue", "update:query", "search", "jump"],
  computed: {
    dialog: {
      get() {
        return this.modelValue
      },
      set(v) {
        this.$emit("update:modelValue", v)
      },
    },
    queryText: {
      get() {
        return this.query
      },
      set(v) {
        this.$emit("update:query", v)
      },
    },
  },
}
</script>

