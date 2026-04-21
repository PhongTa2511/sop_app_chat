<template>
  <VDialog v-model="dialog" fullscreen>
    <VCard class="image-preview-card">
      <VToolbar density="comfortable" dark>
        <VToolbarTitle class="text-truncate text-black">Ảnh</VToolbarTitle>
        <VSpacer />
        <VBtn
          icon
          size="small"
          variant="text"
          color="red"
          @click="downloadImage"
        >
          <VIcon>mdi-download</VIcon>
        </VBtn>
        <VBtn
          icon
          size="small"
          variant="text"
          color="black"
          @click="dialog = false"
        >
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VToolbar>
      <VCardText class="image-preview-body">
        <div class="zoom-stage" @wheel.prevent="onWheel">
          <img
            v-if="src"
            class="zoom-img"
            :src="src"
            :style="{ transform: `scale(${scale})` }"
            alt=""
          />
        </div>
        <div class="d-flex align-center mt-3 zoom-controls">
          <VBtn
            icon
            size="small"
            variant="text"
            color="white"
            @click="setScale(scale - 0.25)"
          >
            <VIcon>mdi-minus</VIcon>
          </VBtn>
          <VSlider
            v-model="scale"
            :min="0.5"
            :max="4"
            :step="0.05"
            hide-details
            class="mx-2"
            color="blue"
          />
          <VBtn
            icon
            size="small"
            variant="text"
            color="white"
            @click="setScale(scale + 0.25)"
          >
            <VIcon>mdi-plus</VIcon>
          </VBtn>
          <VBtn
            size="small"
            variant="text"
            color="white"
            class="ml-2"
            @click="setScale(1)"
          >
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
    };
  },
  computed: {
    dialog: {
      get() {
        return this.modelValue;
      },
      set(v) {
        this.$emit("update:modelValue", v);
      },
    },
  },
  watch: {
    modelValue(v) {
      if (v) this.scale = 1;
    },
    src() {
      if (this.modelValue) this.scale = 1;
    },
  },
  methods: {
    setScale(next) {
      const n = Number(next);
      if (!Number.isFinite(n)) return;
      this.scale = Math.min(4, Math.max(0.5, n));
    },
    onWheel(event) {
      const delta = Number(event?.deltaY) || 0;
      const step = delta > 0 ? -0.1 : 0.1;
      this.setScale(this.scale + step);
    },
    downloadImage() {
      const url = (this.src || "").toString().trim();
      if (!url) return;
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.download = "image";
      a.click();
    },
  },
};
</script>

<style scoped>
.image-preview-card {
  background: #000;
}

.image-preview-body {
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
}

.zoom-stage {
  width: 100%;
  flex: 1;
  min-height: 320px;
  background: #000;
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
  display: block;
}

.zoom-controls {
  padding: 6px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
}
</style>
