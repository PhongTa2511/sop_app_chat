<template>
  <v-card class="py-4">
    <v-data-table
      :items-per-page="pageSize"
      :items-length="totalLength"
      @update:itemsPerPage="btRow"
      @update:page="btPage"
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="fileLst"
      :search="search"
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
          </span>

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
          <v-btn
            color="blue"
            variant="tonal"
            icon="mdi-playlist-plus"
            style="height: 42px"
            @click="isShowCreateDocument = true"
          ></v-btn>
          <v-btn
            color="green"
            variant="tonal"
            icon="mdi-reload"
            style="height: 42px"
            @click="btExportExcel"
          ></v-btn>
        </div>
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
  <v-dialog v-model="isShowConfirm" width="400">
    <v-card>
      <v-card-title>Phê duyệt hồ sơ</v-card-title>
      <v-card-text>
        <v-select
          v-model="statusConfirm"
          :items="optionConfirmLst"
          item-text="label"
          item-value="value"
          label="Trạng thái"
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="isShowConfirm = false" text>Hủy</v-btn>
        <v-btn color="success" @click="confirmBrief">Xác nhận</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Dialog for creating a document -->
  <v-dialog v-model="isShowCreateDocument" width="600">
    <v-card>
      <v-card-title>Tạo quy trình mới</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="createDocument.TypeDoc"
          label="Tên hồ sơ"
          required
        ></v-text-field>
        <v-text-field
          v-model="createDocument.description"
          label="Mô tả"
          required
        ></v-text-field>
        <!-- Thêm nút tải lên file Excel -->
        <v-file-input
          v-model="excelFile"
          label="Tải lên file Excel"
          accept=".xls,.xlsx"
          @change="handleFileUpload"
          :multiple="false"
        ></v-file-input>
        <!-- Hiển thị danh sách file Excel dưới dạng tag -->
        <div class="mt-3" v-if="excelFileList.length > 0">
          <span v-for="(file, index) in excelFileList" :key="index">
            <v-chip class="mr-2" close @click:close="removeFile(index)">
              {{ file.name }} ({{ file.size }} MB)
              <!-- Hiển thị kích thước bằng MB -->
            </v-chip>
          </span>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="isShowCreateDocument = false" text>Hủy</v-btn>
        <v-btn color="success" @click="btCreateDocument">Tạo</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  GetGSPDocumentLst,
  UpdateGSPDocument,
  CreateGSPDocument,
} from "@/api/briefApi";
import { formatDate, formatDateDisplayDDMMYY } from "@/helpers/getTime";
import { GetProcedureNameInfo } from "@/api/procedureApi";
import { ProcessDocument } from "@/api/documentJobApi";

