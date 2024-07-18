<template>
  <div>
    <div class="d-flex mb-4">
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
      <!-- <span>
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
      </span> -->
    </div>
    <v-sheet>
      <v-calendar
        ref="calendar"
        :events="events"
        :view-mode="type"
        :weekdays="weekday"
        lang="vi"
        :hide-header="true"
        :month="parseInt(monthSelect) - 1"
        :year="parseInt(yearSelect)"
      ></v-calendar>
    </v-sheet>
  </div>
</template>

<script>
import { GetScheduleLst } from "@/api/schedule";
import { GetBranchLst } from "@/api/branch";
import { monthLst, yearLst } from "./components/default";
import { GetShiftLst } from "@/api/shift";

export default {
  data: () => ({
    type: "month",
    types: ["month", "week", "day"],
    weekday: [0, 1, 2, 3, 4, 5, 6],

    value: [new Date()],
    events: [],
    colors: [
      "success",
      "warning",
      "error",
      "primary",
      "green",
      "orange",
      "grey darken-1",
    ],
    monthSelect: "",
    yearSelect: "2024",
    branchSelect: "",
    monthLst: monthLst,
    yearLst: yearLst,
    shiftLst: [],
    branchLst: [],
    isMenuSearch: false,
  }),
  // mounted() {
  //   const adapter = useDate();
  //   this.getEvents({
  //     start: adapter.startOfDay(adapter.startOfMonth(new Date())),
  //     end: adapter.endOfDay(adapter.endOfMonth(new Date())),
  //   });
  // },
  watch: {
    branchSelect() {
      this.getScheduleLst();
      this.getShiftLst();
    },
    yearSelect() {
      this.getScheduleLst();
    },
    monthSelect() {
      this.getScheduleLst();
    },
  },
  methods: {
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
          this.scheduleLst = res.Data.map((item, index) => {
            return {
              ...item,
              Key: index + 1,
            };
          });
          this.getEvents(this.scheduleLst);
        }
      });
    },
    getEvents(data) {
      var eventCount = this.daysInMonth(this.monthSelect, this.yearSelect);
      var events = [];
      for (let i = 1; i <= eventCount; i++) {
        var dataDay = data.filter((p) => new Date(p.Date).getDate() == i);
        this.shiftLst.forEach((item, index) => {
          var shift = dataDay.filter((p) => p.ShiftID == item.ShiftID);
          if (shift.length > 0) {
            events.push({
              title: shift[0].ShiftName + " - Tổng: " + shift.length,
              start: new Date(shift[0].Date),
              end: new Date(shift[0].Date),
              color: this.colors[index],
              Data: shift,
            });
          }
        });
      }

      this.events = events;
    },
    daysInMonth(month, year) {
      return new Date(year, month, 0).getDate();
    },
    getShiftLst() {
      GetShiftLst({ BranchID: this.branchSelect }).then((res) => {
        if (res.RespCode == 0) {
          this.shiftLst = res.Data;
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
