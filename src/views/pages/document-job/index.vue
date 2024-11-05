<template>
  <v-card class="py-4">
    <v-data-table
      :items-per-page="rowspPage"
      :items-length="totalLength"
      @update:itemsPerPage="btRow"
      @update:page="btPage"
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="jobLst"
      :search="inputSearch"
      height="calc(100vh - 210px)"
      items-per-page-text="Số dòng 1 trang"
      sort-asc-icon="mdi-menu-up"
      sort-desc-icon="mdi-menu-down"
      :items-per-page-options="[
        { value: 10, title: '10' },
        { value: 50, title: '50' },
        { value: 100, title: '100' },
        { value: 10000, title: 'All' },
      ]"
    >
      <template v-slot:top>
        <div class="d-flex flex-wrap gap-2 px-3">
          <!-- <span>
            <v-select
              v-model="optionStatus"
              :items="optionStatusLst"
              label="Địa bàn"
              item-title="label"
              item-value="value"
              class="ml-1"
              style="width: 220px !important"
              hide-details
            ></v-select>
          </span> -->

          <span>
            <v-text-field
              v-model="inputSearch"
              label="Tìm kiếm"
              hide-details
              style="width: 250px !important"
              prepend-inner-icon="mdi-magnify"
              clearable
            ></v-text-field>
          </span>
          <!-- <v-btn
            color="blue"
            variant="tonal"
            icon="mdi-playlist-plus"
            style="height: 42px"
            @click="isShowCreateDocument = true"
          ></v-btn> -->
          <v-btn
            color="green"
            variant="tonal"
            icon="mdi-reload"
            style="height: 42px"
            @click="getDocumentJobByEm"
          ></v-btn>
        </div>
      </template>
      <template v-slot:item.Status="{ item }">
        <v-chip :color="getStatus(item.Status).color">
          {{ getStatus(item.Status).text }}</v-chip
        >
      </template>

      <template v-slot:item.Key="{ item }">
        {{ item.Key }}
        <v-icon
          color="orange"
          class="me-2"
          size="small"
          style="cursor: pointer"
          @click="btPushToDocinfo(item)"
          >mdi-note-edit</v-icon
        >
      </template>
      <template v-slot:item.QuotaTime="{ item }">
        {{ item.QuotaTime }} Ngày
      </template>
    </v-data-table>
  </v-card>
  <v-dialog v-model="isShowProcess" width="600">
    <v-card>
      <v-card-title>Quá trình thực hiện</v-card-title>
      <v-card-text>
        <v-stepper vertical>
          <v-stepper-step
            v-for="(item, index) in workInfo"
            :key="index"
            :complete="item.Status === 3"
            :step="index + 1"
            :editable="false"
          >
            <template v-slot:label>{{ item.StepName }}</template>
            <template v-slot:content>
              <div v-for="(step, ind) in item.StepLst" :key="ind">
                <div>{{ step.JobName }}</div>
                <div v-if="step.Report">
                  {{ step.ReportName }} - {{ step.Report }}
                </div>
                <div v-if="step.NoteApprove">
                  {{ step.ManagerName }} - {{ step.NoteApprove }}
                </div>
              </div>
            </template>
          </v-stepper-step>
        </v-stepper>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  GetGSPDocumentLst,
  UpdateGSPDocument,
  CreateGSPDocument,
} from "@/api/briefApi";
import {
  formatDate,
  formatDateDisplayDDMMYY,
  formatDateUpload,
} from "@/helpers/getTime";
import { GetProcedureNameInfo, GetProcedureLst } from "@/api/procedureApi";
import { ProcessDocument, GetDocumentJobByEm } from "@/api/documentJobApi";