export default {
  data() {
    return {
      inputSearch: "",
      createFile: {},
      fileLst: [],
      isShowCreateFile: false,
      storageLst: [],
      pageSize: 10,
      currentPage: 1,
      lengthDataTable: 0,
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
      optionStatus: 4,
      selectLst: [],
      statusConfirm: null,
      isShowConfirm: false,
      checkRole: false,
      dataAll: [],
      checkUpdate: 0,
      loadding: false,
      procedureName: {},
      isShowProcess: false,
      workInfo: {},
      headers: [
        {
          title: "STT",
          sortable: false,
          key: "Key",
          align: "center",
          width: 80,
        },
        { title: "Tên sản phẩm", key: "WarehouseName", sortable: false },
        { title: "Tên xuất khẩu", key: "Name2", sortable: false },
        { title: "Nước XK", key: "Country", sortable: false },
        { title: "Khách", key: "CusName", sortable: false, width: 100 },
        { title: "Deadline", key: "DateExpired", sortable: false, width: 100 },
        {
          title: "PL hồ sơ",
          key: "DocName",
          sortable: false,
          width: 100,
        },
        { title: "", key: "Action", width: 80 },
        { title: "Trạng thái", key: "Status", sortable: false, width: 100 },
      ],
      isShowCreateDocument: false, // State for the create document dialog
      createDocument: {
        // Changed from createFile to createDocument
        name: "",
        description: "",
      },
      excelFile: null, // Thêm biến để lưu file Excel
      excelFileList: [], // Danh sách file Excel đã tải lên
      excelFileHeaders: [
        // Định nghĩa headers cho bảng
        { text: "Tên file", value: "name" },
        { text: "Kích thước", value: "size" },
      ],
    };
  },
  watch: {
    // inputSearch() {
    //   console.log("123", this.inputSearch.toLowerCase());
    //   this.fetchTable();
    // },
    optionStatus() {
      this.fetchTable();
    },
    checkUpdate() {
      if (this.checkUpdate != 0) {
        if (this.checkUpdate + 1 == this.selectLst.length) {
          this.loadding = false;
          this.checkUpdate = 0;
        } else {
          this.confirmBrief();
        }
      }
    },
  },
  methods: {
    btShowOpenFile(data) {
      var linkPDF =
        "http://202.191.56.172/RDAPI/File/GetDocumentFile?FileName=" +
        data.LinkFile;
      window.open(linkPDF, "_blank");
    },
    editHS(data) {
      this.$router.push("/thong-tin-xuat-khau/" + data.DocumentID);
    },
    getProcedureNameInfo() {
      GetProcedureNameInfo({
        Data: "QT00005",
      }).then((res) => {
        if (res.RespCode == 0) {
          this.procedureName = res.Data;
        }
      });
    },
    getGSPFileLst() {
      GetGSPDocumentLst({
        PageNumber: this.currentPage,
        RowspPage: this.pageSize,
        Search: this.inputSearch,
        DocID: "",
      }).then((res) => {
        this.dataAll = res.Data.filter(
          (p) => p.Status > 0 && p.TypeDoc != "QT00006"
        ).map((item, index) => {
          return {
            ...item,
            Key: index + 1,
            DateRecept2: formatDateDisplayDDMMYY(item.DateRecept),
          };
        });
        this.fetchTable();
      });
    },
    fetchTable() {
      var dataFilter = [];
      if (this.optionStatus == 4) {
        dataFilter = this.dataAll;
      } else {
        dataFilter = this.dataAll
          .filter((o) => o.Status == this.optionStatus)
          .map((item, index) => {
            return {
              ...item,
              Key: index + 1,
            };
          });
      }
      dataFilter = dataFilter.filter((o) => {
        if (this.inputSearch) {
          return (
            o.DocName.toLowerCase().includes(this.inputSearch.toLowerCase()) ||
            o.WarehouseName.toLowerCase().includes(
              this.inputSearch.toLowerCase()
            ) ||
            o.CompanyName.toLowerCase().includes(this.inputSearch.toLowerCase())
          );
        } else {
          return o;
        }
      });

      this.lengthDataTable = dataFilter.length;

      this.fileLst = dataFilter.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
    handleSelectionChange(val) {
      console.log(val);
      this.selectLst = val;
    },
    confirmBrief() {
      this.loadding = true;
      var fileInfo = this.selectLst[this.checkUpdate];
      UpdateGSPDocument({
        DocumentInfo: {
          WarehouseID: fileInfo.WarehouseID,
          DocumentID: fileInfo.DocumentID,
          TypeDoc: fileInfo.TypeDoc,
          DateRecept: formatDate(fileInfo.DateRecept),
          StepID: fileInfo.StepID,
          StepStt: fileInfo.StepStt,
          DateExpired: formatDate(fileInfo.DateExpired),
          Note: fileInfo.Note,
          Status: this.statusConfirm,
          WarehouseName: fileInfo.WarehouseName,
          CompanyID: fileInfo.CompanyID,
          CompanyName: fileInfo.CompanyName,
          StepName: fileInfo.StepName,
          LinkFile: fileInfo.LinkFile,
          EmployeeCode: fileInfo.EmployeeCode,
        },
      }).then((res) => {
        if (res.RespCode == 0) {
          this.checkUpdate++;
          this.$notify({
            title: "Cập nhật",
            message: "Cập nhật thông tin thành công",
            type: "success",
          });
        } else {
          this.checkUpdate = 0;
          this.loadding = false;
        }
      });
    },
    btShowProcess(row) {
      this.fetchProcessDocument(row.DocumentID);
    },
    fetchProcessDocument(documentID) {
      ProcessDocument({ DocumentID: documentID })
        .then((res) => {
          if (res.RespCode === 0) {
            this.workInfo = res.DocumentJobLst;
            this.isShowProcess = true;
          } else {
            this.$notify({
              title: "Error",
              message: res.RespText,
              type: "error",
            });
          }
        })
        .catch((error) => {
          this.$notify({
            title: "Error",
            message: "Failed to fetch process data.",
            type: "error",
          });
          console.error(error);
        });
    },
    btCreateDocument() {
      CreateGSPDocument(this.createDocument).then((res) => {
        // Updated to use createDocument
        if (res.RespCode === 0) {
          this.$notify({
            title: "Tạo hồ sơ",
            message: "Hồ sơ đã được tạo thành công",
            type: "success",
          });
          this.isShowCreateDocument = false; // Close dialog
          this.getGSPDocumentLst(); // Refresh the document list
        } else {
          this.$notify({
            title: "Lỗi",
            message: res.RespText,
            type: "error",
          });
        }
      });
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.excelFileList = [
          {
            // Chỉ lưu một file
            name: file.name,
            size: (file.size / 1048576).toFixed(2), // Chuyển đổi kích thước từ byte sang MB
          },
        ];
      }
    },
    removeFile(index) {
      this.excelFileList.splice(index, 1); // Xóa file khỏi danh sách
    },
  },
  created() {
    this.getGSPFileLst();
    this.getProcedureNameInfo();
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
