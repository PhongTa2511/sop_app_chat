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
    <VCol lg="4" md="6" cols="12" v-for="item in 10" :key="item">
      <VCard>
        <div class="d-flex">
          <div class="pa-2">
            <VImg width="80" height="126" :src="eCommerce2" />
          </div>
          <div>
            <VCardActions
              class="justify-space-between"
              style="position: absolute; right: 0"
            >
              <div></div>
              <VBtn icon="bx-edit" />
            </VCardActions>
            <VCardTitle>Máy chấm công</VCardTitle>

            <VCardText>
              <div>Chi nhánh hà nội</div>
              <div>Cổng chính</div>
            </VCardText>

            <VCardText class="text-subtitle-1">
              <span>Seri: </span>
              <span class="font-weight-medium">8116233560469</span>
            </VCardText>
          </div>
        </div>
      </VCard>
    </VCol>
  </VRow>
</template>

<script>
import eCommerce2 from "@images/eCommerce/device1.png";
import {
  CreateDevice,
  UpdateDevice,
  DelDevice,
  GetDeviceLstByLabID,
} from "@/api/device";
export default {
  data() {
    return {
      eCommerce2: eCommerce2,
      deviceInfo: {},
    };
  },
  methods: {
    createDevice() {
      CreateDevice({
        Data: this.deviceInfo,
      }).then((res) => {});
    },
  },
};
</script>

<style></style>
