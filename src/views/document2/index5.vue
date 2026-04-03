<template>
  <VCard class="pt-2">
    <VDataTableServer
      :items-length="totalLength"
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="fileLst"
      height="calc(100vh - 250px)"
      items-per-page-text="Số dòng 1 trang"
      sort-asc-icon="mdi-menu-up"
      sort-desc-icon="mdi-menu-down"
      @update:itemsPerPage="btRow"
      item-value="Key"
      @update:page="btPage"
      :items-per-page-options="[
        { value: 10, title: '10' },
        { value: 50, title: '50' },
        { value: 100, title: '100' },
        { value: 10000, title: 'All' },
      ]"
      fixed-header
    >
      <template #top>
        <div class="d-flex flex-wrap gap-2 px-2">
          <span>
            <VTextField
              v-model="searchProduct"
              label="Tên sản phẩm"
              hide-details
              style="width: 150px !important"
              clearable
            />
          </span>
          <span>
            <VTextField
              v-model="searchExporter"
              label="Tên xuất khẩu"
              hide-details
              style="width: 150px !important"
              clearable
            />
          </span>
          <span>
            <VTextField
              v-model="searchCountry"
              label="Nước"
              hide-details
              style="width: 150px !important"
              clearable
            />
          </span>
          <span>
            <VTextField
              v-model="searchCustomer"
              label="Khách"
              hide-details
              style="width: 150px !important"
              clearable
            />
          </span>
          <span>
            <VTextField
              v-model="searchResponsible"
              label="Phụ trách"
              hide-details
              style="width: 150px !important"
              clearable
            />
          </span>
          <span>
            <VSelect
              v-model="optionStatus"
              placeholder="Trạng thái"
              density="compact"
              :items="optionStatusLst"
              item-value="value"
              item-title="label"
              chips
              style="width: 150px !important"
            />
          </span>
          <span>
            <VMenu :close-on-content-click="false">
              <template #activator="{ props }">
                <VBtn
                  color="blue"
                  size="small"
                  icon=" mdi-filter"
                  v-bind="props"
                />
              </template>
              <VList>
                <VListItem>
                  <VSelect
                    v-model="sortDeadline"
                    class="pt-2"
                    label="Lọc"
                    density="compact"
                    :items="sortDeadlineLst"
                    item-value="value"
                    item-title="label"
                    clearable
                    min-width="150px"
                  />
                </VListItem>
              </VList>
            </VMenu>
          </span>
          <VBtn
            color="green"
            variant="tonal"
            icon="mdi-reload"
            size="small"
            @click="getGSPDocumentLst"
          />
          <VBtn
            color="green"
            variant="tonal"
            icon="mdi-microsoft-excel"
            size="small"
            @click="btExportExcel"
          />
        </div>
      </template>
      <template #item.Status="{ item }">
        <VChip
          :color="getStatus(item.Status).color"
          size="x-small"
        >
          {{ getStatus(item.Status).text }}
        </VChip>
        <div style="font-size: 12px">
          {{ item.EmployeeName }}
        </div>
      </template>
      <template #item.Action="{ item }">
        <VIcon
          color="green"
          class="me-2"
          size="small"
          style="cursor: pointer"
          @click="btShowProcess(item)"
        >
          mdi-progress-check
        </VIcon>
      </template>
      <template #item.ProductName="{ item }">
        <div>{{ item.ProductName }}</div>
        <div style="font-size: 12px; color: rgb(var(--v-theme-primary))">
          {{ item.DocumentID }}
        </div>
      </template>
      <template #item.DateExpiredShow="{ item }">
        <div style="font-size: 12px">
          <VChip
            v-if="item.DaysWorked != 0"
            color="green"
            size="x-small"
          >
            {{
              item.DaysWorked
            }}
          </VChip>
          <VChip
            v-if="item.DaysRemaining != 0"
            color="red"
            size="x-small"
          >
            {{ item.DaysRemaining }}
          </VChip>
        </div>
        <div style="font-size: 12px">
          {{ item.DateExpiredShow }}
        </div>
      </template>
      <template #item.Key="{ item }">
        {{ item.Key }}
        <VIcon
          color="orange"
          class="me-2"
          size="small"
          style="cursor: pointer"
          @click="btPushToDocinfo(item)"
        >
          mdi-note-edit
        </VIcon>
      </template>
    </VDataTableServer>
  </VCard>
  <VDialog
    v-model="isShowProcess"
    width="600"
  >
    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center">
        <div class="text-h5 text-medium-emphasis ps-2">
          Quá trình thực hiện
        </div>

        <VBtn
          icon="mdi-close"
          variant="text"
          rounded-full
          size="small"
          color="gray"
          @click="isShowProcess = false"
        />
      </VCardTitle>
      <VCardText>
        <VCard class="layout-card">
          <div
            v-for="(item, index) in processLst"
            :key="index"
            class="mx-2 my-2"
          >
            <div class="d-flex">
              <VChip
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
              </VChip>
              {{ item.StepName }}
            </div>
            <VSheet
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
                <VIcon
                  v-if="job.Status == 4"
                  class="position-absolute right-0"
                  color="green"
                  size="small"
                >
                  mdi-check-circle-outline
                </VIcon>
                <VIcon
                  v-if="job.Status == 5"
                  class="position-absolute right-0"
                  color="red"
                  size="small"
                >
                  mdi-close-circle-outline
                </VIcon>
              </div>
              <div
                v-for="(ass, indass) in job.AssignLst"
                :key="indass"
              >
                <div
                  v-if="ass.UserRole == 'Xử lý'"
                  class="text-caption"
                >
                  <div>
                    <VIcon
                      color="blue"
                      size="small"
                    >
                      mdi-account-edit
                    </VIcon>
                    {{ ass.FullName }}
                    <VIcon
                      color="blue"
                      v-if="job.TimeModifyShow"
                      size="small"
                    >
                      mdi-clock
                    </VIcon>
                    {{ job.TimeModifyShow }}
                  </div>
                  <div v-html="job.Report" />
                </div>
                <div
                  v-if="ass.UserRole == 'Phê duyệt'"
                  class="text-caption"
                >
                  <div>
                    <VIcon
                      color="red"
                      size="small"
                    >
                      mdi-account-check
                    </VIcon>
                    {{ ass.FullName }}
                    <VIcon
                      color="red"
                      v-if="job.TimeApproveShow"
                      size="small"
                    >
                      mdi-clock
                    </VIcon>
                    {{ job.TimeApproveShow }}
                  </div>
                  <div v-html="job.NoteApprove" />
                </div>
                <div
                  v-if="ass.FileLst.length > 0"
                  class="file-lst"
                >
                  <VMenu
                    v-for="(file, indfile) in ass.FileLst"
                    :key="indfile"
                    location="end"
                  >
                    <template #activator="{ props }">
                      <VTooltip location="top">
                        <template #activator="{ props: tooltipProps }">
                          <VChip
                            color="gray"
                            class="mr-1"
                            v-bind="{ ...props, ...tooltipProps }"
                          >
                            {{ file.MineFile }}
                          </VChip>
                        </template>

                        <span>{{ file.NameFile }}</span>
                      </VTooltip>
                    </template>

                    <VList>
                      <VListItem v-if="isPreviewSupported(file.MineFile)">
                        <VListItemTitle>
                          <VBtn
                            @click="previewFile(file)"
                            size="small"
                            rounded="8"
                            class="mb-1"
                          >
                            <v-icon class="mr-1">mdi-file-eye</v-icon> Xem trước
                          </VBtn>
                        </VListItemTitle>
                      </VListItem>

                      <VListItem>
                        <VListItemTitle>
                          <VBtn
                            @click="downloadFile(file)"
                            size="small"
                            rounded="8"
                            color="green"
                            block
                            class="mb-1"
                          >
                            <v-icon class="mr-1">mdi-file-download</v-icon> Tải
                            ngay
                          </VBtn>
                        </VListItemTitle>
                      </VListItem>
                    </VList>
                  </VMenu>
                </div>
              </div>
            </VSheet>
            <VDivider
              class="my-2"
              color="blue"
            />
          </div>
        </VCard>
      </VCardText>
    </VCard>
  </VDialog>
  <VDialog
    v-model="isShowFile"
    persistent
    width="800"
  >
    <VCard>
      <VCardItem>
        <div v-if="isLoading">
          Đang tải...
        </div>
        <div v-else>
          <strong>{{ nameFile }}</strong>
          <div style="">
            <div
              style="overflow-y: auto; height: calc(100vh - 200px); width: 100%"
              v-html="docContent"
            />
          </div>
        </div>
      </VCardItem>
      <VCardActions>
        <VBtn @click="isShowFile = false">
          Đóng
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import { GetGSPDocumentLst } from "@/api/briefApi"

