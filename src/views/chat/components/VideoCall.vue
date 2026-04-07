<template>
  <div
    id="video-call-window"
    ref="videoWindow"
    class="floating-video"
    :class="{ fullscreen: isFullscreen }"
  >
    <div class="header">
      <span>Cuộc gọi video</span>

      <div class="video-controls">
        <!-- Chia sẻ màn hình -->
        <VTooltip :text="isSharingScreen ? 'Dừng chia sẻ' : 'Chia sẻ màn hình'">
          <template #activator="{ props }">
            <VBtn
              v-bind="props"
              :icon="isSharingScreen ? 'mdi-radiobox-marked' : 'mdi-monitor'"
              :color="isSharingScreen ? 'red' : 'green'"
              size="x-small"
              class="mr-1"
              @click="shareScreen"
            />
          </template>
        </VTooltip>

        <!-- Phóng to / thu nhỏ -->
        <VTooltip :text="isFullscreen ? 'Thu nhỏ' : 'Phóng to'">
          <template #activator="{ props }">
            <VBtn
              v-bind="props"
              :icon="isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
              size="x-small"
              @click="toggleFullscreen"
            />
          </template>
        </VTooltip>
      </div>
    </div>

    <div
      class="videos"
      :class="{ sharing: isSharingScreen }"
    >
      <!-- Nếu đang chia sẻ màn hình thì phóng to video màn hình -->
      <div
        v-if="isSharingScreen"
        class="shared-screen"
      >
        <video
          ref="localScreen"
          :srcObject="screenStream"
          autoplay
          playsinline
          muted
        />
      </div>

      <!-- Danh sách user (thu nhỏ khi chia sẻ màn hình) -->
      <div class="participants">
        <!-- Video của chính mình -->
        <video
          v-if="!isSharingScreen"
          ref="localVideo"
          :srcObject="localStream"
          autoplay
          muted
          playsinline
        />

        <!-- Khi chia sẻ màn hình thì video mình cũng vào danh sách nhỏ -->
        <video
          v-else
          ref="localVideo"
          :srcObject="localStream"
          autoplay
          muted
          playsinline
          class="small"
        />

        <!-- Video của các user khác -->
        <video
          v-for="(stream, id) in remoteStreams"
          :key="id"
          :srcObject="stream"
          autoplay
          playsinline
          :class="isSharingScreen ? 'small' : ''"
        />
      </div>
    </div>

    <div class="actions">
      <VMenu
        transition="scale-transition"
        location="top"
        :attach="false"
        content-class="menu-fix"
      >
        <template #activator="{ props }">
          <VBtn
            size="small"
            color="primary"
            v-bind="props"
            icon="mdi-microphone"
          />
        </template>

        <VList style="z-index: 10000000">
          <VListItem
            v-for="(item, i) in microphones"
            :key="i"
            :value="i"
            style="z-index: 10000000"
          >
            <VListItemTitle>{{ item.label }}</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- Bật/Tắt Micro -->
      <VTooltip :text="isMicOn ? 'Tắt micro' : 'Bật micro'">
        <template #activator="{ props }">
          <VBtn
            v-bind="props"
            :icon="isMicOn ? 'mdi-microphone' : 'mdi-microphone-off'"
            :color="isMicOn ? 'green' : 'grey'"
            size="small"
            @click="toggleMicrophone"
          />
        </template>
      </VTooltip>

      <VTooltip :text="isCamOn ? 'Tắt camera' : 'Bật camera'">
        <template #activator="{ props }">
          <VBtn
            v-bind="props"
            :icon="isCamOn ? 'mdi-video' : 'mdi-video-off'"
            :color="isCamOn ? 'green' : 'grey'"
            size="small"
            @click="toggleCamera"
          />
        </template>
      </VTooltip>
      <VBtn
        icon="mdi-phone-hangup"
        color="red"
        size="small"
        @click="handleCloseCall"
      />
    </div>
  </div>
</template>

<script>
import interact from "interactjs"

