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
  <v-dialog v-model="isShowCreateDocument" width="800">
    <v-card>
      <v-card-title>Tạo quy trình mới</v-card-title>
      <v-card-text>
        <v-select
          placeholder="Chọn loại quy trình"
          density="compact"
          v-model="createDocument.TypeDoc"
          :items="procedureLst"
          item-value="ProcedureID"
          item-title="ProcedureName"
          chips
          class="mb-2"
        ></v-select>
        <v-textarea
          v-model="createDocument.Note"
          label="Mô tả"
          required
          :rows="2"
          class="mb-2"
        ></v-textarea>
        <!-- Thay đổi thẻ v-file-input thành nút v-btn để mở tải file Excel -->
        <v-btn
          color="green"
          rounded="8"
          @click="$refs.fileInput.click()"
          class="mr-2"
        >
          Tải lên file Excel
        </v-btn>
        <v-btn color="primary" rounded="8" @click="btExportExcel">
          Excel mẫu
        </v-btn>
        <input
          ref="fileInput"
          type="file"
          accept=".xls,.xlsx"
          @change="handleFileUpload"
          style="display: none"
        />
        <v-data-table
          :headers="headersProduct"
          :items="productExcelLst"
          hide-default-footer
        >
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="isShowCreateDocument = false" text>Hủy</v-btn>
        <v-btn color="green" @click="btCreateDocument">Xác nhận</v-btn>
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
import {
  formatDate,
  formatDateDisplayDDMMYY,
  formatDateUpload,
} from "@/helpers/getTime";
import { GetProcedureNameInfo, GetProcedureLst } from "@/api/procedureApi";
import { ProcessDocument } from "@/api/documentJobApi";
import { exportExcel, excelDateToJSDate, convertToDate } from "./function";
import XLSX from "xlsx";

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
      headersProduct: [
        {
          title: "STT",
          sortable: false,
          key: "Key",
          width: 40,
          align: "center",
        },
        {
          title: "Tên hàng hóa",
          key: "ProductName",
          sortable: false,
          width: 200,
        },
        { title: "Số lô", key: "Lotcode", sortable: false, width: 80 },
        {
          title: "Mã BFO",
          key: "BFO",
          sortable: false,
          align: "center",
        },
        {
          title: "Hạn dùng",
          key: "ExpDateShow",
          sortable: false,
          align: "center",
        },
        {
          title: "SL",
          key: "Quantity",
          sortable: false,
          align: "center",
        },
        {
          title: "ĐVT",
          key: "Unit",
          sortable: false,
          align: "center",
        },
        {
          title: "Tình trạng",
          key: "StatusText",
          sortable: false,
          align: "center",
        },
        {
          title: "Quyết định",
          key: "Decision",
          sortable: false,
          align: "center",
        },
        {
          title: "Ghi chú",
          key: "Note",
          sortable: false,
          align: "center",
        },
      ],
      productExcelLst: [],
      isShowCreateDocument: false, // State for the create document dialog
      createDocument: {
        // Changed from createFile to createDocument
        name: "",
        description: "",
      },
      excelFile: null,
    };
  },
  methods: {
    btExportExcel() {
      exportExcel();
    },
    btShowOpenFile(data) {
      var linkPDF =
        "http://202.191.56.172/RDAPI/File/GetDocumentFile?FileName=" +
        data.LinkFile;
      window.open(linkPDF, "_blank");
    },
    editHS(data) {
      router.push("/thong-tin-xuat-khau/" + data.DocumentID);
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
        this.fileLst = res.Data.map((item, index) => {
          return {
            ...item,
            Key: index + 1,
            DateRecept2: formatDateDisplayDDMMYY(item.DateRecept),
          };
        });
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
            notify({
              title: "Error",
              message: res.RespText,
              type: "error",
            });
          }
        })
        .catch((error) => {
          notify({
            title: "Error",
            message: "Failed to fetch process data.",
            type: "error",
          });
          console.error(error);
        });
    },
    btCreateDocument() {
      CreateGSPDocument({
        DocumentInfo: {
          TypeDoc: this.createDocument.TypeDoc,
          Note: this.createDocument.Note,
          Data: this.productExcelLst,
        },
      }).then((res) => {
        // Updated to use createDocument
        if (res.RespCode === 0) {
          notify({
            title: "Tạo hồ sơ",
            message: "Hồ sơ đã được tạo thành công",
            type: "success",
          });
          this.isShowCreateDocument = false; // Close dialog
          this.getGSPDocumentLst(); // Refresh the document list
        } else {
          notify({
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
        const reader = new FileReader();
        reader.onload = (e) => {
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
          console.log(data);

          this.productExcelLst = this.convertToReq(data).map((item, index) => {
            return {
              ...item,
              Key: index + 1,
            };
          });
        };
        reader.readAsBinaryString(file);
      }
    },

    convertToReq(data) {
      var lstReq = [];
      for (var i = 1; i < data.length; i++) {
        if (data[i][1]) {
          console.log(new Date(data[i][4]), data[i][4]);

          var req = {
            Key: data[i][0],
            ProductName: data[i][1],
            Lotcode: data[i][2],
            BFO: data[i][3],
            ExpDateShow: Number.isInteger(data[i][4])
              ? formatDateUpload(excelDateToJSDate(data[i][4]))
              : formatDateUpload(convertToDate(data[i][4])),
            ExpDate: Number.isInteger(data[i][4])
              ? formatDateUpload(excelDateToJSDate(data[i][4])) + " 00:00:00"
              : formatDateUpload(convertToDate(data[i][4])) + " 00:00:00",
            Quantity: data[i][5],
            Unit: data[i][6],
            StatusText: data[i][7],
            Decision: data[i][8],
            Note: data[i][9],
          };
          lstReq.push(req);
        }
      }
      return lstReq;
    },
    getProcedureLst() {
      GetProcedureLst({
        PageNumber: 1,
        RowspPage: 100,
        Search: "",
      })
        .then((res) => {
          if (res.RespCode === 0) {
            this.procedureLst = res.Data; // Assuming you want to store the result in procedureLst
          } else {
            notify({
              title: "Error",
              message: res.RespText,
              type: "error",
            });
          }
        })
        .catch((error) => {
          notify({
            title: "Error",
            message: "Failed to fetch procedure list.",
            type: "error",
          });
          console.error(error);
        });
    },
  },
  created() {
    this.getGSPFileLst();
    this.getProcedureNameInfo();
    this.getProcedureLst(); // Call the new method to fetch procedure list
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
