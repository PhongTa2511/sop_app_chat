<script setup>
import { useTheme } from "vuetify";
import illustrationJohnDark from "@images/cards/illustration-john-dark.png";
import illustrationJohnLight from "@images/cards/illustration-john-light.png";
import { getFullName } from "@/utils/auth";
import { ref } from "vue";

const { global } = useTheme();
const illustrationJohn = computed(() =>
  global.name.value === "dark" ? illustrationJohnDark : illustrationJohnLight
);

const openGuide = () => {
  window.open(
    "https://www.canva.com/design/DAGV2wlVNGM/GQlkdckxLdSTx_bzlUCSBw/view?utm_content=DAGV2wlVNGM&utm_campaign=designshare&utm_medium=link&utm_source=editor",
    "_blank"
  );
};
</script>

<template>
  <VCard class="text-center text-sm-start">
    <VRow no-gutters>
      <VCol cols="12" sm="8" order="2" order-sm="1">
        <VCardItem>
          <VCardTitle class="text-md-h5 text-primary">
            Xin chào {{ getFullName() }} 🎉
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <span>
            Chào mừng bạn đã đến với<br />
            Hệ thống quản lý hồ sơ DTP 🤩

            <!-- Check your new raising badge in your profile. -->
          </span>
          <br />
          <VBtn variant="tonal" class="mt-4" size="small" @click="openGuide">
            Xem hướng dẫn
          </VBtn>
        </VCardText>
      </VCol>

      <VCol cols="12" sm="4" order="1" order-sm="2" class="text-center">
        <img
          :src="illustrationJohn"
          :height="$vuetify.display.xs ? '150' : '175'"
          :class="$vuetify.display.xs ? 'mt-6 mb-n2' : 'position-absolute'"
          class="john-illustration flip-in-rtl"
        />
      </VCol>
    </VRow>
  </VCard>
</template>

<style lang="scss" scoped>
.john-illustration {
  inset-block-end: -0.0625rem;
  inset-inline-end: 3rem;
}
</style>