import { ProcessDocument } from "@/api/documentJobApi"
import { GetProcedureLst } from "@/api/procedureApi"
import { formatDateDisplayDDMMYY, formatDateHHDDMM } from "@/helpers/getTime"
import {
  downloadFile,
  fetchDoc,
  fetchXlsxContent,
  isPreviewSupported,
} from "@/utils/function"
import { exportExcel } from "./function5"

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
        { title: "Tên sản phẩm", key: "ProductName", sortable: false },
        { title: "Tên xuất khẩu", key: "ProductExport", sortable: false },
        { title: "QT", key: "DocName", sortable: false },
        { title: "Phân loại", key: "ProductType", sortable: false },
        { title: "Nước XK", key: "Country", sortable: false },
        {
          title: "Deadline",
          key: "DateExpiredShow",
          sortable: false,
          width: 116,
          align: "center",
        },
        { title: "", key: "Action", width: 40, align: "center" },
        { title: "Trạng thái", key: "Status", sortable: false, width: 100 },
      ],
      fileUrl: "",
      isShowFile: false,
      docContent: "",
      nameFile: "",
      isLoading: false,
    }
  },
  watch: {
    pageSize(value) {
      this.getGSPDocumentLst()
    },
    currentPage(value) {
      this.getGSPDocumentLst()
    },
  },
  created() {
    this.searchProduct = this.$route.query.pro ?? ""
    this.searchExporter = this.$route.query.exp ?? ""
    this.searchCountry = this.$route.query.cou ?? ""
    this.searchCustomer = this.$route.query.cus ?? ""
    this.searchResponsible = this.$route.query.resr ?? ""
    if (this.$route.query.sta) {
      this.optionStatus = parseInt(this.$route.query.sta)
    }
    this.getGSPDocumentLst()

    // this.getProcedureLst(); // Call the new method to fetch procedure list
  },
  methods: {
    btExportExcel() {
      exportExcel(this.fileLst)
    },
    btPage(data) {
      this.currentPage = data
    },
    btRow(data) {
      this.pageSize = data
    },
    isPreviewSupported(fileExtension) {
      return isPreviewSupported(fileExtension)
    },
    downloadFile(file) {
      downloadFile(file)
    },
    async previewFile(file) {
      if (!this.isPreviewSupported(file.MineFile)) {
        alert("File này không hỗ trợ xem trước.")
        
        return
      }
      this.isLoading = true
      this.nameFile = file.NameFile.toUpperCase()
      this.docContent = ""

      const fileExtension = file.MineFile.toLowerCase()

      this.fileMine = fileExtension

      const previewUrl = `https://sop.idtp.work/api/File/GetDocumentFile?FileName=${file.LinkFile}`

      console.log(previewUrl)

      // Check for supported file types
      if (fileExtension === ".pdf") {
        this.fileUrl = previewUrl

        // this.isShowFile = true;
        window.open(
          "https://docs.google.com/gview?embedded=true&url=" + previewUrl,
        )

        // this.docContent = `<iframe :src="${this.fileUrl}" width="100%" height="600px"></iframe>`;
      } else if (fileExtension === ".docx") {
        this.fileUrl = previewUrl
        this.isShowFile = true
        this.docContent = await fetchDoc(this.fileUrl)
      } else if (fileExtension === ".xlsx") {
        this.fileUrl = previewUrl
        this.isShowFile = true
        this.docContent = await fetchXlsxContent(this.fileUrl)
      } else if ([".png", ".jpg", ".jpeg"].includes(fileExtension)) {
        this.isShowFile = true
        this.docContent = `<img lazy src="${previewUrl}" alt="Image preview" width="100%" />`
      }
      this.isLoading = false
    },
    btPushToDocinfo(data) {
      this.$router.push("/thong-tin/" + data.DocumentID)
    },

    btShowOpenFile(data) {
      var linkPDF =
        "https://sop.idtp.work/api/File/GetDocumentFile?FileName=" +
        data.LinkFile
      window.open(linkPDF, "_blank")
    },
    editHS(data) {
      router.push("/thong-tin-xuat-khau/" + data.DocumentID)
    },

    getGSPDocumentLst() {
      this.loadding = true

      const searchParams = {
        pro: this.searchProduct,
        exp: this.searchExporter,
        cou: this.searchCountry,
        cus: this.searchCustomer,
        res: this.searchResponsible,
        sta: this.optionStatus ?? "",
        sort: this.sortDeadline ?? "",
      }

      this.$router.push({
        path: this.$route.path,
        query: searchParams, // Chuyển đổi searchParams thành đối tượng
      })

      const searchString = [
        "",
        "",
        "",
        this.searchResponsible,
        this.optionStatus,
        this.searchProduct,
        this.searchExporter,
        this.searchCountry,
        this.searchCustomer,
        this.sortDeadline,
        "",
      ].join("|")

      GetGSPDocumentLst({
        PageNumber: this.currentPage,
        RowspPage: this.pageSize,
        Search: searchString,
        DocID: this.docID,
      }).then(res => {
        this.fileLst = res.Data.map((item, index) => {
          var a = this.pageSize * (this.currentPage - 1)

          return {
            ...item,
            Key: index + 1 + a,
            DateExpiredShow: formatDateDisplayDDMMYY(item.DateExpired),
            StatusShow: this.getStatusShow(item.Status),
          }
        })
        this.totalLength = res.TotalRows
        this.loadding = false
      })
    },
    getStatus(status) {
      if (status == 0) {
        return { text: "Hủy", color: "error" }
      }
      if (status == 1) {
        return { text: "Mới tạo", color: "blue" }
      }
      if (status == 2) {
        return { text: "Đang làm", color: "info" }
      }
      if (status == 3) {
        return { text: "Tạm dừng", color: "more" }
      }
      if (status == 4) {
        return { text: "Hoàn thành", color: "green" }
      }
      if (status == 6) {
        return { text: "Khách check", color: "orange" }
      }
    },
    getStatusShow(status) {
      if (status == 0) {
        return "Hủy"
      }
      if (status == 1) {
        return "Mới tạo"
      }
      if (status == 2) {
        return "Đang làm"
      }
      if (status == 3) {
        return "Tạm dừng"
      }
      if (status == 4) {
        return "Hoàn thành"
      }
      if (status == 6) {
        return "Khách check"
      }
      if (status == 8) {
        return "Nộp cục"
      }
      if (status == 7) {
        return "Chờ phụ liệu"
      }
      if (status == 9) {
        return "Có số"
      }
    },
    btShowProcess(row) {
      this.fetchProcessDocument(row.DocumentID)
    },
    fetchProcessDocument(documentID) {
      ProcessDocument({ DocumentID: documentID })
        .then(res => {
          if (res.RespCode === 0) {
            this.processLst = res.DocumentJobLst.map((item, index) => {
              item.StepLst = item.StepLst.map((job, indjob) => {
                return {
                  ...job,
                  TimeModifyShow: formatDateHHDDMM(job.TimeModify),
                  TimeApproveShow: formatDateHHDDMM(job.TimeApprove),
                  Report: this.addStyleToAllImages(
                    job.Report,
                    "width: calc(100%);",
                  ),
                  NoteApprove: this.addStyleToAllImages(
                    job.NoteApprove,
                    "width: calc(100%);",
                  ),
                }
              })
              
              return {
                ...item,
              }
            })
            this.isShowProcess = true
          } else {
            notify({
              title: "Error",
              text: res.RespText,
              type: "error",
            })
          }
        })
        .catch(error => {
          notify({
            title: "Error",
            text: "Failed to fetch process data.",
            type: "error",
          })
          console.error(error)
        })
    },
    addStyleToAllImages(html, styleString) {
      if (!html) return html
      
      return html.replace(/<img([^>]*?)>/gi, (match, attr) => {
        if (/style\s*=/.test(attr)) {
          return match.replace(
            /style\s*=\s*["']([^"']*)["']/i,
            (styleMatch, existingStyles) => {
              return `style="${existingStyles}; ${styleString}"`
            },
          )
        } else {
          return `<img${attr} style="${styleString}">`
        }
      })
    },
    getProcedureLst() {
      GetProcedureLst({
        PageNumber: 1,
        RowspPage: 100,
        Search: "",
      })
        .then(res => {
          if (res.RespCode === 0) {
            this.procedureLst = res.Data // Assuming you want to store the result in procedureLst
          } else {
            notify({
              title: "Error",
              message: res.RespText,
              type: "error",
            })
          }
        })
        .catch(error => {
          notify({
            title: "Error",
            message: "Failed to fetch procedure list.",
            type: "error",
          })
          console.error(error)
        })
    },
  },
}
</script>
