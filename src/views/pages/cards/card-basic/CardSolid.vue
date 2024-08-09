<script setup>
import avatar1 from "@images/avatars/avatar-1.png";
import avatar4 from "@images/avatars/avatar-1.png";
import avatar8 from "@images/avatars/avatar-1.png";
import { formatDate2 } from "@/helpers/getTime";

import { defineProps } from "vue";

const props = defineProps({
  dataLst: Array,
});
var updateUI = 0;
var dataShowLst = [];
watch(
  () => props.dataLst,
  (newCount, oldCount) => {
    console.log(newCount);
    dataShowLst = newCount.map((item) => {
      return {
        ...item,
        TimeShow: formatDate2(item.AttTime),
        ImageAvatar: item.Avatar
          ? "http://202.191.56.172/LabManagerAPI/File/GetImageAvatar?UserID=" +
            item.UserID +
            "&FileName=" +
            item.Avatar
          : null,
      };
    });
    updateUI++;
  }
);
</script>

<template>
  <VRow :key="updateUI">
    <VCol
      v-for="(data, index) in dataShowLst"
      :key="index"
      cols="12"
      md="6"
      lg="6"
    >
      <VCard variant="tonal" class="pa-4">
        <v-row>
          <v-col :cols="4">
            <VImg
              :width="116"
              height="100%"
              :src="data.ImageAvatar"
              class="rounded"
              v-if="data.ImageAvatar"
            />
            <div v-else class="default-avatar text-h3">
              <div v-if="data.FullName">
                {{ data.FullName[0].toUpperCase() }}
              </div>
              <div v-else>R</div>
            </div>
          </v-col>
          <v-col :cols="8" style="margin-left: -12px">
            <div>{{ data.FullName }}</div>
            <div>Phòng IT</div>
            <div>{{ data.avatarName }}</div>
            <div
              class="d-flex align-center"
              style="margin-left: -10px; height: 24px"
            >
              <IconBtn icon="bx-time" />
              <span class="text-subtitle-2 me-2" style="white-space: nowrap">{{
                data.TimeShow
              }}</span>
            </div>
          </v-col>
        </v-row>
      </VCard>
    </VCol>
  </VRow>
</template>
<style lang="scss" scoped>
.default-avatar {
  background: rgba(var(--v-theme-primary), 0.2);
  width: 100%;
  height: 100%;
  color: rgba(var(--v-theme-primary));
  border-radius: 8px;
  aspect-ratio: 1 / 1;
  place-items: center;
  display: grid;
}
</style>
