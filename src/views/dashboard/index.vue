<template>
  <div class="container">
    <div class="content">
      <div class="title-content">Thống kê hồ sơ</div>
      <div class="row-top">
        <div class="flex-2-0">
          <div class="box" style="background: #e3f9f8">
            <div class="title">Hồ sơ</div>
            <v-row>
              <v-col>
                <div>Đang làm</div>
                <v-btn color="primary">
                  {{ dashInfo.NumDoc2 }}
                </v-btn>
              </v-col>
              <v-col>
                <div>Tạm dừng</div>
                <v-btn color="orange">
                  {{ dashInfo.NumDoc3 }}
                </v-btn>
              </v-col>
              <v-col>
                <div>Hoàn thành</div>
                <v-btn color="green">
                  {{ dashInfo.NumDoc4 }}
                </v-btn>
              </v-col>
              <v-col>
                <div>Dừng</div>
                <v-btn color="indigo">
                  {{ dashInfo.NumDoc0 }}
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </div>
        <div class="flex-1-0">
          <div class="box" style="background: #fff2ee">
            <div class="title">Hồ sơ quá hạn</div>
            <div class="value">
              {{ dashInfo.NumDocOver }}
            </div>
          </div>
        </div>
        <div class="flex-1-0">
          <div class="box" style="background: #ffeef3">
            <div class="title">Công việc quá hạn</div>
            <div class="value">{{ dashInfo.NumJob }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="title-content">Thống kê Nhãn đăng ký</div>
      <div class="row-top">
        <div class="flex-2-0">
          <div class="box" style="background: #e3f9f8">
            <div class="title">Nhãn đăng ký</div>
            <v-row>
              <v-col>
                <div>Đang làm</div>
                <v-btn color="primary">
                  {{ dashInfoDesign.NumDoc2 }}
                </v-btn>
              </v-col>
              <v-col>
                <div>Tạm dừng</div>
                <v-btn color="orange">
                  {{ dashInfoDesign.NumDoc3 }}
                </v-btn>
              </v-col>
              <v-col>
                <div>Hoàn thành</div>
                <v-btn color="green">
                  {{ dashInfoDesign.NumDoc4 }}
                </v-btn>
              </v-col>
              <v-col>
                <div>Dừng</div>
                <v-btn color="indigo">
                  {{ dashInfoDesign.NumDoc0 }}
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </div>
        <div class="flex-1-0">
          <div class="box" style="background: #fff2ee">
            <div class="title">Nhãn quá hạn</div>
            <div class="value">
              {{ dashInfoDesign.NumDocOver }}
            </div>
          </div>
        </div>
        <div class="flex-1-0">
          <div class="box" style="background: #ffeef3">
            <div class="title">Công việc quá hạn</div>
            <div class="value">{{ dashInfoDesign.NumJob }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="title-content">Thống kê Nhãn sản xuất</div>
      <div class="row-top">
        <div class="flex-2-0">
          <div class="box" style="background: #e3f9f8">
            <div class="title">Nhãn sản xuất</div>
            <v-row>
              <v-col>
                <div>Đang làm</div>
                <v-btn color="primary">
                  {{ dashInfoDesign2.NumDoc2 }}
                </v-btn>
              </v-col>
              <v-col>
                <div>Tạm dừng</div>
                <v-btn color="orange">
                  {{ dashInfoDesign2.NumDoc3 }}
                </v-btn>
              </v-col>
              <v-col>
                <div>Hoàn thành</div>
                <v-btn color="green">
                  {{ dashInfoDesign2.NumDoc4 }}
                </v-btn>
              </v-col>
              <v-col>
                <div>Dừng</div>
                <v-btn color="indigo">
                  {{ dashInfoDesign2.NumDoc0 }}
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </div>
        <div class="flex-1-0">
          <div class="box" style="background: #fff2ee">
            <div class="title">Nhãn quá hạn</div>
            <div class="value">
              {{ dashInfoDesign2.NumDocOver }}
            </div>
          </div>
        </div>
        <div class="flex-1-0">
          <div class="box" style="background: #ffeef3">
            <div class="title">Công việc quá hạn</div>
            <div class="value">{{ dashInfoDesign2.NumJob }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="title-content">Thống kê Mẫu xuất khẩu</div>
      <div class="row-top">
        <div class="flex-2-0">
          <div class="box" style="background: #e3f9f8">
            <div class="title">Mẫu xuất khẩu</div>
            <v-row>
              <v-col>
                <div>Đang làm</div>
                <v-btn color="primary">
                  {{ dashInfoSample.NumDoc2 }}
                </v-btn>
              </v-col>
              <v-col>
                <div>Tạm dừng</div>
                <v-btn color="orange">
                  {{ dashInfoSample.NumDoc3 }}
                </v-btn>
              </v-col>
              <v-col>
                <div>Hoàn thành</div>
                <v-btn color="green">
                  {{ dashInfoSample.NumDoc4 }}
                </v-btn>
              </v-col>
              <v-col>
                <div>Dừng</div>
                <v-btn color="indigo">
                  {{ dashInfoSample.NumDoc0 }}
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </div>
        <div class="flex-1-0">
          <div class="box" style="background: #fff2ee">
            <div class="title">Hồ sơ quá hạn</div>
            <div class="value">
              {{ dashInfoSample.NumDocOver }}
            </div>
          </div>
        </div>
        <div class="flex-1-0">
          <div class="box" style="background: #ffeef3">
            <div class="title">Công việc quá hạn</div>
            <div class="value">{{ dashInfoSample.NumJob }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="title-content">Thống kê Nhãn Trong Nước</div>
      <div class="row-top">
        <div class="flex-2-0">
          <div class="box" style="background: #e3f9f8">
            <div class="title">Nhãn trong nước</div>
            <v-row>
              <v-col>
                <div>Đang làm</div>
                <v-btn color="primary">
                  {{ dashInfoInCountry.NumDoc2 }}
                </v-btn>
              </v-col>
              <v-col>
                <div>Tạm dừng</div>
                <v-btn color="orange">
                  {{ dashInfoInCountry.NumDoc3 }}
                </v-btn>
              </v-col>
              <v-col>
                <div>Hoàn thành</div>
                <v-btn color="green">
                  {{ dashInfoInCountry.NumDoc4 }}
                </v-btn>
              </v-col>
              <v-col>
                <div>Dừng</div>
                <v-btn color="indigo">
                  {{ dashInfoInCountry.NumDoc0 }}
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </div>
        <div class="flex-1-0">
          <div class="box" style="background: #fff2ee">
            <div class="title">Hồ sơ quá hạn</div>
            <div class="value">
              {{ dashInfoInCountry.NumDocOver }}
            </div>
          </div>
        </div>
        <div class="flex-1-0">
          <div class="box" style="background: #ffeef3">
            <div class="title">Công việc quá hạn</div>
            <div class="value">{{ dashInfoInCountry.NumJob }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="title-content">Thống kê Order Chất Chuẩn</div>
      <div class="row-top">
        <div class="flex-2-0">
          <div class="box" style="background: #e3f9f8">
            <div class="title">Order Chất Chuẩn</div>
            <v-row>
              <v-col>
                <div>Đang làm</div>
                <v-btn color="primary">
                  {{ dashInfoOrder.NumDoc2 }}
                </v-btn>
              </v-col>
              <v-col>
                <div>Tạm dừng</div>
                <v-btn color="orange">
                  {{ dashInfoOrder.NumDoc3 }}
                </v-btn>
              </v-col>
              <v-col>
                <div>Hoàn thành</div>
                <v-btn color="green">
                  {{ dashInfoOrder.NumDoc4 }}
                </v-btn>
              </v-col>
              <v-col>
                <div>Dừng</div>
                <v-btn color="indigo">
                  {{ dashInfoOrder.NumDoc0 }}
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </div>
        <div class="flex-1-0">
          <div class="box" style="background: #fff2ee">
            <div class="title">Hồ sơ quá hạn</div>
            <div class="value">
              {{ dashInfoOrder.NumDocOver }}
            </div>
          </div>
        </div>
        <div class="flex-1-0">
          <div class="box" style="background: #ffeef3">
            <div class="title">Công việc quá hạn</div>
            <div class="value">{{ dashInfoOrder.NumJob }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GetDashboard } from "@/api/dashboardApi";
export default {
  data() {
    return {
      tableData: [],
      dashInfo: {},
      dashInfoDesign: {},
      dashInfoDesign2: {},
      dashInfoSample: {},
      dashInfoInCountry: {},
      dashInfoOrder: {},
      year: 2025,
      options: [2024, 2025],
      employee: "",
      employeeInfo: {},
      tableDataCom: [],
    };
  },
  watch: {
    year(value) {
      this.getDashboard(value);
    },
  },
  methods: {
    getDashboard(year) {
      GetDashboard({
        Year: year,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.dashInfo = res.Data;
          this.dashInfoDesign = res.DataDesign;
          this.dashInfoDesign2 = res.DataDesign2;
          this.dashInfoSample = res.DataSample;
          this.dashInfoInCountry = res.DataInCountry;
          this.dashInfoOrder = res.DataOrder;
        }
      });
    },
  },
  created() {
    this.getDashboard(this.year);
  },
};
</script>
<style lang="scss" scoped>
.container {
  .content {
    background: #fff;
    margin-bottom: 16px;
    border-radius: 12px;
    max-width: 1200px;
    .title-content {
      margin-left: 30px;
      padding-top: 12px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .row-top {
      gap: 16px;
      flex-wrap: wrap !important;
      display: flex !important;
      padding: 16px;
      padding-top: 8px;
      .flex-1-0 {
        flex: 1 0 auto !important;
      }
      .flex-2-0 {
        flex: 2 0 auto !important;
      }
      .box {
        text-align: center !important;
        border-radius: 12px !important;
        height: 150px;
        padding: 12px;

        .title {
          margin: 12px 0;
          font-size: 20px;
          font-weight: 500;
        }

        .value {
          font-size: 24px;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
