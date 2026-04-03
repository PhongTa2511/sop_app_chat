<template>
  <div class="container">
    <div class="content">
      <div class="title-content">
        Thống kê hồ sơ
      </div>
      <div class="row-top">
        <div class="flex-2-0">
          <div
            class="box"
            style="background: #e3f9f8"
          >
            <div class="title">
              Hồ sơ
            </div>
            <VRow>
              <VCol>
                <div>Đang làm</div>
                <VBtn color="primary">
                  {{ dashInfo.NumDoc2 }}
                </VBtn>
              </VCol>
              <VCol>
                <div>Tạm dừng</div>
                <VBtn color="orange">
                  {{ dashInfo.NumDoc3 }}
                </VBtn>
              </VCol>
              <VCol>
                <div>Hoàn thành</div>
                <VBtn color="green">
                  {{ dashInfo.NumDoc4 }}
                </VBtn>
              </VCol>
              <VCol>
                <div>Dừng</div>
                <VBtn color="indigo">
                  {{ dashInfo.NumDoc0 }}
                </VBtn>
              </VCol>
            </VRow>
          </div>
        </div>
        <div class="flex-1-0">
          <div
            class="box"
            style="background: #fff2ee"
          >
            <div class="title">
              Hồ sơ quá hạn
            </div>
            <div class="value">
              {{ dashInfo.NumDocOver }}
            </div>
          </div>
        </div>
        <div class="flex-1-0">
          <div
            class="box"
            style="background: #ffeef3"
          >
            <div class="title">
              Công việc quá hạn
            </div>
            <div class="value">
              {{ dashInfo.NumJob }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="title-content">
        Thống kê Nhãn đăng ký
      </div>
      <div class="row-top">
        <div class="flex-2-0">
          <div
            class="box"
            style="background: #e3f9f8"
          >
            <div class="title">
              Nhãn đăng ký
            </div>
            <VRow>
              <VCol>
                <div>Đang làm</div>
                <VBtn color="primary">
                  {{ dashInfoDesign.NumDoc2 }}
                </VBtn>
              </VCol>
              <VCol>
                <div>Tạm dừng</div>
                <VBtn color="orange">
                  {{ dashInfoDesign.NumDoc3 }}
                </VBtn>
              </VCol>
              <VCol>
                <div>Hoàn thành</div>
                <VBtn color="green">
                  {{ dashInfoDesign.NumDoc4 }}
                </VBtn>
              </VCol>
              <VCol>
                <div>Dừng</div>
                <VBtn color="indigo">
                  {{ dashInfoDesign.NumDoc0 }}
                </VBtn>
              </VCol>
            </VRow>
          </div>
        </div>
        <div class="flex-1-0">
          <div
            class="box"
            style="background: #fff2ee"
          >
            <div class="title">
              Nhãn quá hạn
            </div>
            <div class="value">
              {{ dashInfoDesign.NumDocOver }}
            </div>
          </div>
        </div>
        <div class="flex-1-0">
          <div
            class="box"
            style="background: #ffeef3"
          >
            <div class="title">
              Công việc quá hạn
            </div>
            <div class="value">
              {{ dashInfoDesign.NumJob }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="title-content">
        Thống kê Nhãn sản xuất
      </div>
      <div class="row-top">
        <div class="flex-2-0">
          <div
            class="box"
            style="background: #e3f9f8"
          >
            <div class="title">
              Nhãn sản xuất
            </div>
            <VRow>
              <VCol>
                <div>Đang làm</div>
                <VBtn color="primary">
                  {{ dashInfoDesign2.NumDoc2 }}
                </VBtn>
              </VCol>
              <VCol>
                <div>Tạm dừng</div>
                <VBtn color="orange">
                  {{ dashInfoDesign2.NumDoc3 }}
                </VBtn>
              </VCol>
              <VCol>
                <div>Hoàn thành</div>
                <VBtn color="green">
                  {{ dashInfoDesign2.NumDoc4 }}
                </VBtn>
              </VCol>
              <VCol>
                <div>Dừng</div>
                <VBtn color="indigo">
                  {{ dashInfoDesign2.NumDoc0 }}
                </VBtn>
              </VCol>
            </VRow>
          </div>
        </div>
        <div class="flex-1-0">
          <div
            class="box"
            style="background: #fff2ee"
          >
            <div class="title">
              Nhãn quá hạn
            </div>
            <div class="value">
              {{ dashInfoDesign2.NumDocOver }}
            </div>
          </div>
        </div>
        <div class="flex-1-0">
          <div
            class="box"
            style="background: #ffeef3"
          >
            <div class="title">
              Công việc quá hạn
            </div>
            <div class="value">
              {{ dashInfoDesign2.NumJob }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="title-content">
        Thống kê Mẫu xuất khẩu
      </div>
      <div class="row-top">
        <div class="flex-2-0">
          <div
            class="box"
            style="background: #e3f9f8"
          >
            <div class="title">
              Mẫu xuất khẩu
            </div>
            <VRow>
              <VCol>
                <div>Đang làm</div>
                <VBtn color="primary">
                  {{ dashInfoSample.NumDoc2 }}
                </VBtn>
              </VCol>
              <VCol>
                <div>Tạm dừng</div>
                <VBtn color="orange">
                  {{ dashInfoSample.NumDoc3 }}
                </VBtn>
              </VCol>
              <VCol>
                <div>Hoàn thành</div>
                <VBtn color="green">
                  {{ dashInfoSample.NumDoc4 }}
                </VBtn>
              </VCol>
              <VCol>
                <div>Dừng</div>
                <VBtn color="indigo">
                  {{ dashInfoSample.NumDoc0 }}
                </VBtn>
              </VCol>
            </VRow>
          </div>
        </div>
        <div class="flex-1-0">
          <div
            class="box"
            style="background: #fff2ee"
          >
            <div class="title">
              Hồ sơ quá hạn
            </div>
            <div class="value">
              {{ dashInfoSample.NumDocOver }}
            </div>
          </div>
        </div>
        <div class="flex-1-0">
          <div
            class="box"
            style="background: #ffeef3"
          >
            <div class="title">
              Công việc quá hạn
            </div>
            <div class="value">
              {{ dashInfoSample.NumJob }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="title-content">
        Thống kê Nhãn Trong Nước
      </div>
      <div class="row-top">
        <div class="flex-2-0">
          <div
            class="box"
            style="background: #e3f9f8"
          >
            <div class="title">
              Nhãn trong nước
            </div>
            <VRow>
              <VCol>
                <div>Đang làm</div>
                <VBtn color="primary">
                  {{ dashInfoInCountry.NumDoc2 }}
                </VBtn>
              </VCol>
              <VCol>
                <div>Tạm dừng</div>
                <VBtn color="orange">
                  {{ dashInfoInCountry.NumDoc3 }}
                </VBtn>
              </VCol>
              <VCol>
                <div>Hoàn thành</div>
                <VBtn color="green">
                  {{ dashInfoInCountry.NumDoc4 }}
                </VBtn>
              </VCol>
              <VCol>
                <div>Dừng</div>
                <VBtn color="indigo">
                  {{ dashInfoInCountry.NumDoc0 }}
                </VBtn>
              </VCol>
            </VRow>
          </div>
        </div>
        <div class="flex-1-0">
          <div
            class="box"
            style="background: #fff2ee"
          >
            <div class="title">
              Hồ sơ quá hạn
            </div>
            <div class="value">
              {{ dashInfoInCountry.NumDocOver }}
            </div>
          </div>
        </div>
        <div class="flex-1-0">
          <div
            class="box"
            style="background: #ffeef3"
          >
            <div class="title">
              Công việc quá hạn
            </div>
            <div class="value">
              {{ dashInfoInCountry.NumJob }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="title-content">
        Thống kê Order Chất Chuẩn
      </div>
      <div class="row-top">
        <div class="flex-2-0">
          <div
            class="box"
            style="background: #e3f9f8"
          >
            <div class="title">
              Order Chất Chuẩn
            </div>
            <VRow>
              <VCol>
                <div>Đang làm</div>
                <VBtn color="primary">
                  {{ dashInfoOrder.NumDoc2 }}
                </VBtn>
              </VCol>
              <VCol>
                <div>Tạm dừng</div>
                <VBtn color="orange">
                  {{ dashInfoOrder.NumDoc3 }}
                </VBtn>
              </VCol>
              <VCol>
                <div>Hoàn thành</div>
                <VBtn color="green">
                  {{ dashInfoOrder.NumDoc4 }}
                </VBtn>
              </VCol>
              <VCol>
                <div>Dừng</div>
                <VBtn color="indigo">
                  {{ dashInfoOrder.NumDoc0 }}
                </VBtn>
              </VCol>
            </VRow>
          </div>
        </div>
        <div class="flex-1-0">
          <div
            class="box"
            style="background: #fff2ee"
          >
            <div class="title">
              Hồ sơ quá hạn
            </div>
            <div class="value">
              {{ dashInfoOrder.NumDocOver }}
            </div>
          </div>
        </div>
        <div class="flex-1-0">
          <div
            class="box"
            style="background: #ffeef3"
          >
            <div class="title">
              Công việc quá hạn
            </div>
            <div class="value">
              {{ dashInfoOrder.NumJob }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GetDashboard } from "@/api/dashboardApi"

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
    }
  },
  watch: {
    year(value) {
      this.getDashboard(value)
    },
  },
  created() {
    this.getDashboard(this.year)
  },
  methods: {
    getDashboard(year) {
      GetDashboard({
        Year: year,
      }).then(res => {
        if (res.RespCode == 0) {
          this.dashInfo = res.Data
          this.dashInfoDesign = res.DataDesign
          this.dashInfoDesign2 = res.DataDesign2
          this.dashInfoSample = res.DataSample
          this.dashInfoInCountry = res.DataInCountry
          this.dashInfoOrder = res.DataOrder
        }
      })
    },
  },
}
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
