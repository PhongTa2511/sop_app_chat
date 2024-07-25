<script setup>
import { useTheme } from "vuetify";
import { hexToRgb } from "@layouts/utils";

const { global } = useTheme();
</script>
<script>
export default {
  mounted() {
    this.$signalR.on("notify", (message) => {
      this.message = message;
      alert(message);
    });
  },
  beforeUnmount() {
    this.$signalR.off("notify");
  },
};
</script>
<template>
  <VApp
    :style="`--v-global-theme-primary: ${hexToRgb(
      global.current.value.colors.primary
    )}`"
  >
    <RouterView />
  </VApp>
</template>
