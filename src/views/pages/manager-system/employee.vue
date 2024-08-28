<template>
  <VRow>
    <VCol cols="12">
      <!-- 👉 Deactivate Account -->
      <div class="d-flex justify-space-between mb-3">
        <div style="line-height: 30px">TẤT CẢ NHÂN VIÊN</div>
        <div class="d-flex">
          <v-select
            placeholder="Chọn chi nhánh"
            density="compact"
            v-model="branchID"
            :items="branchLst"
            item-value="BranchID"
            item-title="BranchName"
            chips
            style="width: 300px"
            class="mr-2"
          ></v-select>

          <span>
            <v-menu
              v-model="isMenuSearch"
              activator="parent"
              transition="slide-y-transition"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  color="primary"
                  variant="tonal"
                  style="height: 40px"
                  class="mr-1"
                  v-bind="props"
                  ><v-icon> mdi-account-plus </v-icon>
                </v-btn>
              </template>
              <v-card width="300">
                <v-card-text>
                  <!-- <v-btn
                    class="mt-2"
                    variant="tonal"
                    color="primary"
                    block
                    :loading="loadding"
                    @click="searchHistoryUser"
                  >
                    Thêm file excel</v-btn
                  > -->
                  <v-btn
                    color="primary"
                    variant="tonal"
                    block
                    :loading="isSelecting"
                    @click="onButtonClick"
                  >
                    Thêm file excel
                  </v-btn>
                  <input
                    ref="uploader"
                    class="d-none"
                    type="file"
                    accept=".xls, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    @change="onFileChanged"
                  />
                  <v-btn
                    class="mt-2"
                    variant="tonal"
                    color="primary"
                    block
                    @click="btShowUpdateUser"
                  >
                    Thêm nhân viên</v-btn
                  >
                </v-card-text>
              </v-card>
            </v-menu>
          </span>
        </div>
      </div>
      <VCard>
        <v-data-table
          :items-length="desserts.length"
          no-data-text="Không có dữ liệu"
          :headers="headers"
          :items="desserts"
          items-per-page-text="Số dòng 1 trang"
          sort-asc-icon="mdi-menu-up"
          sort-desc-icon="mdi-menu-down"
          height="calc(100vh - 210px)"
        >
          <template v-slot:item.FullName="{ item }">
            {{ item.FullName }}
            <v-chip variant="text" color="success" v-if="item.VIP == 1"
              >VIP</v-chip
            >
          </template>
          <template v-slot:item.Actions="{ item }">
            <div class="d-flex">
              <v-btn
                size="x-small"
                icon="mdi-pencil"
                variant="tonal"
                @click="btShowUpdateUser(item)"
              ></v-btn>
              <v-btn
                size="x-small"
                icon="mdi-delete"
                variant="tonal"
                @click="btSelectBranchLab(item)"
              ></v-btn>
            </div>
          </template>
        </v-data-table>
      </VCard>
    </VCol>
  </VRow>
  <v-dialog v-model="isShowUpdateUserLab" width="500">
    <v-card>
      <v-card-text class="d-flex">
        <v-icon class="mr-2"> mdi-user-group </v-icon>
        <h2 class="text-h6 mb-2">Thêm nhân viên</h2>
      </v-card-text>
      <v-card-text>
        <VForm @submit.prevent="() => {}">
          <VRow>
            <!-- 👉 First Name -->
            <VCol cols="12">
              <v-select
                placeholder="Chọn chi nhánh"
                density="compact"
                v-model="userInfo.BranchID"
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
                v-model="userInfo.LabID"
                :items="branchLabLst"
                item-value="LabID"
                item-title="LabName"
                chips
              ></v-select>
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="userInfo.FullName"
                label="Tên nhân viên"
                placeholder="Nhập tên nhân viên"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="userInfo.Phone"
                label="Số điện thoại"
                placeholder="Nhập số điện thoại"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="userInfo.Email"
                label="Email"
                placeholder="Nhập Email"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="userInfo.GroupName"
                label="Nhóm"
                placeholder="Nhập tên nhóm"
              />
            </VCol>
            <v-col cols="12" v-if="userInfo.Status">
              <h2 class="text-h6 mb-2">Trạng thái làm việc</h2>
              <v-chip-group
                v-model="userInfo.Status"
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
            <v-col cols="12" v-if="userInfo.Status">
              <h2 class="text-h6 mb-2">Loại người dùng</h2>
              <v-chip-group
                v-model="userInfo.VIP"
                selected-class="text-primary"
                column
              >
                <v-chip
                  v-for="(item, index) in typeUsers"
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
          @click="isShowUpdateUserLab = false"
        ></v-btn>

        <v-btn
          color="primary"
          text="Xác nhận"
          variant="tonal"
          @click="addEmployeeLst"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { GetEmployeeLst, AddEmployeeLst } from "@/api/user";
