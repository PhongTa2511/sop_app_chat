<template>
  <VRow>
    <VCol cols="12">
      <!-- 👉 Deactivate Account -->
      <div class="d-flex justify-space-between mb-3">
        <div style="line-height: 30px">
          <v-select
            placeholder="Chọn chi nhánh"
            density="compact"
            v-model="branchSelect"
            :items="branchLst"
            item-value="BranchID"
            item-title="BranchName"
            chips
            style="width: 250px"
            class="mr-2"
          ></v-select>
        </div>
        <div class="d-flex">
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
          <v-select
            placeholder="Chọn ngày"
            density="compact"
            v-model="daySelect"
            :items="dayLst"
            item-value="value"
            item-title="title"
            chips
            style="width: 150px"
            class="mr-2"
          ></v-select>
          <v-text-field
            density="compact"
            label="Tìm kiếm"
            single-line
            style="width: 180px"
            class="mr-2"
            v-model="searchSchedule"
          ></v-text-field>

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
                    color="primary"
                    block
                    @click="btShowUpdateSchedule"
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
          :items-length="scheduleLst.length"
          no-data-text="Không có dữ liệu"
          :headers="headers"
          :items="scheduleLst"
          items-per-page-text="Số dòng 1 trang"
          sort-asc-icon="mdi-menu-up"
          sort-desc-icon="mdi-menu-down"
          height="calc(100vh - 210px)"
        >
          <template v-slot:item.Actions="{ item }">
            <v-icon
              color="error"
              class="me-2"
              size="small"
              style="cursor: pointer"
              @click="deleteSchedule(item)"
              >mdi-delete</v-icon
            >
          </template>
        </v-data-table>
      </VCard>
    </VCol>
  </VRow>
  <v-dialog v-model="isShowUpdateSchedule" width="500">
    <v-card>
      <v-card-text>
        <v-icon> mdi-briefcase </v-icon>Thông tin ca làm việc
      </v-card-text>
      <v-card-text>
        <VForm>
          <VRow>
            <VCol cols="12">
              <v-combobox
                placeholder="Chọn nhân viên"
                density="compact"
                v-model="scheduleInfo.CodeID"
                :items="employeeLst"
                item-value="CodeID"
                item-title="FullName"
                chips
                class="mr-2"
                clearable
                :item-children="true"
              ></v-combobox>
            </VCol>
            <VCol cols="6">
              <v-date-input
                v-model="scheduleInfo.Date"
                label="Chọn ngày làm việc"
                density="compact"
                prepend-icon=""
                variant="outlined"
                persistent-placeholder
                hide-details
                :border="true"
                :center-affix="true"
                :hide-actions="true"
                lang="vi"
              ></v-date-input>
            </VCol>
            <VCol cols="6">
              <v-select
                placeholder="Chọn ca làm việc"
                density="compact"
                v-model="scheduleInfo.ShiftID"
                :items="shiftLst"
                item-value="ShiftID"
                item-title="ShiftName"
                class="mr-2"
              ></v-select>
              <!-- <VTextField
                v-model="scheduleInfo.ShiftName"
                label="Tên ca làm việc"
                placeholder="Nhập tên ca làm việc"
              /> -->
            </VCol>

            <VCol cols="6">
              <v-text-field
                v-model="scheduleInfo.TimeStart"
                :active="menuTimeStart"
                :focus="menuTimeStart"
                label="Bắt đầu"
                prepend-inner-icon="mdi-clock-time-four-outline"
                readonly
                clearable
              >
                <v-menu
                  v-model="menuTimeStart"
                  :close-on-content-click="false"
                  activator="parent"
                  transition="scale-transition"
                >
                  <v-time-picker
                    format="24hr"
                    v-if="menuTimeStart"
                    v-model="scheduleInfo.TimeStart"
                    full-width
                  ></v-time-picker>
                </v-menu>
              </v-text-field>
            </VCol>
            <VCol cols="6">
              <v-text-field
                v-model="scheduleInfo.TimeEnd"
                :active="menuTimeEnd"
                :focus="menuTimeEnd"
                label="Kết thúc"
                prepend-inner-icon="mdi-clock-time-four-outline"
                readonly
                clearable
              >
                <v-menu
                  v-model="menuTimeEnd"
                  :close-on-content-click="false"
                  activator="parent"
                  transition="scale-transition"
                >
                  <v-time-picker
                    format="24hr"
                    v-if="menuTimeEnd"
                    v-model="scheduleInfo.TimeEnd"
                    full-width
                  ></v-time-picker>
                </v-menu>
              </v-text-field>
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="scheduleInfo.Line"
                label="BD"
                placeholder="Nhập BD"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="scheduleInfo.Pha"
                label="Phòng"
                placeholder="Nhập phòng"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="scheduleInfo.Job"
                label="CV chính"
                placeholder="Nhập cv chính"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="scheduleInfo.Area"
                label="Nhóm"
                placeholder="Nhập nhóm"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="scheduleInfo.WorkMore"
                label="Làm thêm"
                placeholder="Nhập thông tin"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="scheduleInfo.Note"
                label="Ghi chú"
                placeholder="Nhập ghi chú"
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
          @click="isShowUpdateSchedule = false"
        ></v-btn>

        <v-btn
          color="primary"
          text="Xác nhận"
          variant="tonal"
          @click="
            updateScheduleLst([
              {
                ...this.scheduleInfo,
                ...this.scheduleInfo.CodeID,
              },
            ])
          "
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isLoading" max-width="320" persistent>
    <v-list class="py-2" color="primary" elevation="12" rounded="lg">
      <v-list-item prepend-icon="$vuetify-outline" title="Đang tải dữ liệu...">
        <template v-slot:prepend>
          <div class="pe-4">
            <img src="@/assets/images/logo-box.png" alt="" height="36" />
          </div>
        </template>

        <template v-slot:append>
          <v-progress-circular
            color="primary"
            indeterminate="disable-shrink"
            size="16"
            width="2"
          ></v-progress-circular>
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>
</template>

