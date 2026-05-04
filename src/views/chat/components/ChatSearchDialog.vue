<template>
  <VDialog v-model="dialog" :fullscreen="isMobile" max-width="600px">
    <VCard :class="{ 'h-100': isMobile }">
      <VCardTitle class="d-flex align-center bg-blue text-white" :style="isMobile ? { paddingTop: 'env(safe-area-inset-top, 0px)', height: 'calc(64px + env(safe-area-inset-top, 0px))' } : {}">
        Tìm kiếm tin nhắn
        <VSpacer />
        <VBtn icon="mdi-close" variant="text" color="white" @click="dialog = false" />
      </VCardTitle>
      <VCardText class="pa-4">
        <VTextField
          v-model="queryText"
          label="Nhập từ khóa tìm kiếm"
          variant="outlined"
          density="comfortable"
          clearable
          hide-details
          class="mb-4"
          :loading="loading"
          append-inner-icon="mdi-magnify"
          @keyup.enter="$emit('search')"
          @click:append-inner="$emit('search')"
        />

        <div v-if="loading && results.length === 0" class="text-center py-8">
          <VProgressCircular indeterminate color="blue" />
          <div class="mt-2 text-grey">Đang tìm kiếm...</div>
        </div>

        <div v-else-if="!loading && queryText && results.length === 0" class="text-center py-8">
          <VIcon size="48" color="grey-lighten-1">mdi-message-search-outline</VIcon>
          <div class="mt-2 text-grey">Không tìm thấy tin nhắn nào</div>
        </div>

        <VList v-else lines="two" class="pa-0">
          <VListItem
            v-for="message in results"
            :key="message.MessageID"
            style="cursor: pointer"
            class="border-b"
            @click="$emit('jump', message)"
          >
            <template #prepend>
              <VAvatar size="40" color="secondary" class="mr-3">
                <VImg v-if="message.Avatar" :src="message.Avatar" />
                <VIcon v-else> mdi-account </VIcon>
              </VAvatar>
            </template>

            <VListItemTitle class="font-weight-bold text-body-1">
              {{ message.FullName }}
            </VListItemTitle>
            <VListItemSubtitle class="text-wrap">
              {{ message.PreviewText || message.TextContent }}
            </VListItemSubtitle>

            <template #append>
              <div class="text-caption text-grey">
                {{ message.TimeShow }}
              </div>
            </template>
          </VListItem>
        </VList>
      </VCardText>
      <VCardActions v-if="!isMobile" class="pa-4">
        <VSpacer />
        <VBtn variant="text" @click="dialog = false"> Đóng </VBtn>
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
    loading: {
      type: Boolean,
      default: false,
    },
    isMobile: {
      type: Boolean,
      default: false,
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

