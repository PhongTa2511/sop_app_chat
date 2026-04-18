<template>
  <VDialog v-model="dialog" :max-width="maxWidth">
    <VCard>
      <VCardTitle class="d-flex align-center">
        <span class="text-truncate">Ảnh</span>
        <VSpacer />
        <VBtn icon size="x-small" variant="text" @click="dialog = false">
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VCardTitle>
      <VCardText>
        <div class="zoom-stage" @wheel.prevent="onWheel">
          <img
            v-if="src"
            class="zoom-img"
            :src="src"
            :style="{ transform: `scale(${scale})` }"
            alt=""
          />
        </div>
        <div class="d-flex align-center mt-3">
          <VBtn icon size="small" variant="text" @click="setScale(scale - 0.25)">
            <VIcon>mdi-minus</VIcon>
          </VBtn>
          <VSlider
            v-model="scale"
            :min="0.5"
            :max="4"
            :step="0.05"
            hide-details
            class="mx-2"
          />
          <VBtn icon size="small" variant="text" @click="setScale(scale + 0.25)">
            <VIcon>mdi-plus</VIcon>
          </VBtn>
          <VBtn size="small" variant="text" class="ml-2" @click="setScale(1)">
            100%
          </VBtn>
        </div>
      </VCardText>
    </VCard>
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
      default: 920,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      scale: 1,
    }
  },
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
  watch: {
    modelValue(v) {
      if (v) this.scale = 1
    },
    src() {
      if (this.modelValue) this.scale = 1
    },
  },
  methods: {
    setScale(next) {
      const n = Number(next)
      if (!Number.isFinite(n)) return
      this.scale = Math.min(4, Math.max(0.5, n))
    },
    onWheel(event) {
      const delta = Number(event?.deltaY) || 0
      const step = delta > 0 ? -0.1 : 0.1
      this.setScale(this.scale + step)
    },
  },
}
</script>

<style scoped>
.zoom-stage {
  width: 100%;
  height: 70vh;
  min-height: 420px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoom-img {
  max-width: 100%;
  max-height: 100%;
  transform-origin: center center;
  user-select: none;
  pointer-events: none;
  display: block;
}
</style>