export default {
  props: ["targetUserId", "currentUserId"],
  data() {
    return {
      remoteStreams: {},
      localStream: null,
      peerConnections: {},
      screenStream: null,
      isSharingScreen: false,
      isFullscreen: false,
      microphones: [],
      selectedMicId: null,
      isMicOn: true,
      isCamOn: true,
    }
  },
  async mounted() {
    await this.startCamera()
    await this.loadMicrophones()
    this.enableDragAndResize()
  },
  methods: {
    /* -------------------- 🎤 BẬT / TẮT MICRO -------------------- */
    toggleMicrophone() {
      if (!this.localStream) return
      const audioTrack = this.localStream.getAudioTracks()[0]
      if (audioTrack) {
        this.isMicOn = !this.isMicOn
        audioTrack.enabled = this.isMicOn
      }
    },

    /* -------------------- 🎦 BẬT / TẮT CAMERA -------------------- */
    toggleCamera() {
      if (!this.localStream) return
      const videoTrack = this.localStream.getVideoTracks()[0]
      if (videoTrack) {
        this.isCamOn = !this.isCamOn
        videoTrack.enabled = this.isCamOn
      }
    },

    /* -------------------- 🧠 DI CHUYỂN & PHÓNG TO -------------------- */
    enableDragAndResize() {
      const target = this.$refs.videoWindow

      target.style.position = "fixed"
      target.style.left = "calc(50% - 200px)"
      target.style.top = "calc(50% - 150px)"

      const defaultWidth = 400
      const defaultHeight = 300
      if (!target.style.width) target.style.width = `${defaultWidth}px`
      if (!target.style.height) target.style.height = `${defaultHeight}px`

      interact(target)
        .draggable({
          inertia: true,
          listeners: {
            start() {
              document.body.classList.add("dragging")
              if (!target.dataset.x) {
                target.dataset.x = 20
                target.dataset.y = 20
              }
            },
            move(event) {
              if (target.classList.contains("fullscreen")) return
              const x = (parseFloat(target.dataset.x) || 0) + event.dx
              const y = (parseFloat(target.dataset.y) || 0) + event.dy

              target.style.transform = `translate(${x}px, ${y}px)`
              target.dataset.x = x
              target.dataset.y = y
            },
            end() {
              document.body.classList.remove("dragging")
            },
          },
        })
        .resizable({
          edges: { left: true, right: true, bottom: true, top: true },
          inertia: true,
          modifiers: [
            interact.modifiers.restrictSize({
              min: { width: defaultWidth, height: defaultHeight },
              max: { width: 1000, height: 800 },
            }),
          ],
          listeners: {
            move(event) {
              if (target.classList.contains("fullscreen")) return
              let x = parseFloat(target.dataset.x) || 0
              let y = parseFloat(target.dataset.y) || 0
              target.style.width = `${event.rect.width}px`
              target.style.height = `${event.rect.height}px`
              x += event.deltaRect.left
              y += event.deltaRect.top
              target.style.transform = `translate(${x}px, ${y}px)`
              target.dataset.x = x
              target.dataset.y = y
            },
          },
        })
    },

    /* -------------------- 🎥 CAMERA & MICRO -------------------- */
    async startCamera() {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      this.$refs.localVideo.srcObject = this.localStream
    },

    async loadMicrophones() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })

        const devices = await navigator.mediaDevices.enumerateDevices()

        this.microphones = devices
          .filter(d => d.kind === "audioinput")
          .map(d => ({
            label: d.label || `Micro ${d.deviceId.slice(0, 5)}`,
            deviceId: d.deviceId,
          }))

        if (this.microphones.length > 0 && !this.selectedMicId)
          this.selectedMicId = this.microphones[0].deviceId
      } catch (err) {
        console.error("Không thể lấy danh sách micro:", err)
      }
    },

    async changeMicrophone() {
      try {
        if (!this.selectedMicId) return

        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: this.selectedMicId } },
        })

        const newTrack = newStream.getAudioTracks()[0]
        const oldTrack = this.localStream?.getAudioTracks()[0]
        if (oldTrack) oldTrack.stop()

        this.localStream.removeTrack(oldTrack)
        this.localStream.addTrack(newTrack)

        Object.values(this.peerConnections).forEach(pc => {
          const sender = pc.getSenders().find(s => s.track?.kind === "audio")
          if (sender) sender.replaceTrack(newTrack)
        })

        console.log("🎙️ Đã chuyển sang micro:", newTrack.label)
      } catch (err) {
        console.error("Lỗi khi đổi micro:", err)
      }
    },

    /* -------------------- 🖥️ CHIA SẺ MÀN HÌNH -------------------- */
    async shareScreen() {
      try {
        if (!this.isSharingScreen) {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: { cursor: "always" },
            audio: false,
          })

          this.screenStream = screenStream
          this.isSharingScreen = true

          const screenTrack = screenStream.getVideoTracks()[0]

          Object.values(this.peerConnections).forEach(pc => {
            const sender = pc
              .getSenders()
              .find(s => s.track?.kind === "video")

            if (sender) sender.replaceTrack(screenTrack)
          })

          screenTrack.onended = () => this.stopShareScreen()
          screenTrack.oninactive = () => this.stopShareScreen()
        } else {
          this.stopShareScreen()
        }
      } catch (err) {
        console.error("Lỗi chia sẻ màn hình:", err)
      }
    },

    stopShareScreen() {
      if (!this.isSharingScreen) return
      this.isSharingScreen = false
      if (this.screenStream) {
        this.screenStream.getTracks().forEach(t => t.stop())
        this.screenStream = null
      }

      const localVideoTrack = this.localStream?.getVideoTracks()[0]
      if (!localVideoTrack) return this.restartCamera()

      Object.values(this.peerConnections).forEach(pc => {
        const sender = pc.getSenders().find(s => s.track?.kind === "video")
        if (sender) sender.replaceTrack(localVideoTrack)
      })
    },

    async restartCamera() {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      const videoTrack = this.localStream.getVideoTracks()[0]

      Object.values(this.peerConnections).forEach(pc => {
        const sender = pc.getSenders().find(s => s.track?.kind === "video")
        if (sender) sender.replaceTrack(videoTrack)
      })
    },

    /* -------------------- 🔲 PHÓNG TO / THU NHỎ -------------------- */
    toggleFullscreen() {
      const target = this.$refs.videoWindow

      this.isFullscreen = !this.isFullscreen

      if (this.isFullscreen) {
        target.classList.add("fullscreen")
        target.style.transform = "none"
        target.removeAttribute("data-x")
        target.removeAttribute("data-y")
      } else {
        target.classList.remove("fullscreen")
        target.style.width = "400px"
        target.style.height = "300px"
      }
    },

    async cleanupCall() {
      try {
        console.log("🧹 Dọn toàn bộ tài nguyên cuộc gọi...")

        // 1️⃣ Dừng tất cả track trong localStream (mic + cam)
        if (this.localStream) {
          this.localStream.getTracks().forEach(track => {
            track.stop()
            this.localStream.removeTrack(track)
          })
          this.localStream = null
        }

        // 2️⃣ Dừng tất cả track chia sẻ màn hình
        if (this.screenStream) {
          this.screenStream.getTracks().forEach(track => {
            track.stop()
            this.screenStream.removeTrack(track)
          })
          this.screenStream = null
        }

        // 3️⃣ Gỡ mọi track khỏi các PeerConnection trước khi đóng
        Object.values(this.peerConnections).forEach(pc => {
          try {
            pc.getSenders().forEach(sender => {
              try {
                if (sender.track) pc.removeTrack(sender)
              } catch (e) {}
            })
            pc.close()
          } catch (e) {
            console.warn("Lỗi đóng peer:", e)
          }
        })
        this.peerConnections = {}

        // 4️⃣ Ngắt toàn bộ video element (ngăn Chrome giữ kết nối)
        if (this.$refs.localVideo) {
          this.$refs.localVideo.pause()
          this.$refs.localVideo.srcObject = null
        }
        if (this.$refs.localScreen) {
          this.$refs.localScreen.pause()
          this.$refs.localScreen.srcObject = null
        }
        const vids = document.querySelectorAll("video")

        vids.forEach(v => {
          v.pause()
          v.srcObject = null
        })

        // 5️⃣ Hủy quyền truy cập để Chrome tắt biểu tượng sớm
        await navigator.mediaDevices
          .getUserMedia({ audio: false, video: false })
          .catch(() => {})
        await navigator.mediaDevices.enumerateDevices() // ép Chrome refresh trạng thái

        this.isSharingScreen = false
        this.isFullscreen = false

        console.log("✅ Đã cleanup hoàn toàn media và peer")
      } catch (err) {
        console.error("❌ Lỗi cleanupCall:", err)
      }
    },
    handleCloseCall() {
      this.cleanupCall()
      this.$emit("closeCall") // Gửi sự kiện ra ngoài nếu cần đóng UI
    },
  },
}
</script>