import { GetBranchLst, GetLabLstByBranch } from "@/api/branch";
import XLSX from "xlsx";

export default {
  data() {
    return {
      isMenuSearch: false,
      desserts: [],
      headers: [
        { title: "STT", sortable: false, key: "Key", align: "center" },
        { title: "Mã NV", key: "CodeID", sortable: false, align: "center" },
        { title: "Họ & tên", key: "FullName", sortable: false },
        { title: "Điện thoại", key: "Phone", sortable: false, align: "center" },
        { title: "Email", key: "Email", sortable: false, align: "center" },
        { title: "Nhóm", key: "GroupName", sortable: false, align: "center" },
        {
          title: "Phòng ban",
          key: "LabName",
          sortable: false,
          align: "center",
        },
        {
          title: "",
          key: "Actions",
          sortable: false,
          align: "center",
          width: 100,
        },
      ],
      branchLst: [],
      branchID: null,
      isShowUpdateUserLab: false,
      userInfo: {},
      tags: [
        { text: "Đang làm", value: 1 },
        { text: "Nghỉ TS", value: -1 },
        { text: "Nghỉ việc", value: 0 },
      ],
      typeUsers: [
        { text: "VIP", value: 1 },
        { text: "Thường", value: 0 },
      ],
      isSelecting: false,
      selectedFile: null,
      addUserLst: [],
    };
  },
  watch: {
    branchID(data) {
      this.getEmployeeLst();
      this.getLabLstByBranch(data);
    },
    "userInfo.BranchID"(data) {
      this.getLabLstByBranch(data);
    },
  },
  methods: {
    onButtonClick() {
      this.isSelecting = true;
      window.addEventListener(
        "focus",
        () => {
          this.isSelecting = false;
        },
        { once: true }
      );

      this.$refs.uploader.click();
    },
    onFileChanged(e) {
      this.selectedFile = e.target.files[0];
      console.log(this.selectedFile);
      // do something
      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
          console.table(data);
          this.addUserLst = this.convertToReq(data).map((item, index) => {
            return {
              ...item,
              Key: index + 1,
            };
          });
        };
        reader.readAsBinaryString(this.selectedFile);
      }
    },
    convertToReq(data) {
      var lstReq = [];
      for (var i = 3; i < data.length; i++) {
        if (data[i][1] && data[i][2] && data[i][4]) {
          var req = {
            CodeID: data[i][1],
            FullName: data[i][2],
            GroupName: data[i][4],
            Amount: parseInt(data[i][4]),
            AmountShow: new Intl.NumberFormat().format(data[i][4]),
            TimeApply:
              formatDateUpload(excelDateToJSDate(data[i][5])) + " 00:00:00",
            TimeApplyShow: formatDateUpload(excelDateToJSDate(data[i][5])),
            Note: data[i][6],
          };
          lstReq.push(req);
        }
      }
      return lstReq;
    },
    addEmployeeLst() {
      AddEmployeeLst({
        BranchID: this.branchID,
        Data: [{ ...this.userInfo }],
      }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            type: "success",
            title: "Thành công",
            text: "Cập nhật thông tin thành công",
          });
          this.isShowUpdateUserLab = false;
          this.getEmployeeLst();
        }
      });
    },
    btShowUpdateUser(data) {
      this.isShowUpdateUserLab = true;
      if (data) {
        this.userInfo = data;
      } else {
        this.userInfo = {};
      }
    },
    getEmployeeLst() {
      GetEmployeeLst({
        BranchID: this.branchID,
        Search: "",
        PageNumber: 1,
        RowspPage: 10000,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.desserts = res.Data.map((item, index) => {
            return {
              ...item,
              Key: index + 1,
            };
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
          this.branchID = this.branchLst[0].BranchID;
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
