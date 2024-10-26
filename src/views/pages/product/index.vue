<template>
  <v-row>
    <v-col :lg="8" :cols="12">
      <!-- <v-select placeholder="Chọn máy chấm công"></v-select> -->
      <v-card>
        <VCardItem>
          <v-row>
            <v-col :lg="4" :cols="12">
              <v-select
                placeholder="Chọn chi nhánh"
                density="compact"
                v-model="branchSelect"
                :items="branchLst"
                item-value="BranchID"
                item-title="BranchName"
                chips
              ></v-select
            ></v-col>
            <v-col :lg="4" :cols="12">
              <v-select
                placeholder="Chọn phòng ban"
                density="compact"
                v-model="labSelect"
                :items="branchLabLst"
                item-value="LabID"
                item-title="LabName"
                chips
              ></v-select
            ></v-col>
            <v-col :lg="4" :cols="12">
              <v-select
                placeholder="Chọn máy chấm công"
                density="compact"
                v-model="seri"
                :items="deviceLst"
                item-value="Seri"
                item-title="Note"
                chips
              ></v-select
            ></v-col>
          </v-row>

          <div style="line-height: 48px; margin-bottom: 8px">
            Checkin gần nhất
          </div>
          <CardSolid :dataLst="dataLst" />
        </VCardItem>
      </v-card>

      <VCard class="mt-6">
        <VCardItem>
          <VCardTitle class="mb-4">Thống kê trong ngày</VCardTitle>
          <v-row>
            <v-col :cols="4">
              <v-card color="rgba(var(--v-theme-green-bg),.4)" class="py-4">
                <div class="d-flex flex-column align-center justify-center">
                  <p>
                    <span class="text-h2 font-weight-medium">{{
                      items.length
                    }}</span>
                  </p>

                  <p class="text-h5">Đúng Giờ</p>
                </div>
              </v-card>
            </v-col>
            <v-col :cols="4">
              <v-card color="rgba(var(--v-theme-red-bg),.4)" class="py-4">
                <div class="d-flex flex-column align-center justify-center">
                  <p>
                    <span class="text-h2 font-weight-medium">0</span>
                  </p>

                  <p class="text-h5">Quá Giờ</p>
                </div>
              </v-card>
            </v-col>
            <v-col :cols="4">
              <v-card color="rgba(var(--v-theme-blue-bg),.4)" class="py-4">
                <div class="d-flex flex-column align-center justify-center">
                  <p>
                    <span class="text-h2 font-weight-medium">0</span>
                  </p>

                  <p class="text-h5">Chưa Đến</p>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </VCardItem>
      </VCard>
    </v-col>
    <v-col :lg="4" :cols="12">
      <v-card>
        <v-card-title class="mt-3">Danh sách checkin</v-card-title>

        <v-list
          lines="two"
          height="calc(100vh - 230px)"
          style="overflow-y: scroll"
        >
          <v-list-item v-for="item in items" :key="item.title" link>
            <template v-slot:prepend>
              <v-avatar>
                <v-img
                  alt="John"
                  :src="item.ImageAvatar"
                  v-if="item.ImageAvatar"
                ></v-img>
                <div v-else class="default-avatar">
                  <div v-if="item.FullName">
                    {{ item.FullName[0].toUpperCase() }}
                  </div>
                  <div v-else>R</div>
                </div>
              </v-avatar>
            </template>

            <v-list-item-title>{{ item.FullName }}</v-list-item-title>

            <v-list-item-subtitle>{{ item.TimeShow }}</v-list-item-subtitle>

            <template v-slot:append>
              <v-list-item-action>
                <v-btn
                  v-if="item.Status == 1"
                  color="success"
                  icon="mdi-check-circle-outline"
                  variant="text"
                ></v-btn>
                <v-btn
                  v-else
                  color="error"
                  icon="mdi-alert-circle"
                  variant="text"
                ></v-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import CardSolid from "../cards/card-basic/CardSolid.vue";
import { GetBranchLst, GetLabLstByBranch } from "@/api/branch";
import { GetDeviceLstByLabID } from "@/api/device";
import { GetAttendanceLstByTime } from "@/api/attendance";
import { formatDateUpload, formatDate2 } from "@/helpers/getTime";
export default {
  components: {
    CardSolid,
  },
  data() {
    return {
      items: [],
      branchLst: [],
      branchSelect: "",
      labSelect: "",
      branchLabLst: [],
      deviceLst: [],
      seri: "",
      dataLst: [],
    };
  },
  watch: {
    branchSelect(data) {
      this.getLabLstByBranch(data);
    },
    labSelect(data) {
      this.getDeviceLstByLabID(data);
    },
    seri(data) {
      this.getAttendanceLstByTime();
    },
  },
  methods: {
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
          if (this.deviceLst.length > 0) {
            this.seri = this.deviceLst[0].Seri;
          }
        }
      });
    },
    getAttendanceLstByTime() {
      GetAttendanceLstByTime({
        DeviceID: this.seri,
        Time: formatDateUpload(new Date()) + " 00:00:00",
        // Time: "2024-07-11 00:00:00",
      }).then((res) => {
        if (res.RespCode == 0) {
          this.dataLst = [];
          this.items = res.Data.map((item, index) => {
            if (index < 4) {
              this.dataLst.push(item);
            }
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
        }
      });
    },
  },

  created() {
    this.getBranchLst();
  },
};
</script>

<style>
.custom {
  color: #71dd374d;
}
.default-avatar {
  background: rgba(var(--v-theme-primary), 0.2);
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: rgba(var(--v-theme-primary));
}
</style>
