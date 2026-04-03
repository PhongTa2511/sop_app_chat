<template>
  <VCard class="pt-2">
    <VDataTableServer
      :items-per-page="rowspPage"
      :items-length="totalLength"
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="fileLst"
      height="calc(100vh - 250px)"
      items-per-page-text="Số dòng 1 trang"
      sort-asc-icon="mdi-menu-up"
      sort-desc-icon="mdi-menu-down"
      @update:itemsPerPage="btRow"
      :items-per-page-options="[
        { value: 10, title: '10' },
        { value: 50, title: '50' },
        { value: 100, title: '100' },
        { value: 10000, title: 'All' },
      ]"
      @update:page="btPage"
      fixed-header
    >
      <template #top>
        <div class="d-flex flex-wrap gap-2 px-2">
          <span>
            <VTextField
              v-model="searchDocumentID"
              label="Mã hồ sơ"
              hide-details
              style="width: 150px !important"
              clearable
            />
          </span>
          <span>
            <VTextField
              v-model="searchProcedureName"
              label="Quy trình"
              hide-details
              style="width: 150px !important"
              clearable
            />
          </span>

          <span>
            <VTextField
              v-model="searchJobName"
              label="Công việc"
              hide-details
              style="width: 150px !important"
              clearable
            />
          </span>
          <span>
            <VTextField
              v-model="searchNote"
              label="Hồ sơ"
              hide-details
              style="width: 150px !important"
              clearable
            />
          </span>
          <span>
            <VTextField
              v-model="searchEmployeeName"
              label="Nhân viên"
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
          <VBtn
            color="blue"
            variant="tonal"
            icon="mdi-playlist-plus"
            size="small"
            @click="isShowCreateDocument = true"
          />
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
          size="small"
        >
          {{ getStatus(item.Status).text }}
        </VChip>
      </template>
      <template #item.Action="{ item }">
        <VBtn
          color="green"
          class="me-2"
          size="x-small"
          style="cursor: pointer"
          icon="mdi-progress-check"
          @click="btShowProcess(item)"
        />
      </template>
      <template #item.DocumentID="{ item }">
        <div>
          {{ item.Key }}.
          {{ item.DocName }}
        </div>
        <VChip
          size="x-small"
          color="blue"
        >
          {{ item.DocumentID }}
        </VChip>
      </template>
      <template #item.Time="{ item }">
        <VChip
          size="x-small"
          color="blue"
        >
          {{ item.TimeCreateShow }}
        </VChip>
        <VChip
          size="x-small"
          color="green"
        >
          {{ item.DateExpiredShow }}
        </VChip>
      </template>
      <template #item.Key="{ item }">
        <VBtn
          color="orange"
          class="me-2"
          size="x-small"
          style="cursor: pointer"
          icon="mdi-note-edit"
          @click="btPushToDocinfo(item)"
        />
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
    v-model="isShowConfirm"
    width="400"
  >
    <VCard>
      <VCardTitle>Phê duyệt hồ sơ</VCardTitle>
      <VCardText>
        <VSelect
          v-model="statusConfirm"
          :items="optionConfirmLst"
          item-text="label"
          item-value="value"
          label="Trạng thái"
        />
      </VCardText>
      <VCardActions>
        <VBtn
          text
          @click="isShowConfirm = false"
        >
          Hủy
        </VBtn>
        <VBtn
          color="green"
          @click="confirmBrief"
        >
          Xác nhận
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
  <VDialog
    v-model="isShowCreateDocument"
    max-width="600"
  >
    <VCard>
      <VCardTitle>Tạo hồ sơ mới</VCardTitle>
      <VCardText class="py-0">
        <VAutocomplete
          v-model="createDocument.TypeDoc"
          placeholder="Chọn loại quy trình"
          density="compact"
          :items="procedureLst"
          item-value="ProcedureID"
          item-title="ProcedureName"
          chips
          class="mb-2"
          filterable
          clearable
          hide-details=""
        />
        <VTextarea
          v-model="createDocument.Note"
          label="Mô tả"
          required
          :rows="2"
          class="mb-2"
        />
      </VCardText>
      <VCardActions>
        <VBtn
          text
          @click="isShowCreateDocument = false"
        >
          Hủy
        </VBtn>
        <VBtn
          color="green"
          @click="btCreateDocument"
        >
          Xác nhận
        </VBtn>
      </VCardActions>
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
          <div v-if="fileMine == '.pdf'">
            <iframe
              :src="
                'https://docs.google.com/gview?embedded=true&url=' +
                  encodeURIComponent(fileUrl)
              "
              width="100%"
              height="600px"
            />
          </div>
          <div v-else>
            <div
              style="height: calc(100vh - 200px); overflow: auto"
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
import { CreateGSPDocument, GetGSPDocumentLst } from "@/api/briefApi"

