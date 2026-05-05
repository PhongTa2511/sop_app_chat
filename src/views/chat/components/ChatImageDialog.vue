<template>
  <VDialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
    <VCard class="image-preview-card">
      <VToolbar flat color="transparent" dark class="image-preview-toolbar">
        <VBtn
          icon="mdi-chevron-left"
          variant="text"
          color="white"
          @click="dialog = false"
        />
        <VToolbarTitle class="text-white font-weight-medium">Ảnh</VToolbarTitle>
        <VSpacer />
        <VBtn
          icon="mdi-download"
          variant="text"
          color="white"
          :loading="isDownloading"
          @click="downloadImage"
        />
        <VBtn
          icon="mdi-close"
          variant="text"
          color="white"
          class="ml-2"
          @click="dialog = false"
        />
      </VToolbar>

      <VCardText class="image-preview-body pa-0">
        <div 
          ref="stage" 
          class="zoom-stage"
          @wheel.prevent="onWheel"
        >
          <img
            v-if="src"
            ref="img"
            class="zoom-img"
            :src="src"
            :style="imgStyle"
            alt=""
            @load="onImgLoad"
          />
        </div>
        
        <!-- Zoom Level Indicator (Subtle overlay) -->
        <div v-if="scale !== 1" class="zoom-indicator">
          {{ Math.round(scale * 100) }}%
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script>
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { notify } from "@kyvg/vue3-notification";
import interact from 'interactjs';

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
  },
  emits: ["update:modelValue"],
  data() {
    return {
      scale: 1,
      x: 0,
      y: 0,
      isDownloading: false,
      interactable: null,
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
    imgStyle() {
      return {
        transform: `translate(${this.x}px, ${this.y}px) scale(${this.scale})`,
      };
    },
  },
  watch: {
    modelValue(v) {
      if (v) {
        this.resetZoom();
        this.$nextTick(() => this.initInteract());
      } else {
        this.destroyInteract();
      }
    },
    src() {
      if (this.modelValue) this.resetZoom();
    },
  },
  mounted() {
    if (this.modelValue) this.initInteract();
  },
  beforeUnmount() {
    this.destroyInteract();
  },
  methods: {
    resetZoom() {
      this.scale = 1;
      this.x = 0;
      this.y = 0;
    },
    onImgLoad() {
      this.resetZoom();
    },
    initInteract() {
      if (this.interactable) return;
      
      const stage = this.$refs.stage;
      if (!stage) return;

      this.interactable = interact(stage)
        .gesturable({
          onmove: (event) => {
            this.scale = Math.min(5, Math.max(0.5, this.scale * (1 + event.ds)));
          }
        })
        .draggable({
          listeners: {
            move: (event) => {
              if (this.scale > 1) {
                this.x += event.dx;
                this.y += event.dy;
              }
            },
          },
        });
    },
    destroyInteract() {
      if (this.interactable) {
        this.interactable.unset();
        this.interactable = null;
      }
    },
    onWheel(event) {
      const delta = Number(event?.deltaY) || 0;
      const step = delta > 0 ? 0.9 : 1.1;
      this.scale = Math.min(5, Math.max(0.5, this.scale * step));
    },
    async downloadImage() {
      if (this.isDownloading) return;
      const url = (this.src || "").toString().trim();
      if (!url) return;

      this.isDownloading = true;
      try {
        if (Capacitor.isNativePlatform()) {
          // Native Download - Using Filesystem.downloadFile for direct download to storage
          const fileName = `DTP_Chat_${Date.now()}.jpg`;
          
          await Filesystem.downloadFile({
            url: url,
            path: fileName,
            directory: Directory.Documents,
          });

          notify({
            title: "Thành công",
            text: "Đã tải ảnh về thư mục Documents",
            type: "success",
          });
        } else {
          // Web Fallback
          const response = await fetch(url);
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = `DTP_Chat_${Date.now()}.jpg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(blobUrl);

          notify({
            title: "Thành công",
            text: "Đã tải ảnh xuống",
            type: "success",
          });
        }
      } catch (err) {
        console.error("Download error:", err);
        notify({
          title: "Lỗi",
          text: "Tải ảnh thất bại",
          type: "error",
        });
      } finally {
        this.isDownloading = false;
      }
    },
  },
};
</script>

<style scoped>
.image-preview-card {
  background: #000 !important;
  color: #fff;
}

.image-preview-toolbar {
  padding-top: env(safe-area-inset-top, 0px) !important;
  height: calc(64px + env(safe-area-inset-top, 0px)) !important;
  background: rgba(0, 0, 0, 0.4) !important;
  backdrop-filter: blur(10px);
  z-index: 10;
}

.image-preview-body {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  position: relative;
  background: #000;
  overflow: hidden;
}

.zoom-stage {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none; /* Important for interactjs */
}

.zoom-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
  will-change: transform;
}

.zoom-indicator {
  position: absolute;
  bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: #fff;
  pointer-events: none;
}

:deep(.v-dialog > .v-overlay__content) {
  margin: 0;
}
</style>
