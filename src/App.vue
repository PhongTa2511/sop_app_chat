<script setup>
import { ref } from "vue";
import { useTheme } from "vuetify";
import { hexToRgb } from "@layouts/utils";
import { getDoc, onSnapshot, doc } from "firebase/firestore";
import { reloadPage, notiAll, sendNoti } from "./firebase";

// Vuetify theme
const { global } = useTheme();

// Firestore listener for reloadPage collection
onSnapshot(reloadPage, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "modified") {
      location.reload();
    }
  });
});

// Notification example (adjusted for modular SDK)
const noti = ref(null);
const isShowNotiAll = ref(false);

// State for dialog
const dialog = ref(false);
const notification = ref({ content: "", title: "", type: 0 });

// Function to open dialog
const showNotification = (data) => {
  notification.value = data;
  dialog.value = true;
};

// Update onSnapshot for sendNoti
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
      global.current.value.colors.primary
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