export default {
  data() {
    return {
      isShowProcess: false,
      inputSearch: "",

      rowspPage: 10,
      pageNumber: 1,
      totalLength: 0,
      optionStatusLst: [
        { value: 1, label: "Mới tạo" },
        { value: 2, label: "Đang xử lý" },
        { value: 3, label: "Hoàn thành" },
        { value: 4, label: "Tất cả" },
      ],
      optionConfirmLst: [
        { value: 0, label: "Dừng xử lý" },
        { value: 2, label: "Đang xử lý" },
        { value: 3, label: "Hoàn thnh" },
      ],

      headers: [
        {
          title: "STT",
          sortable: false,
          key: "Key",
          align: "center",
          width: 80,
        },
        { title: "Quy trình", key: "ProcedureName", sortable: false },
        { title: "Bước", key: "StepName", sortable: false },
        { title: "Công việc", key: "JobName", sortable: false },
        { title: "Sản phẩm", key: "ProductNameLst", sortable: false },

        {
          title: "Bắt đầu",
          key: "TimeStartShow",
          sortable: false,
          width: 100,
        },
        {
          title: "Thời hạn",
          key: "QuotaTime",
          sortable: false,
          width: 100,
        },

        // { title: "", key: "Action", width: 40, align: "center" },
        { title: "Trạng thái", key: "Status", sortable: false, width: 100 },
      ],
      jobLst: [],
    };
  },
  watch: {
    search() {
      this.getUserLst();
    },
    pageNumber(newValue) {
      this.getUserLst();
    },
    rowspPage(newValue) {
      this.getUserLst();
    },
  },
  methods: {
    // btShowProcessDocument(data) {
    //   this.isShowProcess = true;
    //    ProcessDocument({
    //     DocumentID: data,
    //   }).then((res) => {
    //     if (res.RespCode == 0) {
    //       this.processLst = res.DocumentJobLst;
    //     }
    //   });
    // },
    btPushToDocinfo(data) {
      this.$router.push("/cong-viec/" + data.RowID);
    },
    btPage(data) {
      this.pageNumber = data;
    },
    btRow(data) {
      this.rowspPage = data;
    },
    getStatus(status) {
      if (status == 0) {
        return { text: "Hủy", color: "error" };
      }

      if (status == 1 || status == 2) {
        return { text: "Đang làm", color: "blue" };
      }
      if (status == 3) {
        return { text: "Tạm dừng", color: "more" };
      }
      if (status == 4) {
        return { text: "Hoàn thành", color: "green" };
      }
    },
    getDocumentJobByEm() {
      GetDocumentJobByEm({
        PageNumber: this.pageNumber,
        RowspPage: this.rowspPage,
        Status: 1,
        Search: this.inputSearch,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.jobLst = res.DocumentJobLst.map((item, index) => {
            var quotaTime = 0;
            if (item.Status === 1) {
              var checkJob = item.AssignLst.find((p) => p.UserRole == "Xử lý");
              quotaTime = checkJob.QuotaTime;
            }
            if (item.Status == 3) {
              var checkMana = item.AssignLst.find(
                (p) => p.UserRole == "Phê duyệt"
              );
              quotaTime = checkMana.QuotaTime;
            }

            return {
              ...item,
              Key: index + 1,
              TimeStartShow: formatDateDisplayDDMMYY(item.TimeStart),
              QuotaTime: quotaTime,
            };
          });
          this.totalLength = res.TotalRows;
        }
      });
    },
  },
  created() {
    this.getDocumentJobByEm();
  },
};
</script>

<style lang="scss" scoped>
.file-lst {
  display: inline-block;
  .file {
    display: inline-block;
    border: 1px solid #aeaeae;
    padding: 8px;
    margin-right: 8px;
    border-radius: 8px;
    min-width: 200px !important;
    max-width: 250px !important;
    white-space: normal;
    position: relative;
    cursor: pointer;
    &:hover {
      background: #f0f0f0;
    }
    .trash {
      position: absolute;
      top: 12px;
      right: 12px;
      color: #f56c6c;
    }
    .file-name {
      font-weight: 600;
      margin-right: 24px;
    }
    .des {
      font-size: 14px;
      color: #93969b;
      margin: 8px 0;
    }
  }
}
.frame-item {
  border: 1px dashed #93969b;
  border-radius: 12px;
  margin-bottom: 8px;
  padding: 4px 8px;
}
.progress {
  margin-top: -20px;
  overflow-y: auto;
  height: calc(100vh - 160px);
  &::-webkit-scrollbar-track-piece {
    background: #ffffff;
  }

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #bec5ce;
    border-radius: 20px;
  }
}
</style>
<style>
.el-table_1_column_1
  .cell
  .el-checkbox__input
  .el-checkbox__inner:nth-child(0) {
  display: none !important;
}
</style>
