<template>
  <v-card class="pt-2">
    <v-data-table-server
      :items-per-page="rowspPage"
      :items-length="totalLength"
      @update:itemsPerPage="btRow"
      @update:page="btPage"
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="fileLst"
      height="calc(100vh - 250px)"
      items-per-page-text="Số dòng 1 trang"
      sort-asc-icon="mdi-menu-up"
      sort-desc-icon="mdi-menu-down"
      :items-per-page-options="[
        { value: 10, title: '10' },
        { value: 50, title: '50' },
        { value: 100, title: '100' },
        { value: 10000, title: 'All' },
      ]"
      fixed-header
    >
      <template v-slot:top>
        <div class="d-flex flex-wrap gap-2 px-2">
          <span>
            <v-text-field
              v-model="searchDocumentID"
              label="Mã hồ sơ"
              hide-details
              style="width: 150px !important"
              clearable
            ></v-text-field>
          </span>
          <span>
            <v-text-field
              v-model="searchJobName"
              label="Công việc"
              hide-details
              style="width: 150px !important"
              clearable
            ></v-text-field>
          </span>
          <span>
            <v-text-field
              v-model="searchNote"
              label="Hồ sơ"
              hide-details
              style="width: 150px !important"
              clearable
            ></v-text-field>
          </span>
          <span>
            <v-text-field
              v-model="searchEmployeeName"
              label="Nhân viên"
              hide-details
              style="width: 150px !important"
              clearable
            ></v-text-field>
          </span>
          <span>
            <v-select
              v-model="optionStatus"
              placeholder="Trạng thái"
              density="compact"
              :items="optionStatusLst"
              item-value="value"
              item-title="label"
              chips
              style="width: 150px !important"
            ></v-select>
          </span>
          <v-btn
            color="blue"
            variant="tonal"
            icon="mdi-playlist-plus"
            size="small"
            @click="isShowCreateDocument = true"
          ></v-btn>
          <v-btn
            color="green"
            variant="tonal"
            icon="mdi-reload"
            size="small"
            @click="getGSPDocumentLst"
          ></v-btn>
        </div>
      </template>
      <template v-slot:item.Status="{ item }">
        <v-chip :color="getStatus(item.Status).color" size="small">
          {{ getStatus(item.Status).text }}</v-chip
        >
      </template>
      <template v-slot:item.Action="{ item }">
        <v-icon
          color="green"
          class="me-2"
          size="small"
          style="cursor: pointer"
          @click="btShowProcess(item)"
          >mdi-progress-check</v-icon
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
    </v-data-table-server>
  </v-card>
  <v-dialog v-model="isShowProcess" width="600">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h5 text-medium-emphasis ps-2">Quá trình thực hiện</div>

        <v-btn
          icon="mdi-close"
          variant="text"
          rounded-full
          size="small"
          color="gray"
          @click="isShowProcess = false"
        ></v-btn>
      </v-card-title>
      <v-card-text>
        <v-card class="layout-card">
          <div
            v-for="(item, index) in processLst"
            :key="index"
            class="mx-2 my-2"
          >
            <div class="d-flex">
              <v-chip
                class="mr-2"
                :color="
                  item.Status == 1
                    ? 'blue'
                    : item.Status == 4
                    ? 'green'
                    : item.Status == 5
                    ? 'red'
                    : 'gray'
                "
              >
                {{ item.StepOrder }}
              </v-chip>
              {{ item.StepName }}
            </div>
            <v-sheet
              v-for="(job, indjob) in item.StepLst"
              :key="indjob"
              class="px-1 py-1 mt-1"
              rounded
              :border="
                job.Status == 1
                  ? 'blue md'
                  : job.Status == 4
                  ? 'green md'
                  : job.Status == 5
                  ? 'red md'
                  : 'gray md'
              "
            >
              <div class="text-body-2 position-relative">
                {{ job.JobName }}
                <v-icon
                  v-if="job.Status == 4"
                  class="position-absolute right-0"
                  color="green"
                  size="small"
                  >mdi-check-circle-outline</v-icon
                >
                <v-icon
                  v-if="job.Status == 5"
                  class="position-absolute right-0"
                  color="red"
                  size="small"
                  >mdi-close-circle-outline</v-icon
                >
              </div>
              <div v-for="(ass, indass) in job.AssignLst" :key="indass">
                <div class="text-caption" v-if="ass.UserRole == 'Xử lý'">
                  <div>
                    <v-icon color="blue" size="small">mdi-account-edit</v-icon>
                    {{ ass.FullName }}
                    <v-icon color="blue" size="small" v-if="job.TimeModifyShow"
                      >mdi-clock</v-icon
                    >
                    {{ job.TimeModifyShow }}
                  </div>
                  <div v-html="job.Report"></div>
                </div>
                <div class="text-caption" v-if="ass.UserRole == 'Phê duyệt'">
                  <div>
                    <v-icon color="red" size="small">mdi-account-check</v-icon>
                    {{ ass.FullName }}
                    <v-icon color="red" size="small" v-if="job.TimeApproveShow"
                      >mdi-clock</v-icon
                    >
                    {{ job.TimeApproveShow }}
                  </div>
                  <div v-html="job.NoteApprove"></div>
                </div>
                <div class="file-lst" v-if="ass.FileLst.length > 0">
                  <v-menu
                    location="end"
                    v-for="(file, indfile) in ass.FileLst"
                    :key="indfile"
                  >
                    <template v-slot:activator="{ props }">
                      <v-chip color="gray" v-bind="props" class="mr-1">
                        {{ file.MineFile }}
                      </v-chip>
                    </template>

                    <v-list>
                      <v-list-item v-if="isPreviewSupported(file.MineFile)">
                        <v-list-item-title>
                          <v-btn
                            @click="previewFile(file)"
                            size="small"
                            rounded="8"
                            class="mb-1"
                          >
                            <v-icon class="mr-1">mdi-file-eye</v-icon> Xem trước
                          </v-btn>
                        </v-list-item-title>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-title>
                          <v-btn
                            @click="downloadFile(file)"
                            size="small"
                            rounded="8"
                            color="green"
                            block
                            class="mb-1"
                          >
                            <v-icon class="mr-1">mdi-file-download</v-icon> Tải
                            ngay
                          </v-btn>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </div>
            </v-sheet>
            <v-divider class="my-2" color="blue"></v-divider>
          </div>
        </v-card>
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
        <v-btn color="green" @click="confirmBrief">Xác nhận</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowCreateDocument" max-width="600">
    <v-card>
      <v-card-title>Tạo hồ sơ mới</v-card-title>
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
      </v-card-text>
      <v-card-actions>
        <v-btn @click="isShowCreateDocument = false" text>Hủy</v-btn>
        <v-btn color="green" @click="btCreateDocument">Xác nhận</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowFile" persistent width="800">
    <v-card>
      <v-card-item>
        <div v-if="isLoading">Đang tải...</div>
        <div v-else>
          <strong>{{ nameFile }}</strong>
          <div v-if="fileMine == '.pdf'">
            <iframe
              :src="
                'https://docs.google.com/gview?embedded=true&url=' +
                encodeURIComponent(fileUrl)
              "
              width="100%"
              height="600px"
            ></iframe>
          </div>
          <div v-else>
            <div
              v-html="docContent"
              style="height: calc(100vh - 200px); overflow: auto"
            ></div>
          </div>
        </div>
      </v-card-item>
      <v-card-actions>
        <v-btn @click="isShowFile = false">Đóng</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { CreateGSPDocument, GetGSPDocumentLst } from "@/api/briefApi";

