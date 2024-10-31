<template>
  <v-card class="py-4">
    <div class="d-flex justify-space-between mb-4 mx-4" v-if="docInfo.TypeDoc">
      <div>
        <div class="text-h5">
          Thông tin:
          {{ docInfo.DocName }}
          <v-chip
            style="margin-top: -10px"
            :color="getStatus(docInfo.Status).color"
          >
            {{ getStatus(docInfo.Status).text }}</v-chip
          >
        </div>
        <div class="ml-4 mt-2">
          <v-icon color="blue" size="small">mdi-note</v-icon> Mô tả:
          {{ docInfo.Note }}
        </div>
        <div class="ml-4 mt-2">
          <v-icon color="blue" size="small">mdi-clipboard-text-clock</v-icon>
          Hạn xử lý:
          {{ docInfo.DateExpired }}
        </div>
      </div>
      <div>
        <v-btn
          color="blue"
          variant="tonal"
          icon="mdi-playlist-plus"
          style="height: 42px"
          @click="isShowCreateDocument = true"
        ></v-btn>
      </div>
    </div>
    <v-data-table
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="docInfo.Data"
      min-height="calc( 210px)"
      items-per-page-text="Số dòng 1 trang"
      sort-asc-icon="mdi-menu-up"
      sort-desc-icon="mdi-menu-down"
      hide-default-footer
    >
      <template v-slot:item.Action="{ item }">
        <v-icon
          color="primary"
          class="me-2"
          size="small"
          style="cursor: pointer"
          @click="editSchedule(item)"
          >mdi-format-list-numbered</v-icon
        >
      </template>
      <template v-slot:item.Key="{ item }">
        {{ item.Key }}
        <v-icon
          color="orange"
          class="me-2"
          size="small"
          style="cursor: pointer"
          @click="editSchedule(item)"
          >mdi-note-edit</v-icon
        >
      </template>
    </v-data-table>
  </v-card>
  <v-row class="mt-2">
    <v-col cols="12" md="6">
      <v-card class="py-2 px-4 layout-card">
        <div class="text-h6">Thông tin các bước</div>
        <v-divider class="my-2"></v-divider>
        <div v-for="(item, index) in processLst" :key="index" class="mx-2 my-2">
          <div class="d-flex">
            <v-chip class="mr-2">
              {{ item.StepOrder }}
            </v-chip>
            {{ item.StepName }}
            <v-spacer></v-spacer>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  rounded="full"
                  color="blue"
                  v-bind="props"
                  icon="mdi-dots-vertical"
                  size="x-small"
                >
                </v-btn>
              </template>
              <v-list>
                <!-- <v-list-item>
                  <v-btn
                    prepend-icon="mdi-bell-ring"
                    size="small"
                    color="gray"
                    rounded="4"
                    block

                  >
                    <template v-slot:prepend>
                      <v-icon color="blue"></v-icon>
                    </template>
                    Giao việc
                  </v-btn>
                </v-list-item> -->
                <v-list-item>
                  <v-btn
                    prepend-icon="mdi-information-box"
                    size="small"
                    color="gray"
                    rounded="4"
                    block
                    @click="btShowInfoStep(item)"
                  >
                    <template v-slot:prepend>
                      <v-icon color="blue"></v-icon>
                    </template>
                    Thông tin
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <v-divider class="my-2" color="blue"></v-divider>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-card class="py-2 px-4 layout-card">
        <div class="text-h6">Các file liên quan</div>
        <v-divider class="my-2"></v-divider>
        <div class="text-center py-8">
          <v-icon color="red" size="large"> mdi-text-box-search </v-icon>
          <div>Chưa có file nào đính kèm</div>
        </div>
      </v-card>
    </v-col>
  </v-row>
  <v-dialog v-model="isShowInfoStep" max-width="800px">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div>
          <div class="text-h5 text-medium-emphasis">
            <v-chip :color="stepInfo.Status == 1 ? 'blue' : ''">
              Bước {{ stepInfo.StepOrder }}
            </v-chip>
            {{ stepInfo.StepName }}
          </div>
          <div v-if="stepInfo.Description">
            Mô tả: {{ stepInfo.Description }}
          </div>
        </div>

        <v-btn
          icon="mdi-close"
          variant="text"
          rounded="full"
          color="gray"
          size="small"
          @click="isShowInfoStep = false"
        ></v-btn
      ></v-card-title>
      <v-card-text v-for="(item, index) in workLst" :key="index">
        <v-divider style="margin-top: -20px" class="mb-2"></v-divider>
        <v-form ref="editForm">
          <div class="text-h6">
            {{ item.Key }}. {{ item.JobName }}

            <v-chip style="margin-top: -10px" v-if="item.Status == 0"
              >Chưa giao việc</v-chip
            >
            <v-chip
              style="margin-top: -10px"
              color="blue"
              v-if="item.Status == 1"
              >Đang làm</v-chip
            >
            <v-chip
              style="margin-top: -10px"
              color="green"
              v-if="item.Status == 4"
              >Hoàn thành</v-chip
            >
          </div>
          <div class="text-p">Mô tả: {{ item.DesJob }}</div>

          <v-row>
            <v-col :lg="6">
              <span>Cài đặt xử lý</span>
              <v-select
                placeholder="Nhóm xử lý"
                density="compact"
                item-value="ValueName"
                item-title="ValueName"
                chips
                style="max-width: 280px"
                class="mb-2 mt-2"
              ></v-select>
              <v-select
                placeholder="Người xử lý"
                item-value="UserName"
                item-title="FullName"
                chips
                style="max-width: 280px"
                class="mb-2"
              ></v-select>
              <v-text-field
                label="Hạn xử lý"
                type="number"
                :min="1"
                :max="1000"
                suffix="Ngày"
                style="max-width: 280px"
              ></v-text-field>
            </v-col>
            <v-col :lg="6">
              <span>Cài đặt phê duyệt</span>
              <v-select
                placeholder="Nhóm phê duyệt"
                density="compact"
                item-value="ValueName"
                item-title="ValueName"
                chips
                style="max-width: 280px"
                class="mb-2 mt-2"
              ></v-select>
              <v-select
                placeholder="Người phê duyệt"
                density="compact"
                item-value="UserName"
                item-title="FullName"
                chips
                style="max-width: 280px"
                class="mb-2"
              ></v-select>
              <v-text-field
                label="Hạn phê duyệt"
                type="number"
                :min="1"
                :max="1000"
                suffix="Ngày"
                style="max-width: 280px"
              ></v-text-field>
            </v-col>
          </v-row>
          <div class="d-flex justify-center my-4">
            <v-btn
              variant="outlined"
              rounded="8"
              size="small"
              @click="isShowInfoStep = false"
              color="green"
              >Giao việc</v-btn
            >
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { GSPGetGSPDocumentInfoByID } from "@/api/briefApi";
import { formatDateDisplayDDMMYY } from "@/helpers/getTime";
import { ProcessDocument, GetDocumentJobByDocID } from "@/api/documentJobApi";
export default {
  data() {
    return {
      headers: [
        {
          title: "STT",
          sortable: false,
          key: "Key",
          align: "center",
          width: 80,
        },
        { title: "Mã BFO", key: "BFO", sortable: false },
        { title: "Sản phẩm", key: "ProductName", sortable: false },
        { title: "Số lô", key: "Lotcode", sortable: false },
        { title: "Sl", key: "Quantity", sortable: false },
        { title: "Đơn vị", key: "Unit", sortable: false },
        { title: "Trạng thái", key: "StatusText", sortable: false, width: 120 },
        {
          title: "Hạn dùng",
          key: "ExpDateShow",
          sortable: false,
          width: 100,
        },
        {
          title: "Quyết định",
          key: "Decision",
          sortable: false,
        },
        {
          title: "Ghi chú",
          key: "Note",
          sortable: false,
        },
      ],
      docInfo: {},
      pageSize: 10,
      currentPage: 1,
      totalLength: 0,
      processLst: [],
      isShowInfoStep: false,
      stepInfo: {},
      workLst: [],
    };
  },
  methods: {
    btShowInfoStep(data) {
      this.isShowInfoStep = true;
      this.stepInfo = data;
      this.getDocumentJobByDocID(data.StepID);
    },
    getDocumentJobByDocID(stepID) {
      GetDocumentJobByDocID({
        DocumentID: this.$route.params.id,
        StepID: stepID,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.workLst = res.DocumentJobLst.map((item, index) => {
            return {
              ...item,
              Key: index + 1,
            };
          });
        }
      });
    },
    getStatus(status) {
      if (status == 0) {
        return { text: "Hủy", color: "error" };
      }
      if (status == 1) {
        return { text: "Mới tạo", color: "more" };
      }
      if (status == 2) {
        return { text: "Đang làm", color: "blue" };
      }
      if (status == 3) {
        return { text: "Tạm dừng", color: "more" };
      }
      if (status == 4) {
        return { text: "Hoàn thành", color: "success" };
      }
    },
    processDocument() {
      ProcessDocument({
        DocumentID: this.$route.params.id,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.processLst = res.DocumentJobLst;
        }
      });
    },
    getDocumentInfoByID() {
      GSPGetGSPDocumentInfoByID({
        DocumentID: this.$route.params.id,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.docInfo = res.Data;
          this.docInfo.Data = this.docInfo.Data.map((item, index) => {
            return {
              ...item,
              Key: index + 1,
              ExpDateShow: formatDateDisplayDDMMYY(item.ExpDate),
            };
          });
          this.processDocument();
        }
      });
    },
  },
  created() {
    this.getDocumentInfoByID();
  },
};
</script>

<style lang="scss" scoped>
.layout-card {
  min-height: 250px;
  max-height: 500px;
  overflow-y: scroll;
}
</style>