import { ProcessDocument } from "@/api/documentJobApi"
import { GetProcedureLst } from "@/api/procedureApi"
import { formatDateDisplayDDMMYY, formatDateHHDDMM } from "@/helpers/getTime"
import {
  downloadFile,
  fetchDoc,
  fetchXlsxContent,
  isPreviewSupported,
} from "@/utils/function"
import { exportExcel2 } from "./function"

export default {
  data() {
    return {
      searchDocumentID: "",
      searchJobName: "",
      searchNote: "",
      searchEmployeeName: "",
      searchProcedureName: "",
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
          title: "",
          sortable: false,
          key: "Key",
          align: "center",
        },
        { title: "Mã hồ sơ", key: "DocumentID", sortable: false },

        // { title: "Quy trình", key: "DocName", sortable: false },
        { title: "Công việc", key: "JobName", sortable: false },
        { title: "Hồ sơ", key: "Note", sortable: false },
        {
          title: "Thời gian",
          key: "Time",
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
    }
  },
  watch: {
    pageNumber(value) {
      this.getGSPDocumentLst()
    },
    rowspPage(value) {
      this.getGSPDocumentLst()
    },
  },
  created() {
    this.getGSPDocumentLst()
    this.getProcedureLst() // Call the new method to fetch procedure list
  },
  methods: {
    btExportExcel() {
      exportExcel2(this.fileLst)
    },
    btPage(data) {
      this.pageNumber = data
    },
    btRow(data) {
      this.rowspPage = data
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
      if (fileExtension === ".pdf") {
        this.fileUrl = previewUrl
        window.open(
          "https://docs.google.com/gview?embedded=true&url=" + previewUrl,
        )
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
        doc: this.searchDocumentID,
        job: this.searchJobName,
        note: this.searchNote,
        em: this.searchEmployeeName,
        sta: this.optionStatus ?? "",
      }

      this.$router.push({
        path: this.$route.path,
        query: searchParams, // Chuyển đổi searchParams thành đối tượng
      })

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
        this.searchProcedureName,
      ].join("|")

      GetGSPDocumentLst({
        PageNumber: this.pageNumber,
        RowspPage: this.rowspPage,
        Search: searchString,
        DocID: "",
      }).then(res => {
        this.fileLst = res.Data.map((item, index) => {
          var num = (this.pageNumber - 1) * this.rowspPage
          
          return {
            ...item,
            Key: index + 1 + num,
            DateExpiredShow: formatDateDisplayDDMMYY(item.DateExpired),
            TimeCreateShow: formatDateDisplayDDMMYY(item.TimeCreate),
            StatusShow: this.getStatus(item.Status).text,
          }
        })
        this.totalLength = res.TotalRows
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
    btCreateDocument() {
      CreateGSPDocument({
        DocumentInfo: {
          TypeDoc: this.createDocument.TypeDoc,
          Note: this.createDocument.Note,
          Data: this.productExcelLst,
        },
      }).then(res => {
        // Updated to use createDocument
        if (res.RespCode === 0) {
          notify({
            title: "Tạo hồ sơ",
            text: "Hồ sơ đã được tạo thành công",
            type: "success",
          })
          this.isShowCreateDocument = false // Close dialog
          this.getGSPDocumentLst() // Refresh the document list
        } else {
          notify({
            title: "Lỗi",
            text: res.RespText,
            type: "error",
          })
        }
      })
    },

    getProcedureLst() {
      GetProcedureLst({
        PageNumber: 1,
        RowspPage: 300,
        Search: "",
      })
        .then(res => {
          if (res.RespCode === 0) {
            this.procedureLst = res.Data // Assuming you want to store the result in procedureLst
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
            text: "Failed to fetch procedure list.",
            type: "error",
          })
          console.error(error)
        })
    },
  },
}
</script>