<style lang="scss">
.menu-fix {
  //   position: absolute !important;
  z-index: 999999 !important;
  //   inset: auto !important;
}
// .v-overlay__content {
//   z-index: 999999 !important;
// }
</style>

<style scoped>
.floating-video {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px;
  height: 240px;
  background: #111;
  border-radius: 12px;
  overflow: hidden;
  z-index: 1005;
  box-shadow: 0 0 10px #0005;
  display: flex;
  flex-direction: column;
}

.floating-video.fullscreen {
  top: 0 !important;
  left: 0 !important;
  bottom: 0 !important;
  right: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  transform: none !important;
  border-radius: 0 !important;
  z-index: 10000;
}

.header {
  background: #222;
  color: white;
  padding: 4px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
}

.videos {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  flex: 1;
  justify-content: center;
  align-items: center;
}

.videos.sharing {
  flex-direction: column;
}

.shared-screen {
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  border-radius: 8px;
  overflow: hidden;
}
.shared-screen video {
  width: 100%;
  height: auto;
  max-height: 100%;
  border-radius: 8px;
}

.participants {
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
  justify-content: center;
  align-items: center;
  padding: 4px;
  background: #222;
  border-radius: 8px;
  overflow-x: auto;
}
.participants video {
  width: 48%;
  border-radius: 8px;
  transition: all 0.3s;
}
.participants video.small {
  width: 100px;
  height: 80px;
  object-fit: cover;
}
.actions {
  background: #222;
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 4px;
  z-index: 100000;
}

.dragging {
  user-select: none !important;
  pointer-events: none;
}
body.dragging,
body.dragging * {
  user-select: none !important;
  cursor: grabbing !important;
}
</style>
