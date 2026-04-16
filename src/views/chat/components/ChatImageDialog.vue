<template>
  <VDialog v-model="dialog" :max-width="maxWidth">
    <VImg :src="src" aspect-ratio="1" />
  </VDialog>
</template>

<script>
export default {
  name: "ChatImageDialog",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    src: {
      type: String,
      default: "",
    },
    maxWidth: {
      type: [Number, String],
      default: 600,
    },
  },
  emits: ["update:modelValue"],
  computed: {
    dialog: {
      get() {
        return this.modelValue
      },
      set(v) {
        this.$emit("update:modelValue", v)
      },
    },
  },
}
</script>

