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
            v-model="branchSelect"
            :items="branchLst"
            item-value="BranchID"
            item-title="BranchName"
            chips
            style="width: 280px"
            class="mr-2"
          ></v-select>
          <v-select
            placeholder="Chọn năm"
            density="compact"
            v-model="yearSelect"
            :items="yearLst"
            item-value="value"
            item-title="value"
            chips
            style="width: 120px"
            class="mr-2"
          ></v-select>
          <v-select
            placeholder="Chọn tháng"
            density="compact"
            v-model="monthSelect"
            :items="monthLst"
            item-value="value"
            item-title="label"
            chips
            style="width: 150px"
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
                  <v-btn
                    class="mt-2"
                    variant="tonal"
                    color="primary"
                    block
                    :loading="isSelecting"
                    @click="onButtonClick"
                  >
                    Thêm file excel</v-btn
                  >
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
                    color="warning"
                    block
                    @click="btShowRegister"
                  >
                    Đăng ký lịch</v-btn
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
          <template v-slot:item.UnitPrice="{ item }">
            {{ new Intl.NumberFormat().format(item.raw.UnitPrice) }}
          </template>
          <template v-slot:item.Amount="{ item }">
            {{ new Intl.NumberFormat().format(item.raw.Amount) }}
          </template>
          <template v-slot:item.AmountVAT="{ item }">
            {{ new Intl.NumberFormat().format(item.raw.AmountVAT) }}
          </template>
        </v-data-table>
      </VCard>
    </VCol>
  </VRow>
</template>

<script>
import XLSX from "xlsx";
import { GetBranchLst } from "@/api/branch";
import { monthLst, yearLst } from "./components/default";
import { UpdateScheduleLst, GetScheduleLst } from "@/api/schedule";
import { GetShiftLst } from "@/api/shift";

export default {
  data() {
    return {
      isMenuSearch: false,
      desserts: [
        {
          name: "African Elephant",
          species: "Loxodonta africana",
          diet: "Herbivore",
          habitat: "Savanna, Forests",
        },
        // ... more items
      ],
      headers: [
        { title: "STT", sortable: false, key: "Key", align: "center" },
        { title: "Mã sp", key: "name", sortable: false, align: "center" },
        { title: "Sản phẩm", key: "species", sortable: false },
        { title: "SL", key: "diet", sortable: false, align: "center" },
        { title: "Giá", key: "habitat", sortable: false, align: "center" },
      ],
      isSelecting: false,
      branchLst: [],
      branchSelect: "",
      monthLst: monthLst,
      monthSelect: "",
      yearLst: yearLst,
      yearSelect: "",
      scheduleLst: [],
      dataUploadLst: [],
      isShowUpdateSchedule: false,
      scheduleInfo: {},
      shiftLst: [],
    };
  },
  watch: {
    branchSelect() {
      this.getScheduleLst();
      this.getShiftLst();
    },
  },
  methods: {
    getShiftLst() {
      GetShiftLst({ BranchID: this.branchSelect }).then((res) => {
        if (res.RespCode == 0) {
          this.shiftLst = res.Data;
        }
      });
    },
    btShowRegister() {
      this.isShowUpdateSchedule = true;
      this.scheduleInfo = {};
    },
    updateScheduleLst(data) {
      UpdateScheduleLst({
        BranchID: this.branchSelect,
        Data: data,
      }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            type: "success",
            title: "Thành công",
            text: "Cập nhật thông tin thành công",
          });
          this.isShowUpdateSchedule = false;
          this.getScheduleLst();
        }
      });
    },
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
          console.log("wwb", wb);
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
          console.table(data);
          this.dataUploadLst = this.convertToReq(data).map((item, index) => {
            return {
              ...item,
              Key: index + 1,
            };
          });
          // this.updateScheduleLst(this.dataUploadLst);
        };
        reader.readAsBinaryString(this.selectedFile);
      }
    },
    convertToReq(data) {
      var lstReq = [];
      for (var i = 3; i < data.length; i++) {
        if (data[i][1] && data[i][2] && data[i][4]) {
          for (var y = 16; y < 47; y++) {
            // var checkShift =
            var day = `0${y - 15}`.splice(-2);
            var req = {
              CodeID: data[i][1],
              FullName: data[i][2],
              Line: data[i][5],
              Pha: data[i][6],
              Job: data[i][7],
              Area: data[i][8],
              Date: `${this.yearSelect}-${this.yearSelect}-${day} 00:00:00`,
              AmountShow: new Intl.NumberFormat().format(data[i][4]),
              TimeApply:
                formatDateUpload(excelDateToJSDate(data[i][5])) + " 00:00:00",
              TimeApplyShow: formatDateUpload(excelDateToJSDate(data[i][5])),
              Note: data[i][6],
            };
            lstReq.push(req);
          }
        }
      }
      return lstReq;
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
    getScheduleLst() {
      GetScheduleLst({
        BranchID: this.branchSelect,
        Month: parseInt(this.monthSelect),
        Year: parseInt(this.yearSelect),
      }).then((res) => {
        if (res.RespCode == 0) {
          this.scheduleLst = res.Data;
        }
      });
    },
  },
  created() {
    var now = new Date().getMonth() + 1;
    this.monthSelect = `0${now}`.slice(-2);
    this.yearSelect = `${new Date().getFullYear()}`;
    this.getBranchLst();
  },
};
</script>

<style></style>
