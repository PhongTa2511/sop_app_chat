<script setup>
import socket from "@/socket";
import { hexToRgb } from "@layouts/utils";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { onMounted, onUnmounted, ref } from "vue";
import { useTheme } from "vuetify";
import { notiAll, reloadPage, sendNoti } from "./firebase";
import { getUserName } from "./utils/auth";
const { global } = useTheme();

const originalTitle = "Quản lý quy trình"; // Không cần ref nếu không đổi text gốc
const unreadTotal = ref(0);
let intervalId = null;

const dialog = ref(false);
const notification = ref({ content: "", title: "", type: 0 });

const updateFavicon = (hasMessage) => {
  const link = document.querySelector("link[rel*='icon']");
  if (!link) return;

  if (!hasMessage) {
    link.href = "/dtp-logo.png"; // Đường dẫn icon gốc của bạn
    return;
  }

  const img = new Image();
  img.src = link.href;
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0, 32, 32);

    // Vẽ hình tròn đỏ ở góc trên bên phải
    ctx.beginPath();
    ctx.arc(24, 8, 7, 0, 2 * Math.PI);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.stroke();

    link.href = canvas.toDataURL("image/png");
  };
};

const playNotificationSound = () => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // Tạo 2 nốt nhạc liên tiếp để tạo âm thanh "ting ting"
  const playNote = (frequency, startTime, duration) => {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine"; // Âm thanh dạng sóng sin (trong trẻo)
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gainNode.gain.setValueAtTime(0.1, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  };
  console.log("Chạy âm thanh");

  // Nốt 1 (Trầm hơn) và Nốt 2 (Cao hơn) tạo cảm giác thông báo
  playNote(880, audioCtx.currentTime, 0.1);
  playNote(1046.5, audioCtx.currentTime + 0.1, 0.2);
};

const showNotification = (data) => {
  notification.value = {
    title: data.title || "Thông báo mới",
    content: data.content || data.LastMessage || "Bạn có một tin nhắn mới",
    type: data.type || 1,
  };
  dialog.value = true;
};

const startTitleFlashing = (senderName) => {
  if (intervalId) clearInterval(intervalId);

  updateFavicon(true);
  let showAlt = false;
  intervalId = setInterval(() => {
    document.title = showAlt
      ? `💬 ${senderName}...`
      : `(${unreadTotal.value}) ${originalTitle}`;
    showAlt = !showAlt;
  }, 1000);
};
const resetNotification = () => {
  unreadTotal.value = 0;
  document.title = originalTitle;
  updateFavicon(false);
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

onMounted(() => {
  window.addEventListener("focus", resetNotification);
  socket.on("sidebar:update", (data) => {
    if (data.SenderID != getUserName()) {
      unreadTotal.value++;
      startTitleFlashing(data.SenderName || "Có tin nhắn");
      playNotificationSound();
    }
  });
  socket.emit("join:user", {
    UserID: getUserName(),
  });
});

onUnmounted(() => {
  window.removeEventListener("focus", resetNotification);
  socket.off("sidebar:update");
});

onSnapshot(reloadPage, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "modified") location.reload();
  });
});

onSnapshot(sendNoti, (snapshot) => {
  snapshot.docChanges().forEach(async (change) => {
    if (change.type === "modified") {
      const docRef = doc(notiAll, "NoI7tP9Acvjcu6faywwc");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        showNotification(data); // Show notification dialog
      }
    }
  });
});
</script>

<template>
  <VApp
    :style="`--v-global-theme-primary: ${hexToRgb(
      global.current.value.colors.primary,
    )}`"
  >
    <RouterView />

    <!-- Notification Dialog -->
    <VDialog v-model="dialog" max-width="400">
      <VCard>
        <VCardTitle class="text-center mt-4">
          {{ notification.title }}
        </VCardTitle>
        <VCardText>
          <div v-if="notification.type === 2" class="text-center pb-4">
            <v-icon color="green" size="80">mdi-check-circle-outline</v-icon>
          </div>
          <div v-if="notification.type === 0" class="text-center pb-4">
            <v-icon color="red" size="80">mdi-close-circle-outline</v-icon>
          </div>
          <div v-if="notification.type === 1" class="text-center pb-4">
            <v-icon color="orange" size="80">mdi-alert-circle-outline</v-icon>
          </div>
          <div class="text-center px-4">
            {{ notification.content }}
          </div>
        </VCardText>
        <VCardActions class="d-flex justify-center">
          <VBtn text @click="dialog = false">Đóng</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VApp>
</template>
