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
        class="mb-4 mr-2"
      ></v-select>
    </span>
    <span>
      <v-select
        placeholder="Chọn phòng ban"
        density="compact"
        v-model="labSelect"
        :items="branchLabLst"
        item-value="LabID"
        item-title="LabName"
        chips
        class="mb-4 mr-2"
        style="width: 300px"
      ></v-select>
    </span>
    <v-btn variant="tonal" style="height: 40px" @click="btShowAddDevice">
      <v-icon> mdi-plus-thick </v-icon>
    </v-btn>
  </div>
  <VRow>
    <VCol lg="4" md="6" cols="12" v-for="item in deviceLst" :key="item">
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
              <VBtn
                icon="bx-trash"
                color="error"
                @click="btShowAddDelete(item)"
              />
            </VCardActions>
            <VCardTitle>Máy chấm công</VCardTitle>

            <VCardText>
              <div>Chi nhánh hà nội</div>
              <div>Cổng chính</div>
            </VCardText>

            <VCardText class="text-subtitle-1">
              <span>Seri: </span>
              <span class="font-weight-medium">{{ item.Seri }}</span>
            </VCardText>
          </div>
        </div>
      </VCard>
    </VCol>
  </VRow>
  <v-dialog v-model="isShowDevice" width="500">
    <v-card>
      <v-card-text>
        <v-icon> mdi-deskphone </v-icon>Thêm máy chấm công
      </v-card-text>
      <v-card-text>
        <VForm @submit.prevent="() => {}">
          <VRow>
            <!-- 👉 First Name -->
            <VCol cols="12">
              <v-select
                placeholder="Chọn chi nhánh"
                density="compact"
                v-model="deviceInfo.BranchID"
                :items="branchLst"
                item-value="BranchID"
                item-title="BranchName"
                chips
              ></v-select>
            </VCol>
            <VCol cols="12">
              <v-select
                placeholder="Chọn phòng ban"
                density="compact"
                v-model="deviceInfo.LabID"
                :items="branchLabLst"
                item-value="LabID"
                item-title="LabName"
                chips
              ></v-select>
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="deviceInfo.Seri"
                label="Seri máy chấm công"
                placeholder="Nhập seri máy chấm công"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="deviceInfo.Note"
                label="Ghi chú"
                placeholder="Nhập nhập ghi chú"
              />
            </VCol>
          </VRow>
        </VForm>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          text="Đóng"
          variant="plain"
          @click="isShowDevice = false"
        ></v-btn>

        <v-btn
          color="primary"
          text="Xác nhận"
          variant="tonal"
          @click="createDevice"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowDelete" width="500">
    <v-card>
      <v-card-text>
        <v-icon> mdi-delete </v-icon>

        Xóa máy chấm công
      </v-card-text>
      <v-card-text> Có chắc bạn muốn xóa máy chấm công này không? </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          text="Đóng"
          variant="plain"
          @click="isShowDelete = false"
        ></v-btn>

        <v-btn
          color="primary"
          text="Xác nhận"
          variant="tonal"
          @click="delDevice"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import eCommerce2 from "@images/eCommerce/device1.png";
import { CreateDevice, DelDevice, GetDeviceLstByLabID } from "@/api/device";
import { GetBranchLst, GetLabLstByBranch } from "@/api/branch";

export default {
  data() {
    return {
      eCommerce2: eCommerce2,
      deviceInfo: {},
      branchLst: [],
      branchSelect: "",
      labSelect: "",
      branchLabLst: [],
      isShowDevice: false,
      isShowDelete: false,
      deviceInfo: {},
      deviceLst: [],
      itemDel: {},
    };
  },
  watch: {
    branchSelect(value) {
      this.getLabLstByBranch(value);
    },
    "deviceInfo.BranchID"(value) {
      this.getLabLstByBranch(value);
    },
    labSelect() {
      this.getDeviceLstByLabID();
    },
  },
  methods: {
    delDevice() {
      DelDevice({
        Data: this.itemDel,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.isShowDelete = false;
          notify({
            type: "success",
            title: "Thành công",
            text: "Xóa máy chấm công thành công",
          });
          this.getDeviceLstByLabID();
        }
      });
    },
    btShowAddDelete(data) {
      this.isShowDelete = true;
      this.itemDel = data;
    },
    getDeviceLstByLabID() {
      GetDeviceLstByLabID({
        LabID: this.labSelect,
        Search: "",
        PageNumber: 1,
        RowspPage: 10000,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.deviceLst = res.Data.filter(
            (p) => p.TypeDevice == "Máy chấm công"
          );
        }
      });
    },
    btShowAddDevice(data) {
      this.isShowDevice = true;
      if (data) {
        this.deviceInfo = {
          ...data,
          BranchID: this.branchSelect,
        };
      } else {
        this.deviceInfo = {};
      }
    },
    createDevice() {
      CreateDevice({
        Data: {
          ...this.deviceInfo,
          TypeDevice: "Máy chấm công",
        },
      }).then((res) => {
        if (res.RespCode == 0) {
          this.isShowDevice = false;
          this.deviceInfo = {};
          notify({
            type: "success",
            title: "Thành công",
            text: "Thêm máy chấm công thành công",
          });
        }
      });
    },
    getBranchLst() {
      GetBranchLst({}).then((res) => {
        this.branchLst = res.Data.map((item, index) => {
          return {
            ...item,
            Key: index + 1,
          };
        });
        if (this.branchLst.length > 0) {
          this.branchSelect = this.branchLst[0].BranchID;
        }
      });
    },
    getLabLstByBranch(data) {
      GetLabLstByBranch({
        BranchID: data,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.branchLabLst = res.Data.map((item, index) => {
            return {
              ...item,
              Key: index + 1,
            };
          });
          if (this.branchLabLst.length > 0) {
            this.labSelect = this.branchLabLst[0].LabID;
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