<script>
import XLSX from "xlsx";
import { GetBranchLst } from "@/api/branch";
import { monthLst, yearLst } from "./components/default";
import { UpdateScheduleLst, GetScheduleLst } from "@/api/schedule";
import { GetShiftLst } from "@/api/shift";
import {
  formatDateDisplayDDMMYY,
  formatDateUpload,
  formatDateHHMM,
} from "@/helpers/getTime";
import { GetEmployeeLst } from "@/api/user";
import { debounce } from "lodash";
import { excelDateToJSDate } from "./components/default";

export default {
  data() {
    return {
      isMenuSearch: false,
      menuTimeStart: false,
      menuTimeEnd: false,
      headers: [
        { title: "STT", sortable: false, key: "Key", align: "center" },
        { title: "Mã NV", key: "CodeID", sortable: false, align: "center" },
        { title: "Họ tên", key: "FullName", sortable: false },
        { title: "BD", key: "Line", sortable: false, align: "center" },
        { title: "Phòng", key: "Pha", sortable: false, align: "center" },
        { title: "CV chính", key: "Job", sortable: false, align: "center" },
        { title: "Phòng", key: "Area", sortable: false, align: "center" },
        {
          title: "Làm thêm",
          key: "WorkMore",
          sortable: false,
          align: "center",
        },
        { title: "Ngày", key: "DateShow", sortable: false, align: "center" },
        { title: "Ca", key: "ShiftName", sortable: false, align: "center" },
        {
          title: "Bắt đầu",
          key: "TimeStart",
          sortable: false,
          align: "center",
        },
        { title: "Kết thúc", key: "TimeEnd", sortable: false, align: "center" },
        { title: "Ghi chú", key: "Note", sortable: false, align: "center" },
        { title: "Ac", key: "Actions", sortable: false, align: "center" },
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
      isLoading: false,
      dayLst: [],
      daySelect: null,
      searchSchedule: "",
      isShowUpdateSchedule: false,
      scheduleInfo: {},
      employeeLst: [],
    };
  },
  watch: {
    branchSelect() {
      this.getScheduleLst();
      this.getShiftLst();
      this.getEmployeeLst();
    },
    yearSelect() {
      this.getScheduleLst();
      this.updateDayLst();
    },
    monthSelect() {
      this.getScheduleLst();
      this.updateDayLst();
    },
    daySelect() {
      this.getScheduleLst();
    },
    searchSchedule() {
      this.debounceSchedule();
    },
    "scheduleInfo.ShiftID"(value) {
      this.scheduleInfo.TimeStart = this.shiftLst.find(
        (p) => p.ShiftID == value
      ).TimeStart;
      this.scheduleInfo.TimeEnd = this.shiftLst.find(
        (p) => p.ShiftID == value
      ).TimeEnd;
    },
  },
  methods: {
    getEmployeeLst() {
      GetEmployeeLst({
        BranchID: this.branchSelect,
        Search: this.searchSchedule,
        PageNumber: 1,
        RowspPage: 10000,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.employeeLst = res.Data;
        }
      });
    },
    btShowUpdateSchedule() {
      this.isShowUpdateSchedule = true;
      this.scheduleInfo = {};
    },
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
    deleteSchedule(data) {
      this.updateScheduleLst([{ ...data, Status: 0 }]);
    },
    updateScheduleLst(data) {
      this.isLoading = true;
      UpdateScheduleLst({
        BranchID: this.branchSelect,
        Data: data.map((item) => {
          return { ...item, Date: formatDateUpload(item.Date) + " 00:00:00" };
        }),
      }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            type: "success",
            title: "Thành công",
            text: "Cập nhật thông tin thành công",
          });
          this.getScheduleLst();
        }
        this.isLoading = false;
        this.isShowUpdateSchedule = false;
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
          // console.table(this.dataUploadLst);
          // return;
          this.updateScheduleLst(this.dataUploadLst);
        };
        reader.readAsBinaryString(this.selectedFile);
      }
    },
    convertToReq(data) {
      var lstReq = [];
      for (var i = 2; i < data.length; i++) {
        if (data[i][1] && data[i][2] && data[i][4]) {
          var checkShift = this.shiftLst.find((p) => p.ShiftName == data[i][8]);

          if (checkShift) {
            var timeStart = formatDateHHMM(excelDateToJSDate(data[i][9]));
            var timeEnd = formatDateHHMM(excelDateToJSDate(data[i][10]));
            var req = {
              CodeID: data[i][1],
              FullName: data[i][2],
              Line: data[i][3],
              Area: data[i][4],
              Job: data[i][5],
              Pha: data[i][6],
              WorkMore: data[i][7],
              Date:
                `${this.yearSelect}-${this.monthSelect}-` +
                `0${this.daySelect}`.slice(-2) +
                ` 00:00:00`,
              ShiftID: checkShift.ShiftID,
              TimeStart: timeStart,
              TimeEnd: timeEnd,
              BranchID: this.branchSelect,
              Note: data[i][11],
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
        Day: this.daySelect,
        Search: this.searchSchedule,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.scheduleLst = res.Data.map((item, index) => {
            return {
              ...item,
              Key: index + 1,
              DateShow: formatDateDisplayDDMMYY(item.Date),
            };
          });
        }
      });
    },
    daysInMonth(month, year) {
      return new Date(year, month, 0).getDate();
    },
    updateDayLst() {
      var dayInMonth = this.daysInMonth(this.monthSelect, this.yearSelect);
      this.dayLst = Array.from({ length: dayInMonth }, (v, k) => ({
        value: k + 1,
        title: "Ngày " + (k + 1),
      }));
    },
  },
  created() {
    var now = new Date().getMonth() + 1;
    this.monthSelect = `0${now}`.slice(-2);
    this.yearSelect = `${new Date().getFullYear()}`;
    this.getBranchLst();
    this.debounceSchedule = debounce(this.getScheduleLst, 700);
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 678px) {
  .d-flex {
    display: block !important;
  }
}
</style>
