<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="mx-auto" title="Thời gian check in">
          <template v-slot:prepend>
            <v-avatar color="primary">
              <v-icon icon="mdi-alarm"></v-icon>
            </v-avatar>
          </template>
          <template v-slot:append>
            <v-btn
              variant="text"
              icon="mdi-content-save-cog"
              color="error"
              @click="updateDefaultValue"
            ></v-btn>
          </template>
          <v-card-text>
            <p>Cho phép check in trước thời gian ca làm việc</p>

            <v-text-field
              v-model="dataTime.ValueName"
              label="Trước check in (phút)"
              prepend-inner-icon="mdi-clock-time-four-outline"
              suffix="Phút"
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { GetDefaultValue, UpdateDefaultValue } from "@/api/defaultValue";
export default {
  data() {
    return {
      dataTime: {},
    };
  },
  methods: {
    async getDefaultValue() {
      const res = await GetDefaultValue({ Table: "CheckInBefore", Search: "" });
      if (res.RespCode == 0) {
        this.dataTime = res.DefaultValueLst[0];
      }
    },
    async updateDefaultValue() {
      const res = await UpdateDefaultValue({
        DefaultValueInfo: this.dataTime,
      });
      if (res.RespCode == 0) {
        notify({
          type: "success",
          title: "Thành công",
          text: "Đăng ký chi nhánh thành công",
        });
      }
    },
  },
  created() {
    this.getDefaultValue();
  },
};
</script>

<style></style>