import { ProcessDocument } from "@/api/documentJobApi";
import { GetProcedureLst } from "@/api/procedureApi";
import { formatDateDisplayDDMMYY, formatDateHHDDMM } from "@/helpers/getTime";
import {
  downloadFile,
  fetchDoc,
  fetchXlsxContent,
  isPreviewSupported,
} from "@/utils/function";
export default {
  data() {
    return {
      searchDocumentID: "",
      searchJobName: "",
      searchNote: "",
      searchEmployeeName: "",
      fileLst: [],
      rowspPage: 10,
      pageNumber: 1,
      totalLength: 0,
      optionStatusLst: [
        { value: 1, label: "Mới tạo" },
        { value: 2, label: "Đang làm" },
        { value: 4, label: "Hoàn thành" },
        { value: 0, label: "Tất cả" },
      ],
      optionConfirmLst: [
        { value: 0, label: "Dừng xử lý" },
        { value: 2, label: "Đang xử lý" },
        { value: 3, label: "Hoàn thnh" },
      ],
      optionStatus: 0,
      selectLst: [],
      statusConfirm: null,
      isShowConfirm: false,
      checkRole: false,
      dataAll: [],
      loadding: false,
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
        { title: "Mã hồ sơ", key: "DocumentID", sortable: false },
        { title: "Quy trình", key: "DocName", sortable: false },
        { title: "Công việc", key: "JobName", sortable: false },
        { title: "Hồ sơ", key: "Note", sortable: false },
        {
          title: "Deadline",
          key: "DateExpiredShow",
          sortable: false,
          width: 100,
        },
        { title: "Người xử lý", key: "EmployeeName", sortable: false },
        { title: "", key: "Action", width: 40, align: "center" },
        { title: "Trạng thái", key: "Status", sortable: false, width: 100 },
      ],

      productExcelLst: [],
      isShowCreateDocument: false,
      createDocument: {
        name: "",
        description: "",
      },
      excelFile: null,
      fileUrl: "",
      isShowFile: false,
      docContent: "",
      nameFile: "",
      isLoading: false,
    };
  },
  watch: {
    pageNumber(value) {
      this.getGSPDocumentLst();
    },
    rowspPage(value) {
      this.getGSPDocumentLst();
    },
  },
  methods: {
    btPage(data) {
      this.pageNumber = data;
    },
    btRow(data) {
      this.rowspPage = data;
    },
    isPreviewSupported(fileExtension) {
      return isPreviewSupported(fileExtension);
    },
    downloadFile(file) {
      downloadFile(file);
    },
    async previewFile(file) {
      if (!this.isPreviewSupported(file.MineFile)) {
        alert("File này không hỗ trợ xem trước.");
        return;
      }
      this.isLoading = true;
      this.nameFile = file.NameFile.toUpperCase();
      this.docContent = "";
      const fileExtension = file.MineFile.toLowerCase();
      this.fileMine = fileExtension;
      const previewUrl = `https://sop.idtp.work/api/File/GetDocumentFile?FileName=${file.LinkFile}`;
      if (fileExtension === ".pdf") {
        this.fileUrl = previewUrl;
        window.open(
          "https://docs.google.com/gview?embedded=true&url=" + previewUrl
        );
      } else if (fileExtension === ".docx") {
        this.fileUrl = previewUrl;
        this.isShowFile = true;
        this.docContent = await fetchDoc(this.fileUrl);
      } else if (fileExtension === ".xlsx") {
        this.fileUrl = previewUrl;
        this.isShowFile = true;
        this.docContent = await fetchXlsxContent(this.fileUrl);
      } else if ([".png", ".jpg", ".jpeg"].includes(fileExtension)) {
        this.isShowFile = true;
        this.docContent = `<img lazy src="${previewUrl}" alt="Image preview" width="100%" />`;
      }
      this.isLoading = false;
    },
    btPushToDocinfo(data) {
      this.$router.push("/thong-tin/" + data.DocumentID);
    },

    btShowOpenFile(data) {
      var linkPDF =
        "https://sop.idtp.work/api/File/GetDocumentFile?FileName=" +
        data.LinkFile;
      window.open(linkPDF, "_blank");
    },
    editHS(data) {
      router.push("/thong-tin-xuat-khau/" + data.DocumentID);
    },
    getGSPDocumentLst() {
      this.loadding = true;
      const searchParams = {
        doc: this.searchDocumentID,
        job: this.searchJobName,
        note: this.searchNote,
        em: this.searchEmployeeName,
        sta: this.optionStatus ?? "",
      };
      this.$router.push({
        path: this.$route.path,
        query: searchParams, // Chuyển đổi searchParams thành đối tượng
      });
      const searchString = [
        this.searchDocumentID,
        this.searchJobName,
        this.searchNote,
        this.searchEmployeeName,
        this.optionStatus,
        "",
        "",
        "",
        "",
        "",
      ].join("|");
      GetGSPDocumentLst({
        PageNumber: this.pageNumber,
        RowspPage: this.rowspPage,
        Search: searchString,
        DocID: "",
      }).then((res) => {
        this.fileLst = res.Data.map((item, index) => {
          var num = (this.pageNumber - 1) * this.rowspPage;
          return {
            ...item,
            Key: index + 1 + num,
            DateExpiredShow: formatDateDisplayDDMMYY(item.DateExpired),
          };
        });
        this.totalLength = res.TotalRows;
      });
    },
    getStatus(status) {
      if (status == 0) {
        return { text: "Hủy", color: "error" };
      }
      if (status == 1) {
        return { text: "Mới tạo", color: "blue" };
      }
      if (status == 2) {
        return { text: "Đang làm", color: "info" };
      }
      if (status == 3) {
        return { text: "Tạm dừng", color: "more" };
      }
      if (status == 4) {
        return { text: "Hoàn thành", color: "green" };
      }
    },
    btShowProcess(row) {
      this.fetchProcessDocument(row.DocumentID);
    },
    fetchProcessDocument(documentID) {
      ProcessDocument({ DocumentID: documentID })
        .then((res) => {
          if (res.RespCode === 0) {
            this.processLst = res.DocumentJobLst.map((item, index) => {
              item.StepLst = item.StepLst.map((job, indjob) => {
                return {
                  ...job,
                  TimeModifyShow: formatDateHHDDMM(job.TimeModify),
                  TimeApproveShow: formatDateHHDDMM(job.TimeApprove),
                };
              });
              return {
                ...item,
              };
            });
            this.isShowProcess = true;
          } else {
            notify({
              title: "Error",
              text: res.RespText,
              type: "error",
            });
          }
        })
        .catch((error) => {
          notify({
            title: "Error",
            text: "Failed to fetch process data.",
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
            text: "Hồ sơ đã được tạo thành công",
            type: "success",
          });
          this.isShowCreateDocument = false; // Close dialog
          this.getGSPDocumentLst(); // Refresh the document list
        } else {
          notify({
            title: "Lỗi",
            text: res.RespText,
            type: "error",
          });
        }
      });
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
              text: res.RespText,
              type: "error",
            });
          }
        })
        .catch((error) => {
          notify({
            title: "Error",
            text: "Failed to fetch procedure list.",
            type: "error",
          });
          console.error(error);
        });
    },
  },
  created() {
    this.getGSPDocumentLst();
    this.getProcedureLst(); // Call the new method to fetch procedure list
  },
};
</script>
