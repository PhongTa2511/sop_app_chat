<template>
  <div class="d-flex">
    <span>
      <v-select
        placeholder="Chọn chi nhánh"
        density="compact"
        v-model="branchSelect"
        :items="branchLst"
        item-value="BranchID"
        item-title="BranchName"
        chips
        style="width: 300px"
        class="mr-2 mb-2"
      ></v-select>
    </span>
    <v-btn variant="tonal" style="height: 40px" @click="btShowUpdateShift">
      <v-icon> mdi-plus-thick </v-icon>
    </v-btn>
  </div>
  <VRow>
    <VCol cols="4" v-for="(item, index) in shiftLst" :key="index">
      <VCard>
        <div class="d-flex flex-wrap flex-md-nowrap flex-column flex-md-row">
          <div class="pa-2">
            <v-icon size="80" color="warning">mdi-account-hard-hat</v-icon>
          </div>

          <!-- <VDivider :vertical="$vuetify.display.mdAndUp" /> -->

          <div>
            <VCardActions
              class="justify-space-between"
              style="position: absolute; right: 0"
            >
              <div></div>
              <VBtn icon="bx-trash" color="error" />
            </VCardActions>
            <VCardTitle>{{ item.ShiftName }}</VCardTitle>

            <!-- <VCardText>
              <div>Chi nhánh hà nội</div>
              <div>Xương sản xuất</div>
            </VCardText> -->

            <VCardText class="text-subtitle-1">
              <span>Thời gian: </span>
              <span class="font-weight-medium"
                >{{ item.TimeStart }} - {{ item.TimeEnd }}</span
              >
            </VCardText>
          </div>
        </div>
      </VCard>
    </VCol>
  </VRow>
  <v-dialog v-model="isShowUpdateShift" width="500">
    <v-card>
      <v-card-text>
        <v-icon> mdi-briefcase </v-icon>Thông tin ca làm việc
      </v-card-text>
      <v-card-text>
        <VForm>
          <VRow>
            <!-- 👉 First Name -->

            <VCol cols="12">
              <VTextField
                v-model="shiftInfo.ShiftName"
                label="Tên ca làm việc"
                placeholder="Nhập tên ca làm việc"
              />
            </VCol>
            <VCol cols="12">
              <v-text-field
                v-model="shiftInfo.TimeStart"
                :active="menu1"
                :focus="menu1"
                label="Bắt đầu"
                readonly
              >
                <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  activator="parent"
                  transition="scale-transition"
                >
                  <v-time-picker
                    v-if="menu1"
                    v-model="shiftInfo.TimeStart"
                    format="24hr"
                    title="Lựa chọn thời gian bắt đầu"
                  ></v-time-picker>
                </v-menu>
              </v-text-field>
            </VCol>
            <VCol cols="12">
              <v-text-field
                v-model="shiftInfo.TimeEnd"
                :active="menu2"
                :focus="menu2"
                label="Kết thúc"
                readonly
              >
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  activator="parent"
                  transition="scale-transition"
                >
                  <v-time-picker
                    v-if="menu2"
                    v-model="shiftInfo.TimeEnd"
                    full-width
                    format="24hr"
                    title="Lựa chọn thời gian kết thúc"
                  ></v-time-picker>
                </v-menu>
              </v-text-field>
            </VCol>

            <v-col cols="12" v-if="shiftInfo.Status">
              <v-chip-group
                v-model="shiftInfo.Status"
                selected-class="text-primary"
                column
              >
                <v-chip
                  v-for="(item, index) in tags"
                  :key="index"
                  :text="item.text"
                  :value="item.value"
                >
                </v-chip>
              </v-chip-group>
            </v-col>
          </VRow>
        </VForm>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          text="Đóng"
          variant="plain"
          @click="isShowUpdateShift = false"
        ></v-btn>

        <v-btn
          color="primary"
          text="Xác nhận"
          variant="tonal"
          @click="updateShiftLst"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { UpdateShiftLst, GetShiftLst } from "@/api/shift";
import { GetBranchLst } from "@/api/branch";

export default {
  data() {
    return {
      shiftLst: [],
      shiftInfo: {},
      isShowUpdateShift: false,
      branchSelect: "",
      branchLst: [],
      menu1: false,
      menu2: false,
    };
  },
  watch: {
    branchSelect() {
      this.getShiftLst();
    },
  },
  methods: {
    btShowUpdateShift() {
      this.isShowUpdateShift = true;
      this.shiftInfo = {};
    },
    updateShiftLst() {
      UpdateShiftLst({
        BranchID: this.branchSelect,
        Data: [{ ...this.shiftInfo }],
      }).then((res) => {
        if (res.RespCode == 0) {
          this.isShowUpdateShift = false;
          this.getShiftLst();
          notify({
            type: "success",
            title: "Thành công",
            text: "Cập nhật thông tin thành công",
          });
        }
      });
    },
    getShiftLst() {
      GetShiftLst({ BranchID: this.branchSelect }).then((res) => {
        if (res.RespCode == 0) {
          this.shiftLst = res.Data;
        }
      });
    },
    getBranchLst() {
      GetBranchLst({}).then((res) => {
        if (res.RespCode == 0) {
          this.branchLst = res.Data;
          if (this.branchLst.length > 0) {
            this.branchSelect = this.branchLst[0].BranchID;
          }
        }
      });
    },
  },
  created() {
    this.getBranchLst();
  },
};
</script>

<style></style>
