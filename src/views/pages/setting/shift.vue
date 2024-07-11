<template>
  <div class="d-flex">
    <span>
      <v-select
        placeholder="Chọn chi nhánh"
        density="compact"
        style="width: 300px"
        class="mb-4 mr-2"
      ></v-select>
    </span>
    <span>
      <v-select
        placeholder="Chọn phòng ban"
        density="compact"
        style="width: 300px"
        class="mb-4 mr-2"
      ></v-select>
    </span>
    <v-btn variant="tonal" style="height: 40px">
      <v-icon> mdi-plus-thick </v-icon>
    </v-btn>
  </div>
  <VRow>
    <VCol cols="4" v-for="item in 10" :key="item">
      <VCard>
        <div class="d-flex flex-wrap flex-md-nowrap flex-column flex-md-row">
          <div class="pa-2">
            <!-- <VImg width="80" height="126" :src="eCommerce2" /> -->
            <v-icon size="80" color="warning">mdi-account-hard-hat</v-icon>
          </div>

          <!-- <VDivider :vertical="$vuetify.display.mdAndUp" /> -->

          <div>
            <VCardActions
              class="justify-space-between"
              style="position: absolute; right: 0"
            >
              <div></div>
              <VBtn icon="bx-edit" />
            </VCardActions>
            <VCardTitle>Ca 1</VCardTitle>

            <VCardText>
              <div>Chi nhánh hà nội</div>
              <div>Xương sản xuất</div>
            </VCardText>

            <VCardText class="text-subtitle-1">
              <span>Thời gian: </span>
              <span class="font-weight-medium">07:45 - 16:45</span>
            </VCardText>
          </div>
        </div>
      </VCard>
    </VCol>
  </VRow>
</template>

<script>
import eCommerce2 from "@images/eCommerce/device1.png";

export default {
  data() {
    return {
      eCommerce2: eCommerce2,
    };
  },
};
</script>

<style></style>
