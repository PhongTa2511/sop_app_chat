<template>
  <v-card class="pt-2">
    <v-data-table-server
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
          <span>
            <v-menu :close-on-content-click="false">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue"
                  size="small"
                  icon=" mdi-filter"
                  v-bind="props"
                >
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-text-field
                    v-model="proName"
                    label="Hồ sơ"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  ></v-text-field>

                  <v-text-field
                    v-model="workName"
                    label="Công việc"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  ></v-text-field>

                  <v-text-field
                    v-model="note"
                    label="Ghi chú"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  ></v-text-field>
                  <v-text-field
                    v-model="employeeName"
                    label="Nhân viên"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  ></v-text-field>
                  <v-select
                    class="pt-2"
                    v-model="workOver"
                    label="Tình trạng"
                    density="compact"
                    :items="workOverLst"
                    item-value="value"
                    item-title="value"
                  ></v-select>
                  <v-btn block class="rounded mt-2" @click="getDocumentJobByEm"
                    >Tìm kiếm</v-btn
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </span>
          <v-btn
            color="green"
            variant="tonal"
            icon="mdi-reload"
            size="small"
            @click="getDocumentJobByEm"
          ></v-btn>
        </div>
      </template>
      <template v-slot:item.Status="{ item }">
        <v-chip :color="getStatus(item.Status).color" size="x-small">
          {{ getStatus(item.Status).text }}</v-chip
        >
        <div style="font-size: 12px">
          {{ item.FullName }}
        </div>
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
      <template v-slot:item.Time="{ item }">
        <div style="color: green">
          {{ item.TimeStartShow }}
        </div>
        <div style="color: red">
          {{ item.TimeEndShow }}
        </div>
      </template>
      <template v-slot:item.ProcedureName="{ item }">
        <div :class="itemRowBackground(item)">
          {{ item.ProcedureName }}
        </div>
      </template>
      <template v-slot:item.StepName="{ item }">
        <div :class="itemRowBackground(item)">
          {{ item.StepName }}
        </div>
      </template>
      <template v-slot:item.JobName="{ item }">
        <div :class="itemRowBackground(item)">
          {{ item.JobName }}
        </div>
      </template>
      <template v-slot:item.Note="{ item }">
        <div :class="itemRowBackground(item)">
          {{ item.Note }}
        </div>
      </template>
    </v-data-table-server>
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
import { formatDateDisplayDDMMYY, formatDate } from "@/helpers/getTime";
import { ProcessDocument, GetDocumentJobByEm } from "@/api/documentJobApi";

export default {
  data() {
    return {
      isShowProcess: false,
      loadding: false,

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
        { title: "Ghi chú", key: "Note", sortable: false },

        {
          title: "Thời gian",
          key: "Time",
          sortable: false,
          width: 100,
        },

        // { title: "", key: "Action", width: 40, align: "center" },
        { title: "Trạng thái", key: "Status", sortable: false, width: 120 },
      ],
      jobLst: [],
      workOver: "Tất cả",
      workOverLst: [
        { value: "Tất cả" },
        { value: "Quá hạn" },
        { value: "Đúng hạn" },
      ],
      proName: "",
      workName: "",
      note: "",
      employeeName: "",
    };
  },
  watch: {
    search() {
      this.getDocumentJobByEm();
    },
    pageNumber() {
      this.getDocumentJobByEm();
    },
    rowspPage() {
      this.getDocumentJobByEm();
    },
  },
  methods: {
    itemRowBackground(item) {
      const endDate = new Date(item.TimeEnd);
      endDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (endDate.getTime() < today.getTime()) {
        return "wilExpired365";
      }
      return "";
    },
    btPushToDocinfo(data) {
      this.$router.push("/thong-tin-cong-viec/" + data.RowID);
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
        return { text: "Đã báo cáo", color: "blue" };
      }
      if (status == 4) {
        return { text: "Hoàn thành", color: "green" };
      }
    },
    getDocumentJobByEm() {
      this.loadding = true;
      const searchParams = {
        proName: this.proName,
        workName: this.workName,
        note: this.note,
        employeeName: this.employeeName,
        workOver: this.workOver,
      };
      this.$router.push({
        path: this.$route.path,
        query: searchParams, // Chuyển đổi searchParams thành đối tượng
      });
      GetDocumentJobByEm({
        PageNumber: this.pageNumber,
        RowspPage: this.rowspPage,
        Status: 1,
        Search:
          (this.proName ?? "") +
          "|" +
          (this.workName ?? "") +
          "|" +
          (this.note ?? "") +
          "|" +
          (this.employeeName ?? "") +
          "|" +
          (this.workOver ?? ""),
      }).then((res) => {
        if (res.RespCode == 0) {
          this.jobLst = res.DocumentJobLst.map((item, index) => {
            var dateStart = new Date(item.TimeStart);
            var num = (this.pageNumber - 1) * this.rowspPage;
            dateStart.setDate(dateStart.getDate() + item.QuotaTime ?? 0);
            return {
              ...item,
              Key: index + 1 + num,
              TimeStartShow: formatDateDisplayDDMMYY(item.TimeStart),
              TimeEndShow: formatDateDisplayDDMMYY(dateStart),
              TimeEnd: formatDate(dateStart),
            };
          });
          this.totalLength = res.TotalRows;
        }
        this.loadding = false;
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
.wilExpired365 {
  color: red;
}
</style>
