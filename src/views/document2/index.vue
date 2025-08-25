<template>
  <v-card class="pt-2">
    <v-data-table-server
      :items-length="totalLength"
      @update:itemsPerPage="btRow"
      @update:page="btPage"
      no-data-text="Không có dữ liệu"
      :headers="headers"
      fixed-header
      :items="fileLst"
      height="calc(100vh - 270px)"
      items-per-page-text="Số dòng 1 trang"
      sort-asc-icon="mdi-menu-up"
      sort-desc-icon="mdi-menu-down"
      item-value="Key"
      :items-per-page-options="[
        { value: 10, title: '10' },
        { value: 50, title: '50' },
        { value: 100, title: '100' },
        { value: 10000, title: 'All' },
      ]"
      :loading="loadding"
    >
      <template v-slot:top>
        <div class="d-flex flex-wrap gap-2 px-2">
          <span>
            <v-text-field
              v-model="searchProduct"
              label="Tên sản phẩm"
              hide-details
              style="width: 150px !important"
              clearable
            ></v-text-field>
          </span>
          <span>
            <v-text-field
              v-model="searchExporter"
              label="Tên xuất khẩu"
              hide-details
              style="width: 150px !important"
              clearable
            ></v-text-field>
          </span>
          <span>
            <v-text-field
              v-model="searchCountry"
              label="Nước"
              hide-details
              style="width: 150px !important"
              clearable
            ></v-text-field>
          </span>
          <span>
            <v-text-field
              v-model="searchCustomer"
              label="Khách"
              hide-details
              style="width: 150px !important"
              clearable
            ></v-text-field>
          </span>
          <span>
            <v-text-field
              v-model="searchResponsible"
              label="Phụ trách"
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
                  <v-select
                    class="pt-2"
                    v-model="sortDeadline"
                    label="Lọc"
                    density="compact"
                    :items="sortDeadlineLst"
                    item-value="value"
                    item-title="label"
                    clearable
                    min-width="150px"
                  ></v-select>
                </v-list-item>
              </v-list>
            </v-menu>
          </span>
          <v-btn
            color="green"
            variant="tonal"
            icon="mdi-reload"
            size="small"
            @click="getGSPDocumentLst"
          ></v-btn>
          <v-btn
            color="green"
            variant="tonal"
            icon="mdi-microsoft-excel"
            size="small"
            @click="btExportExcel"
          >
          </v-btn>
        </div>
      </template>
      <template v-slot:item.Status="{ item }">
        <v-chip :color="getStatus(item.Status).color" size="x-small">
          {{ getStatus(item.Status).text }}</v-chip
        >
        <div style="font-size: 12px">{{ item.EmployeeName }}</div>
      </template>
      <template v-slot:item.DateExpiredShow="{ item }">
        <div style="font-size: 12px">
          <v-chip color="green" size="x-small" v-if="item.DaysWorked != 0">{{
            item.DaysWorked
          }}</v-chip>
          <v-chip color="red" size="x-small" v-if="item.DaysRemaining != 0">
            {{ item.DaysRemaining }}
          </v-chip>
        </div>
        <div style="font-size: 12px">{{ item.DateExpiredShow }}</div>
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
      <template v-slot:item.DocumentID="{ item }">
        <div>{{ item.WarehouseName }}</div>
        <div style="font-size: 12px">{{ item.DocumentID }}</div>
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
              class="px-1 py-1"
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

              <div class="text-caption">
                <div v-if="job.ReportName">
                  <v-icon color="blue" size="small">mdi-account-edit</v-icon>
                  {{ job.ReportName }}
                  <v-icon color="blue" size="small" v-if="job.TimeModify"
                    >mdi-clock</v-icon
                  >
                  {{ job.TimeModifyShow }}
                </div>
                <div v-if="job.Report" v-html="job.Report"></div>
              </div>

              <div class="text-caption">
                <div v-if="job.ManagerName">
                  <v-icon color="red" size="small">mdi-account-check</v-icon>
                  {{ job.ManagerName }}
                  <v-icon color="red" size="small" v-if="job.TimeApproveShow"
                    >mdi-clock</v-icon
                  >
                  {{ job.TimeApproveShow }}
                </div>
                <div v-if="job.NoteApprove" v-html="job.NoteApprove"></div>
              </div>
              <div class="file-lst" v-if="job.FileLst.length > 0">
                <v-menu
                  location="end"
                  v-for="(file, indfile) in job.FileLst"
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
            </v-sheet>
            <v-divider class="my-2" color="blue"></v-divider>
          </div>
        </v-card>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowFile" persistent width="800">
    <v-card>
      <v-card-item>
        <div v-if="isLoading">Đang tải...</div>
        <div v-else>
          <strong>{{ nameFile }}</strong>
          <div style="">
            <div
              v-html="docContent"
              style="overflow-y: auto; height: calc(100vh - 200px); width: 100%"
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
import { GetGSPDocumentLst } from "@/api/briefApi";
import { ProcessDocument } from "@/api/documentJobApi";
import { GetProcedureLst } from "@/api/procedureApi";
import { formatDateDisplayDDMMYY, formatDateHHDDMM } from "@/helpers/getTime";
import {
  downloadFile,
  fetchDoc,
  fetchXlsxContent,
  isPreviewSupported,
} from "@/utils/function";
import { exportExcel } from "./function1";
export default {
  props: {
    docID: String,
  },
  data() {
    return {
      searchProduct: "",
      searchExporter: "",
      searchCountry: "",
      searchCustomer: "",
      searchResponsible: "",
      sortDeadline: "",
      fileLst: [],
      isShowCreateFile: false,
      storageLst: [],
      pageSize: 10,
      currentPage: 1,
      totalLength: 0,
      optionStatusLst: [
        { value: 1, label: "Mới tạo" },
        { value: 2, label: "Đang xử lý" },
        { value: 3, label: "Hoàn thành" },
        { value: 6, label: "Khách check" },
        { value: 8, label: "Nộp cục" },
        { value: 9, label: "Có số" },
        { value: null, label: "Tất cả" },
      ],
      sortDeadlineLst: [
        { value: "ASC", label: "Tăng dần" },
        { value: "DESC", label: "Giảm dần" },
      ],
      optionStatus: null,
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
        { title: "Tên sản phẩm", key: "DocumentID", sortable: false },
        { title: "Tên xuất khẩu", key: "Name2", sortable: false },
        { title: "Nước XK", key: "Country", sortable: false },
        {
          title: "Khách",
          key: "CusName",
          sortable: false,
          width: 100,
        },
        {
          title: "Deadline",
          key: "DateExpiredShow",
          sortable: false,
          width: 116,
          align: "center",
        },
        { title: "Phân loại hồ sơ", key: "Conclusion", sortable: false },
        { title: "", key: "Action", width: 40, align: "center" },
        { title: "Trạng thái", key: "Status", sortable: false, width: 100 },
      ],
      fileUrl: "",
      isShowFile: false,
      docContent: "",
      nameFile: "",
      isLoading: false,
    };
  },
  watch: {
    pageSize(value) {
      this.getGSPDocumentLst();
    },
    currentPage(value) {
      this.getGSPDocumentLst();
    },
  },
  methods: {
    btExportExcel() {
      exportExcel(this.fileLst);
    },
    btPage(data) {
      this.currentPage = data;
    },
    btRow(data) {
      this.pageSize = data;
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
      const previewUrl = `https://rd.icpc1hn.work/api/File/GetDocumentFile?FileName=${file.LinkFile}`;
      console.log(previewUrl);

      // Check for supported file types
      if (fileExtension === ".pdf") {
        this.fileUrl = previewUrl;
        // this.isShowFile = true;
        window.open(
          "https://docs.google.com/gview?embedded=true&url=" + previewUrl
        );
        // this.docContent = `<iframe :src="${this.fileUrl}" width="100%" height="600px"></iframe>`;
      } else if (fileExtension === ".docx") {
        this.fileUrl = previewUrl;
        this.isShowFile = true;
        this.docContent = await fetchDoc(this.fileUrl);
        console.log("123", this.docContent);
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
        "https://rd.icpc1hn.work/api/File/GetDocumentFile?FileName=" +
        data.LinkFile;
      window.open(linkPDF, "_blank");
    },
    editHS(data) {
      router.push("/thong-tin-xuat-khau/" + data.DocumentID);
    },

    getGSPDocumentLst() {
      this.loadding = true;
      const searchParams = {
        pro: this.searchProduct,
        exp: this.searchExporter,
        cou: this.searchCountry,
        cus: this.searchCustomer,
        res: this.searchResponsible,
        sta: this.optionStatus ?? "",
        sort: this.sortDeadline ?? "",
      };
      this.$router.push({
        path: this.$route.path,
        query: searchParams, // Chuyển đổi searchParams thành đối tượng
      });
      const searchString = [
        this.searchProduct,
        this.searchExporter,
        this.searchCountry,
        this.searchCustomer,
        this.searchResponsible,
        this.optionStatus,
        this.sortDeadline,
      ].join("|");

      GetGSPDocumentLst({
        PageNumber: this.currentPage,
        RowspPage: this.pageSize,
        Search: searchString,
        DocID: this.docID,
      }).then((res) => {
        this.fileLst = res.Data.map((item, index) => {
          var a = this.pageSize * (this.currentPage - 1);

          return {
            ...item,
            Key: index + 1 + a,
            DateExpiredShow: formatDateDisplayDDMMYY(item.DateExpired),
            StatusShow: this.getStatusShow(item.Status),
          };
        });
        this.totalLength = res.TotalRows;
        this.loadding = false;
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
      if (status == 6) {
        return { text: "Khách check", color: "orange" };
      }
      if (status == 8) {
        return { text: "Nộp cục", color: "green" };
      }
      if (status == 9) {
        return { text: "Có số", color: "green" };
      }
    },
    getStatusShow(status) {
      if (status == 0) {
        return "Hủy";
      }
      if (status == 1) {
        return "Mới tạo";
      }
      if (status == 2) {
        return "Đang làm";
      }
      if (status == 3) {
        return "Tạm dừng";
      }
      if (status == 4) {
        return "Hoàn thành";
      }
      if (status == 6) {
        return "Khách check";
      }
      if (status == 8) {
        return "Nộp cục";
      }
      if (status == 9) {
        return "Có số";
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
                  Report: this.addStyleToAllImages(
                    job.Report,
                    "width: calc(100%);"
                  ),
                  NoteApprove: this.addStyleToAllImages(
                    job.NoteApprove,
                    "width: calc(100%);"
                  ),
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
    addStyleToAllImages(html, styleString) {
      if (!html) return html;
      return html.replace(/<img([^>]*?)>/gi, (match, attr) => {
        if (/style\s*=/.test(attr)) {
          return match.replace(
            /style\s*=\s*["']([^"']*)["']/i,
            (styleMatch, existingStyles) => {
              return `style="${existingStyles}; ${styleString}"`;
            }
          );
        } else {
          return `<img${attr} style="${styleString}">`;
        }
      });
    },
    // btCreateDocument() {
    //   CreateGSPDocument({
    //     DocumentInfo: {
    //       TypeDoc: this.createDocument.TypeDoc,
    //       Note: this.createDocument.Note,
    //       Data: this.productExcelLst,
    //     },
    //   }).then((res) => {
    //     // Updated to use createDocument
    //     if (res.RespCode === 0) {
    //       notify({
    //         title: "Tạo hồ sơ",
    //         message: "Hồ sơ đã được tạo thành công",
    //         type: "success",
    //       });
    //       this.isShowCreateDocument = false; // Close dialog
    //       this.getGSPDocumentLst(); // Refresh the document list
    //     } else {
    //       notify({
    //         title: "Lỗi",
    //         message: res.RespText,
    //         type: "error",
    //       });
    //     }
    //   });
    // },

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
    this.searchProduct = this.$route.query.pro ?? "";
    this.searchExporter = this.$route.query.exp ?? "";
    this.searchCountry = this.$route.query.cou ?? "";
    this.searchCustomer = this.$route.query.cus ?? "";
    this.searchResponsible = this.$route.query.resr ?? "";
    if (this.$route.query.sta) {
      this.optionStatus = parseInt(this.$route.query.sta);
    }
    this.getGSPDocumentLst();
    // this.getProcedureLst(); // Call the new method to fetch procedure list
  },
};
</script>
