<template>
  <div class="home-container">
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
    <div>
      <v-card>
        <div class="calender-all">
          <div class="calendar">
            <div>
              <div
                class="content"
                v-for="(item, index) in footerData"
                :key="index"
              >
                <div
                  class="line-header"
                  :class="index == 1 ? 'headerHighlight' : ''"
                >
                  {{ item.FullName }}
                </div>
              </div>
            </div>
            <div class="shift" ref="scrollable4">
              <div
                class="content"
                v-for="(item, index) in footerData"
                :key="index"
              >
                <div
                  style="display: flex"
                  :class="index == 1 ? 'headerHighlight' : ''"
                >
                  <div v-for="(num, inde) in 31" :key="num">
                    <div
                      class="line"
                      v-if="dayInMonth >= num"
                      :class="listT7CN.includes(num) ? 'highlight' : ''"
                      @click="btShowUserWork(num, index)"
                    >
                      <div
                        :class="
                          isWaning(
                            index,
                            inde,
                            item[`Day` + `0${num}`.slice(-2)]
                          )
                            ? 'warning'
                            : ''
                        "
                      >
                        {{ item[`Day` + `0${num}`.slice(-2)] }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div
                class="content"
                v-for="(item, index) in footerData"
                :key="index"
              >
                <div
                  v-if="index < 1"
                  class="line-header"
                  style="text-align: center"
                >
                  Thực tế
                </div>
                <div
                  v-if="index == 1"
                  class="line-header"
                  :class="index == 1 ? 'headerHighlight' : ''"
                  style="text-align: center"
                >
                  Tổng
                </div>
                <div
                  v-if="index > 1"
                  class="line-header"
                  style="text-align: center"
                >
                  {{ item.TotalShift }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card>
      <v-card class="mt-4">
        <div class="calender-all" :key="updateName">
          <div class="calendar">
            <div>
              <div
                class="content"
                v-for="(item, index) in listUserWork"
                :key="index"
              >
                <div
                  v-if="index <= 1"
                  class="line-header"
                  :class="index == 1 ? 'headerHighlight' : ''"
                >
                  {{ item.FullName }}
                </div>
              </div>
              <div class="box-height-name" ref="scrollable2">
                <div
                  class="content"
                  v-for="(item, index) in listUserWork"
                  :key="index"
                >
                  <div
                    v-if="index > 1"
                    class="line-header"
                    :class="index == 1 ? 'headerHighlight' : ''"
                    @click="delUserCalenderByID(item)"
                  >
                    <span :style="item.CheckMore == 1 ? 'color:red' : ''">
                      {{ item.FullName }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="shift2">
              <div class="weekday" ref="scrollable3">
                <div
                  class="content"
                  v-for="(item, index) in listUserWork"
                  :key="index"
                >
                  <div
                    v-if="index <= 1"
                    style="display: flex"
                    :class="index == 1 ? 'headerHighlight' : ''"
                  >
                    <div
                      v-for="intDay in 28"
                      :key="intDay"
                      class="line"
                      :class="listT7CN.includes(intDay) ? 'highlight' : ''"
                      @click="btShowUpdateDay(item, intDay)"
                    >
                      {{ item["Day" + `0${intDay}`.slice(-2)] }}
                    </div>
                    <div
                      class="line"
                      v-if="dayInMonth >= 29"
                      :class="listT7CN.includes(29) ? 'highlight' : ''"
                      @click="btShowUpdateDay(item, 29)"
                    >
                      {{ item.Day29 }}
                    </div>
                    <div
                      class="line"
                      v-if="dayInMonth >= 30"
                      :class="listT7CN.includes(30) ? 'highlight' : ''"
                      @click="btShowUpdateDay(item, 30)"
                    >
                      {{ item.Day30 }}
                    </div>
                    <div
                      class="line"
                      v-if="dayInMonth >= 31"
                      :class="listT7CN.includes(31) ? 'highlight' : ''"
                      @click="btShowUpdateDay(item, 31)"
                    >
                      {{ item.Day31 }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="box-height" ref="scrollable1">
                <div
                  class="content"
                  v-for="(item, index) in listUserWork"
                  :key="index"
                >
                  <div
                    v-if="index > 1"
                    style="display: flex"
                    :class="index == 1 ? 'headerHighlight' : ''"
                  >
                    <div
                      v-for="intDay in 28"
                      :key="intDay"
                      class="line"
                      :class="listT7CN.includes(intDay) ? 'highlight' : ''"
                      @click="btShowUpdateDay(item, intDay)"
                    >
                      {{ item["Day" + `0${intDay}`.slice(-2)] }}
                    </div>

                    <div
                      class="line"
                      v-if="dayInMonth >= 29"
                      :class="listT7CN.includes(29) ? 'highlight' : ''"
                      @click="btShowUpdateDay(item, 29)"
                    >
                      {{ item.Day29 }}
                    </div>
                    <div
                      class="line"
                      v-if="dayInMonth >= 30"
                      :class="listT7CN.includes(30) ? 'highlight' : ''"
                      @click="btShowUpdateDay(item, 30)"
                    >
                      {{ item.Day30 }}
                    </div>
                    <div
                      class="line"
                      v-if="dayInMonth >= 31"
                      :class="listT7CN.includes(31) ? 'highlight' : ''"
                      @click="btShowUpdateDay(item, 31)"
                    >
                      {{ item.Day31 }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div
                class="content"
                v-for="(item, index) in listUserWork"
                :key="index"
              >
                <div
                  v-if="index < 1"
                  class="line-header"
                  :class="index == 1 ? 'headerHighlight' : ''"
                  style="text-align: center"
                >
                  Ca thực tế
                </div>
                <div
                  v-if="index == 1"
                  class="line-header"
                  :class="index == 1 ? 'headerHighlight' : ''"
                  style="display: flex"
                >
                  <div class="line-total">C1</div>
                  <div class="line-total">C2</div>
                  <div class="line-total">C3</div>
                  <div class="line-total">LN</div>
                  <div class="line-total">T</div>
                </div>
              </div>
              <div class="box-height-name" ref="scrollable5">
                <div
                  class="content"
                  v-for="(item, index) in listUserWork"
                  :key="index"
                >
                  <div
                    v-if="index > 1"
                    class="line-header"
                    :class="index == 1 ? 'headerHighlight' : ''"
                    style="border-left: 1px solid #000"
                  >
                    <div
                      v-if="item.Office == 0"
                      style="display: flex; font-size: 14px; font-weight: 500px"
                    >
                      <div class="line-total">{{ item.TotalShift1 }}</div>
                      <div class="line-total">{{ item.TotalShift2 }}</div>
                      <div class="line-total">{{ item.TotalShift3 }}</div>
                      <div class="line-total">{{ item.VacaShow }}</div>
                      <div class="line-total">{{ item.NumberShift }}</div>
                    </div>
                    <div
                      v-else
                      style="display: flex; font-size: 14px; font-weight: 500px"
                    >
                      <div class="line-total">{{ item.TotalShift1 }}</div>
                      <div class="line-total">{{ item.TotalShift2 }}</div>
                      <div class="line-total">{{ item.TotalShift3 }}</div>
                      <div class="line-total">{{ item.VacaShow }}</div>
                      <div class="line-total">{{ item.NumberShift }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import eCommerce2 from "@images/eCommerce/device1.png";
import {
  defaultMonth,
  monthLst,
  headerCalender,
  yearLst,
  getWeekdays,
  checkContinualXDay,
} from "./components/default";
export default {
  data() {
    return {
      eCommerce2: eCommerce2,
      listUserWork: [],
      footerData: [],
      dayInMonth: 0,
      year: 0,
      month: 0,
      updateName: 0,
      headerCalender: headerCalender,
      listT7CN: [],
      quotaCheckLst: [],
    };
  },
  methods: {
    daysInMonth(month, year) {
      return new Date(year, month, 0).getDate();
    },
    isWaning(index, inde, item) {
      if (this.quotaCheckLst.length == 0) {
        return false;
      }
      if (index > 1 && index < 6) {
        if (this.quotaCheckLst[index - 2][inde] > item) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    handleScroll(event) {
      this.$refs.scrollable2.scrollTop = event.target.scrollTop;
      this.$refs.scrollable5.scrollTop = event.target.scrollTop;
    },
    handleScrollBack(event) {
      this.$refs.scrollable1.scrollTop = event.target.scrollTop;
    },
    handleScroll2(event) {
      this.$refs.scrollable3.scrollLeft = event.target.scrollLeft;
      this.$refs.scrollable4.scrollLeft = event.target.scrollLeft;
    },
    handleScroll2Back(event) {
      this.$refs.scrollable3.scrollLeft = event.target.scrollLeft;
      this.$refs.scrollable1.scrollLeft = event.target.scrollLeft;
    },
  },
  mounted() {
    this.$refs.scrollable1.addEventListener("scroll", this.handleScroll);
    this.$refs.scrollable1.addEventListener("scroll", this.handleScroll2);
    this.$refs.scrollable2.addEventListener("scroll", this.handleScrollBack);
    this.$refs.scrollable5.addEventListener("scroll", this.handleScrollBack);
    this.$refs.scrollable4.addEventListener("scroll", this.handleScroll2Back);
  },
  created() {
    this.year = new Date().getFullYear();
    this.month = new Date().getMonth() + 1;
    this.dayInMonth = this.daysInMonth(
      parseInt(this.month),
      parseInt(this.year)
    );
    for (let i = 0; i < this.dayInMonth; i++) {
      const day = i + 1 < 10 ? `0${i + 1}` : i + 1;
      const date = new Date(`${this.year}-${this.month}-${day}`).getDay();
      const dayOfWeek = getWeekdays(date);
      this.headerCalender[1]["Day" + `0${i + 1}`.slice(-2)] = dayOfWeek;

      if (dayOfWeek === "CN" || dayOfWeek === "T7") {
        this.listT7CN.push(i + 1);
      }
    }
    var a = defaultMonth;
    this.footerData = [
      {
        FullName: "Ca 1",
        ...a,
      },
      {
        FullName: "Ca 2",
        ...a,
      },
      {
        FullName: "Ca 3",
        ...a,
      },
      {
        FullName: "HC",
        ...a,
      },
      {
        FullName: "BS",
        ...a,
      },
      {
        FullName: "Tổng",
        ...a,
      },
    ];
    this.footerData = [...this.headerCalender].concat(this.footerData);
    this.listUserWork = [...this.headerCalender].concat(this.listUserWork);
  },
};
</script>

<style lang="scss" scoped>
@import "./components/style.scss";
</style>
